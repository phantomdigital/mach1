#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  createClient,
  createMigration,
  createWriteClient,
} from "@prismicio/client";
import {
  BATCHES,
  SOURCE_LANG,
  TARGET_LANG,
  applyTranslations,
  clone,
  createRateLimiter,
  findEmptyActionableLinks,
  getAtPath,
  loadManifests,
  setAtPath,
  validateEntry,
  walkDocumentLinks,
} from "./core.mjs";

const REPOSITORY_NAME = process.env.PRISMIC_REPOSITORY_NAME || "mach1logistics";
const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_DIRECTORY = path.resolve(SCRIPT_DIRECTORY, "../..");
const MANIFEST_DIRECTORY = path.join(SCRIPT_DIRECTORY, "manifests");
const EMPTY_LINK_FALLBACKS = {
  footer: [
    ["data.link_sections[1].links[0].link", "aQaw2xEAACMASABe"],
    ["data.link_sections[1].links[1].link", "acNeuBEAAJEso3wk"],
    ["data.link_sections[1].links[2].link", "aXWRyBEAACIAVxzr"],
  ],
};
// This unpublished Chinese draft predates the migration and is not returned by
// the public Content API, but Prismic still reserves it as the English page's
// zh-cn alternate. Updating it avoids creating a duplicate translation.
const UNPUBLISHED_TARGET_IDS = new Map([
  ["aLAI-hAAACQA6PTG", "aqyxcBEAAC4Aw_u1"],
  ["aO4G5RIAACEAZBKV", "aqyxchEAACgAw_u5"],
  ["aPl28hAAACIARP1H", "aqyxdREAACoAw_vB"],
  ["aPMcXRAAACQAqkT0", "aqyxdxEAACgAw_vF"],
  ["aPH7PBIAACAAaw4I", "aqyxeREAACkAw_vM"],
  ["aPLxbxAAACQAqgee", "aqyxfBEAAC0Aw_vQ"],
  ["aPXNkxAAACIArj-g", "aqyxfhEAACgAw_vY"],
  ["aNjwNhAAACMAAh8y", "aqyxgREAACcAw_vc"],
  ["aNx-vhIAACMAhPuX", "aqyxgxEAACwAw_vh"],
  ["aQrqnREAACMATxeq", "aQryYREAACEATyN4"],
  ["aO76UBIAACIAZc9R", "aqyzRhEAAC0Aw_6W"],
  ["aQruKhEAACEATx02", "aqyzSBEAACsAw_6c"],
  ["aNx5ohIAACYAhPOF", "aqyzShEAACkAw_6h"],
  ["aaiw_BIAACcA1aof", "aqyzTREAAC4Aw_6n"],
  ["aM0MhhEAACEAiJqm", "aqyzTxEAACwAw_6s"],
  ["aM0GVxEAACIAiJDL", "aqyzUhEAACkAw_6y"],
  ["acNeuBEAAJEso3wk", "aqyzVBEAAC0Aw_62"],
  ["aai8JhIAACcA1brv", "aqyzVhEAACgAw_66"],
  ["aQaw2xEAACMASABe", "aqyzWBEAACwAw_7B"],
  ["aXWRyBEAACIAVxzr", "aqyzWxEAAC4Aw_7F"],
  ["aO8_RBIAAB8AZjRo", "aqyzXREAAC4Aw_7L"],
  ["aO8-vhIAACIAZjOM", "aqyzXxEAAC0Aw_7P"],
  ["aO87VhIAACAAZi5T", "aqyzYREAACkAw_7W"],
  ["aPH7qRIAACEAaw7b", "aqyzZBEAACsAw_7a"],
  ["aO7-CBIAACIAZdUR", "aqyzZhEAACkAw_7g"],
]);
function usage() {
  return `Prismic Chinese migration runner

Usage:
  node scripts/prismic-translation/run.mjs --validate --batch <${BATCHES.join("|")}|all>
  node scripts/prismic-translation/run.mjs --stage --batch <${BATCHES.join("|")}|all>

--validate performs read-only repository validation.
--stage creates or updates drafts in a Migration Release. It never publishes.`;
}

function parseArguments(argv) {
  if (argv.includes("--help") || argv.includes("-h")) return { help: true };
  const validate = argv.includes("--validate");
  const stage = argv.includes("--stage");
  if (validate === stage) throw new Error("Choose exactly one of --validate or --stage");
  const batchIndex = argv.indexOf("--batch");
  const batch = batchIndex >= 0 ? argv[batchIndex + 1] : undefined;
  if (![...BATCHES, "all"].includes(batch)) {
    throw new Error(`--batch must be one of ${[...BATCHES, "all"].join(", ")}`);
  }
  const recognized = new Set(["--validate", "--stage", "--batch", batch]);
  const unknown = argv.filter((argument) => !recognized.has(argument));
  if (unknown.length) throw new Error(`Unknown argument(s): ${unknown.join(", ")}`);
  return { validate, stage, batch };
}

function loadModels() {
  const customTypes = new Map();
  const customTypeRoot = path.join(REPOSITORY_DIRECTORY, "customtypes");
  for (const directory of fs.readdirSync(customTypeRoot, { withFileTypes: true })) {
    const modelPath = path.join(customTypeRoot, directory.name, "index.json");
    if (directory.isDirectory() && fs.existsSync(modelPath)) {
      const model = JSON.parse(fs.readFileSync(modelPath, "utf8"));
      customTypes.set(model.id, model);
    }
  }
  const slices = new Map();
  const slicesRoot = path.join(REPOSITORY_DIRECTORY, "slices");
  for (const directory of fs.readdirSync(slicesRoot, { withFileTypes: true })) {
    const modelPath = path.join(slicesRoot, directory.name, "model.json");
    if (directory.isDirectory() && fs.existsSync(modelPath)) {
      const model = JSON.parse(fs.readFileSync(modelPath, "utf8"));
      slices.set(model.id, model);
    }
  }
  return { customTypes, slices };
}

function alternateId(document, lang = TARGET_LANG) {
  return document.alternate_languages?.find((alternate) => alternate.lang === lang)?.id;
}

function isNotFoundError(error) {
  return (
    error?.status === 404 ||
    error?.name === "NotFoundError" ||
    /no documents? (?:were )?returned|not found/i.test(String(error?.message ?? error))
  );
}

function collectLinkSlots(value) {
  const slots = [];
  function visit(child, parent, key, jsonPath) {
    if (Array.isArray(child)) {
      child.forEach((item, index) => visit(item, child, index, `${jsonPath}[${index}]`));
      return;
    }
    if (!child || typeof child !== "object") return;
    if (child.link_type === "Document") {
      slots.push({ link: child, parent, key, path: jsonPath });
      return;
    }
    for (const [childKey, item] of Object.entries(child)) {
      visit(item, child, childKey, `${jsonPath}.${childKey}`);
    }
  }
  visit(value, null, null, "data");
  return slots;
}

function collectExternalImageSlots(value) {
  const slots = [];
  function visit(child, parent, key, jsonPath) {
    if (Array.isArray(child)) {
      child.forEach((item, index) => visit(item, child, index, `${jsonPath}[${index}]`));
      return;
    }
    if (!child || typeof child !== "object") return;
    if (
      typeof child.url === "string" &&
      child.url.startsWith("https://images.unsplash.com/") &&
      child.dimensions
    ) {
      slots.push({ image: child, parent, key, path: jsonPath });
      return;
    }
    for (const [childKey, item] of Object.entries(child)) {
      visit(item, child, childKey, `${jsonPath}.${childKey}`);
    }
  }
  visit(value, null, null, "data");
  return slots;
}

function toDocumentLink(document) {
  return {
    id: document.id,
    type: document.type,
    tags: document.tags ?? [],
    lang: document.lang,
    slug: document.slugs?.[0] ?? document.uid,
    first_publication_date: document.first_publication_date ?? null,
    last_publication_date: document.last_publication_date ?? null,
    uid: document.uid ?? null,
    url: document.url ?? null,
    link_type: "Document",
    isBroken: false,
  };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const manifestEntries = loadManifests(MANIFEST_DIRECTORY, options.batch);
  if (!manifestEntries.length) {
    console.log(`No entries in batch "${options.batch}". Nothing to ${options.stage ? "stage" : "validate"}.`);
    return;
  }

  const { customTypes, slices } = loadModels();
  const client = createClient(REPOSITORY_NAME);
  const limited = createRateLimiter(1000);
  const sourceById = new Map();
  const targetBySourceId = new Map();
  const includedSourceIds = new Set(manifestEntries.map((entry) => entry.sourceId));
  const report = {
    batch: options.batch,
    assetsImported: 0,
    documents: [],
    linksRewired: 0,
    mode: options.stage ? "stage" : "validate",
  };

  for (const manifestEntry of manifestEntries) {
    const { batch: _batch, ...entry } = manifestEntry;
    const source = await limited(() => client.getByID(entry.sourceId, { lang: SOURCE_LANG }));
    sourceById.set(source.id, source);
    const customType = customTypes.get(entry.type);
    if (!customType) throw new Error(`Missing custom type model for "${entry.type}"`);
    validateEntry(entry, source, customType, slices);

    let target = null;
    const targetId = alternateId(source);
    if (targetId) {
      target = await limited(() => client.getByID(targetId, { lang: TARGET_LANG }));
    } else {
      target = await limited(async () => {
        try {
          return entry.uid
            ? await client.getByUID(entry.type, entry.uid, { lang: TARGET_LANG })
            : await client.getSingle(entry.type, { lang: TARGET_LANG });
        } catch (error) {
          if (isNotFoundError(error)) return null;
          throw error;
        }
      });
    }
    if (!target && UNPUBLISHED_TARGET_IDS.has(source.id)) {
      target = {
        ...clone(source),
        id: UNPUBLISHED_TARGET_IDS.get(source.id),
        lang: TARGET_LANG,
        alternate_languages: [],
      };
    }
    if (target && (target.type !== entry.type || (target.uid ?? null) !== (entry.uid || null))) {
      throw new Error(`Chinese target identity mismatch for ${entry.sourceId}`);
    }
    targetBySourceId.set(entry.sourceId, target);
  }

  const linkedSourceCache = new Map();
  async function resolveExistingChineseTarget(link) {
    if (!link.id) return null;
    if (!linkedSourceCache.has(link.id)) {
      linkedSourceCache.set(
        link.id,
        limited(async () => {
          let linkedSource;
          try {
            linkedSource = await client.getByID(link.id);
          } catch (error) {
            if (isNotFoundError(error)) return null;
            throw error;
          }
          const id = alternateId(linkedSource);
          return id ? limited(() => client.getByID(id, { lang: TARGET_LANG })) : null;
        }),
      );
    }
    return linkedSourceCache.get(link.id);
  }

  const prepared = [];
  for (const manifestEntry of manifestEntries) {
    const { batch, ...entry } = manifestEntry;
    const source = sourceById.get(entry.sourceId);
    const existingTarget = targetBySourceId.get(entry.sourceId);
    const data = applyTranslations(source, entry.translations);
    const pendingIncludedLinks = [];

    for (const [jsonPath, fallbackSourceId] of EMPTY_LINK_FALLBACKS[entry.type] ?? []) {
      if (getAtPath({ data }, jsonPath)?.link_type !== "Any") continue;
      const fallbackSource =
        sourceById.get(fallbackSourceId) ??
        (await limited(() => client.getByID(fallbackSourceId, { lang: SOURCE_LANG })));
      setAtPath({ data }, jsonPath, toDocumentLink(fallbackSource));
    }

    for (const slot of collectLinkSlots(data)) {
      if (includedSourceIds.has(slot.link.id)) {
        pendingIncludedLinks.push(slot);
        continue;
      }
      const chineseTarget = await resolveExistingChineseTarget(slot.link);
      if (chineseTarget) {
        slot.parent[slot.key] = toDocumentLink(chineseTarget);
        report.linksRewired += 1;
      }
    }

    if (entry.type === "header" || entry.type === "footer") {
      const emptyLinks = findEmptyActionableLinks(data);
      if (emptyLinks.length) {
        throw new Error(`${entry.type} contains empty actionable links:\n  ${emptyLinks.join("\n  ")}`);
      }
    }

    const document = existingTarget
      ? { ...clone(existingTarget), uid: entry.uid || null, data }
      : {
          type: entry.type,
          uid: entry.uid || undefined,
          lang: TARGET_LANG,
          tags: clone(source.tags ?? []),
          data,
        };
    prepared.push({ batch, document, entry, existingTarget, pendingIncludedLinks, source });
    report.documents.push({
      action: existingTarget ? "update" : "create",
      sourceId: source.id,
      targetId: existingTarget?.id ?? null,
      type: entry.type,
      uid: entry.uid,
      translatedPaths: Object.keys(entry.translations).length,
    });
  }

  if (options.stage) {
    const token = process.env.PRISMIC_WRITE_TOKEN;
    if (!token) throw new Error("PRISMIC_WRITE_TOKEN is required for --stage");
    const writeClient = createWriteClient(REPOSITORY_NAME, { writeToken: token });
    const migration = createMigration();
    const migrationReferences = new Map();
    const migratedAssets = new Map();

    for (const item of prepared) {
      for (const slot of collectExternalImageSlots(item.document.data)) {
        const cacheKey = `${slot.image.url}\n${slot.image.alt ?? ""}`;
        let migratedAsset = migratedAssets.get(cacheKey);
        if (!migratedAsset) {
          const safeId = String(slot.image.id ?? "external-image").replace(/[^a-zA-Z0-9_-]/g, "-");
          migratedAsset = migration.createAsset(slot.image.url, `${safeId}.jpg`, {
            alt: slot.image.alt ?? undefined,
            credits: slot.image.copyright ?? undefined,
          });
          migratedAssets.set(cacheKey, migratedAsset);
          report.assetsImported += 1;
        }
        slot.parent[slot.key] = migratedAsset;
      }
    }

    for (const item of prepared) {
      if (!item.existingTarget) {
        const reference = migration.createDocument(item.document, item.entry.title, {
          masterLanguageDocument: item.source,
        });
        migrationReferences.set(item.entry.sourceId, reference);
      }
    }
    for (const item of prepared) {
      for (const slot of item.pendingIncludedLinks) {
        const existing = targetBySourceId.get(slot.link.id);
        const replacement = existing
          ? toDocumentLink(existing)
          : migrationReferences.get(slot.link.id);
        if (!replacement) throw new Error(`No Chinese target prepared for relationship ${slot.path}`);
        slot.parent[slot.key] = replacement;
        report.linksRewired += 1;
      }
      if (item.existingTarget) migration.updateDocument(item.document, item.entry.title);
    }

    await limited(() =>
      writeClient.migrate(migration, {
        reporter(event) {
          if (event.type === "documents:created" || event.type === "documents:updated") {
            console.log(`${event.type}: ${JSON.stringify(event.data)}`);
          }
        },
      }),
    );
  } else {
    // Ensure relationship traversal itself cannot alter Web or Media links.
    for (const item of prepared) walkDocumentLinks(item.document.data, () => {});
  }

  console.log(JSON.stringify(report, null, 2));
  console.log(options.stage ? "Draft migration staged; nothing was published." : "Validation passed; no writes were made.");
}

main().catch(async (error) => {
  const token = process.env.PRISMIC_WRITE_TOKEN;
  const message = String(error?.message ?? error);
  const sanitizedMessage = token ? message.replaceAll(token, "[REDACTED]") : message;
  console.error(`Migration failed: ${sanitizedMessage}`);
  if (error?.response) {
    let responseDetails;
    try {
      responseDetails =
        typeof error.response.clone === "function"
          ? await error.response.clone().text()
          : JSON.stringify(error.response, null, 2);
    } catch {
      responseDetails = String(error.response);
    }
    const sanitizedDetails = token
      ? responseDetails.replaceAll(token, "[REDACTED]")
      : responseDetails;
    console.error(`Prismic response: ${sanitizedDetails}`);
  }
  process.exitCode = 1;
});
