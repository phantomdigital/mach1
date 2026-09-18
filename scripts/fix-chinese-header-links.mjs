import fs from "node:fs";
import path from "node:path";
import {
  createClient,
  createMigration,
  createWriteClient,
} from "@prismicio/client";

const repositoryName = "mach1logistics";

function loadWriteToken() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env = fs.readFileSync(envPath, "utf8");
  const match = env.match(/^PRISMIC_WRITE_TOKEN=(.+)$/m);

  if (!match?.[1]?.trim()) {
    throw new Error("PRISMIC_WRITE_TOKEN is missing from .env.local");
  }

  return match[1].trim().replace(/^["']|["']$/g, "");
}

const targetByLabel = new Map([
  ["招聘", ["page", "careers-vacancies"]],
  ["新闻", ["page", "news"]],
  ["全国公路运输", ["solution", "national-road-transport"]],
  ["海运", ["solution", "ocean-freight"]],
  ["空运", ["solution", "air-freight"]],
  ["国际运输", ["page", "solutions"]],
  ["仓储服务", ["specialty", "warehousing--distribution"]],
  ["报关与AQIS", ["specialty", "customs-aqis"]],
  ["超大件货物运输", ["solution", "national-road-transport"]],
  ["仓储与配送", ["specialty", "warehousing--distribution"]],
  ["货运代理", ["specialty", "freight-forwarding"]],
  ["公司历史", ["page", "our-history"]],
  ["网络布局", ["page", "locations"]],
  ["团队介绍", ["page", "our-team"]],
  ["网点分布", ["page", "locations"]],
  ["货运跟踪", ["page", "tracking"]],
]);

const readClient = createClient(repositoryName);
const writeClient = createWriteClient(repositoryName, {
  writeToken: loadWriteToken(),
});

const chineseHeader = await writeClient.getSingle("header", { lang: "zh-cn" });
const changed = [];

async function resolveTarget(type, uid) {
  const chineseTarget = await readClient
    .getByUID(type, uid, { lang: "zh-cn" })
    .catch(() => null);

  return (
    chineseTarget ??
    (await readClient.getByUID(type, uid, { lang: "en-us" }))
  );
}

function toDocumentLink(document) {
  return {
    id: document.id,
    type: document.type,
    tags: document.tags,
    lang: document.lang,
    slug: document.slugs?.[0] ?? document.uid,
    first_publication_date: document.first_publication_date,
    last_publication_date: document.last_publication_date,
    uid: document.uid,
    url: document.url,
    link_type: "Document",
    isBroken: false,
  };
}

async function fillEmptyLink(item, location) {
  if (item.link?.link_type !== "Any") {
    return;
  }

  const target = targetByLabel.get(item.label);
  if (!target) {
    return;
  }

  const document = await resolveTarget(...target);
  item.link = toDocumentLink(document);
  changed.push({
    label: item.label,
    location,
    destination: document.url,
    destinationLocale: document.lang,
  });
}

for (const item of chineseHeader.data.subheader_items ?? []) {
  await fillEmptyLink(item, "subheader");
}

for (const navigationItem of chineseHeader.data.navigation ?? []) {
  if (!navigationItem.has_dropdown) {
    await fillEmptyLink(navigationItem, "navigation");
  }

  for (const dropdownItem of navigationItem.dropdown_items ?? []) {
    await fillEmptyLink(
      dropdownItem,
      `${navigationItem.label} dropdown`,
    );
  }
}

for (const button of chineseHeader.data.buttons ?? []) {
  await fillEmptyLink(button, "header button");
}

if (changed.length === 0) {
  console.log("No empty Chinese header links matched the migration map.");
  process.exit(0);
}

const migration = createMigration();
migration.updateDocument(chineseHeader);

await writeClient.migrate(migration, {
  reporter(event) {
    if (event.type === "documents:updated") {
      console.log(`Staged ${event.data.updated} document update.`);
    }
  },
});

console.log(JSON.stringify(changed, null, 2));
