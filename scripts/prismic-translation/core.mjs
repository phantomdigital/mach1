import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

export const BATCHES = ["foundation-core", "foundation-pages", "services", "editorial"];
export const TARGET_LANG = "zh-cn";
export const SOURCE_LANG = "en-us";

const STRUCTURED_TEXT_TYPES = new Set(["StructuredText", "RichText"]);
const TEXT_TYPES = new Set(["Text"]);
const TECHNICAL_TEXT_FIELDS = new Set([
  "card_value",
  "field_name",
  "tracking_url_prefix",
  "url_prefix",
]);

export function clone(value) {
  return structuredClone(value);
}

export function parseJsonPath(jsonPath) {
  if (typeof jsonPath !== "string" || !jsonPath.startsWith("data.")) {
    throw new Error(`Translation path must start with "data.": ${jsonPath}`);
  }
  const tokens = ["data"];
  const expression = jsonPath.slice(5);
  const matcher = /(?:^|\.)([^.[\]]+)|\[(\d+)\]/g;
  let match;
  let consumed = 0;
  while ((match = matcher.exec(expression))) {
    if (match.index !== consumed) {
      throw new Error(`Invalid JSON path: ${jsonPath}`);
    }
    const token = match[1] ?? match[2];
    tokens.push(/^\d+$/.test(token) ? Number(token) : token);
    consumed = matcher.lastIndex;
  }
  if (consumed !== expression.length || tokens.length === 1) {
    throw new Error(`Invalid JSON path: ${jsonPath}`);
  }
  return tokens;
}

export function getAtPath(data, jsonPath) {
  return parseJsonPath(jsonPath).reduce((value, token) => value?.[token], data);
}

export function setAtPath(data, jsonPath, value) {
  const tokens = parseJsonPath(jsonPath);
  let cursor = data;
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    if (cursor == null || !(token in cursor)) {
      throw new Error(`Path does not exist in source: ${jsonPath}`);
    }
    cursor = cursor[token];
  }
  const finalToken = tokens.at(-1);
  if (cursor == null || !(finalToken in cursor)) {
    throw new Error(`Path does not exist in source: ${jsonPath}`);
  }
  cursor[finalToken] = value;
}

function isTechnicalString(value) {
  const text = value.trim();
  return (
    text === "" ||
    /^(?:https?:\/\/|mailto:|tel:)/i.test(text) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ||
    /^\+?[\d\s()./-]+$/.test(text) ||
    /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text)
  );
}

function collectStructuredText(value, basePath, output) {
  if (!Array.isArray(value)) return;
  value.forEach((block, index) => {
    if (typeof block?.text === "string" && !isTechnicalString(block.text)) {
      output.add(`${basePath}[${index}].text`);
    }
    if (typeof block?.alt === "string" && !isTechnicalString(block.alt)) {
      output.add(`${basePath}[${index}].alt`);
    }
  });
}

function collectImageAltPaths(value, basePath, output) {
  if (!value || typeof value !== "object") return;
  if (typeof value.alt === "string" && !isTechnicalString(value.alt)) {
    output.add(`${basePath}.alt`);
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== "alt" && child && typeof child === "object") {
      collectImageAltPaths(child, `${basePath}.${key}`, output);
    }
  }
}

function collectFieldPaths(value, definition, basePath, output, sliceModels) {
  if (!definition) return;
  if (TEXT_TYPES.has(definition.type)) {
    const fieldName = basePath.match(/\.([^.[\]]+)$/)?.[1];
    if (fieldName && TECHNICAL_TEXT_FIELDS.has(fieldName)) return;
    if (typeof value === "string" && !isTechnicalString(value)) output.add(basePath);
    return;
  }
  if (STRUCTURED_TEXT_TYPES.has(definition.type)) {
    collectStructuredText(value, basePath, output);
    return;
  }
  if (definition.type === "Image") {
    collectImageAltPaths(value, basePath, output);
    return;
  }
  if (definition.type === "Group") {
    const rows = Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
    rows.forEach((row, rowIndex) => {
      const rowPath = Array.isArray(value) ? `${basePath}[${rowIndex}]` : basePath;
      for (const [fieldName, childDefinition] of Object.entries(definition.config?.fields ?? {})) {
        collectFieldPaths(row?.[fieldName], childDefinition, `${rowPath}.${fieldName}`, output, sliceModels);
      }
    });
    return;
  }
  if (definition.type === "Slices" && Array.isArray(value)) {
    value.forEach((slice, sliceIndex) => {
      const model = sliceModels.get(slice.slice_type);
      const variation =
        model?.variations?.find((candidate) => candidate.id === slice.variation) ??
        model?.variations?.[0];
      if (!variation) throw new Error(`No slice model found for "${slice.slice_type}"`);
      const slicePath = `${basePath}[${sliceIndex}]`;
      for (const [fieldName, childDefinition] of Object.entries(variation.primary ?? {})) {
        collectFieldPaths(
          slice.primary?.[fieldName],
          childDefinition,
          `${slicePath}.primary.${fieldName}`,
          output,
          sliceModels,
        );
      }
      if (Array.isArray(slice.items)) {
        slice.items.forEach((item, itemIndex) => {
          for (const [fieldName, childDefinition] of Object.entries(variation.items ?? {})) {
            collectFieldPaths(
              item?.[fieldName],
              childDefinition,
              `${slicePath}.items[${itemIndex}].${fieldName}`,
              output,
              sliceModels,
            );
          }
        });
      }
    });
  }
}

export function discoverTranslatablePaths(document, customTypeModel, sliceModels = new Map()) {
  const output = new Set();
  const fields = Object.assign({}, ...Object.values(customTypeModel.json ?? {}));
  for (const [fieldName, definition] of Object.entries(fields)) {
    collectFieldPaths(
      document.data?.[fieldName],
      definition,
      `data.${fieldName}`,
      output,
      sliceModels,
    );
  }
  return [...output].sort();
}

export function validateEntry(entry, source, customTypeModel, sliceModels) {
  const requiredKeys = ["sourceId", "type", "uid", "title", "translations"];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("Manifest entries must be objects");
  }
  const keys = Object.keys(entry).sort();
  if (!isDeepStrictEqual(keys, [...requiredKeys].sort())) {
    throw new Error(`Entry ${entry.sourceId ?? "(unknown)"} must contain exactly: ${requiredKeys.join(", ")}`);
  }
  for (const key of ["sourceId", "type", "title"]) {
    if (typeof entry[key] !== "string" || !entry[key].trim()) {
      throw new Error(`Entry ${entry.sourceId ?? "(unknown)"} has invalid ${key}`);
    }
  }
  if (entry.uid !== null && typeof entry.uid !== "string") {
    throw new Error(`Entry ${entry.sourceId ?? "(unknown)"} has invalid uid`);
  }
  if (!entry.translations || typeof entry.translations !== "object" || Array.isArray(entry.translations)) {
    throw new Error(`Entry ${entry.sourceId} translations must be an object`);
  }
  if (source.id !== entry.sourceId || source.lang !== SOURCE_LANG) {
    throw new Error(`Source ${entry.sourceId} did not resolve to the expected ${SOURCE_LANG} document`);
  }
  if (source.type !== entry.type || (source.uid ?? null) !== (entry.uid || null)) {
    throw new Error(`Source identity changed for ${entry.sourceId}: expected ${entry.type}/${entry.uid}`);
  }
  const canonicalize = (jsonPath) =>
    parseJsonPath(jsonPath)
      .map((token, index) => (typeof token === "number" ? `[${token}]` : `${index ? "." : ""}${token}`))
      .join("")
      .replace(/\.\[/g, "[");
  const expected = discoverTranslatablePaths(source, customTypeModel, sliceModels);
  const suppliedByCanonicalPath = new Map();
  for (const suppliedPath of Object.keys(entry.translations)) {
    const canonicalPath = canonicalize(suppliedPath);
    if (suppliedByCanonicalPath.has(canonicalPath)) {
      throw new Error(`Duplicate translation path notation for ${canonicalPath}`);
    }
    suppliedByCanonicalPath.set(canonicalPath, suppliedPath);
  }
  const missing = expected.filter((item) => !suppliedByCanonicalPath.has(canonicalize(item)));
  const expectedCanonicalPaths = new Set(expected.map(canonicalize));
  const extra = [...suppliedByCanonicalPath].filter(([item]) => !expectedCanonicalPaths.has(item)).map(([, item]) => item);
  if (missing.length || extra.length) {
    throw new Error(
      `Translation paths do not match source ${entry.sourceId}` +
        `${missing.length ? `\n  Missing: ${missing.join(", ")}` : ""}` +
        `${extra.length ? `\n  Extra: ${extra.join(", ")}` : ""}`,
    );
  }
  for (const [jsonPath, translation] of Object.entries(entry.translations)) {
    const current = getAtPath(source, jsonPath);
    if (typeof current !== "string" || !current.trim()) {
      throw new Error(`Current source value is not a non-empty string: ${jsonPath}`);
    }
    if (typeof translation !== "string" || !translation.trim()) {
      throw new Error(`Translation must be a non-empty string: ${jsonPath}`);
    }
  }
}

export function applyTranslations(source, translations) {
  const data = clone(source.data);
  for (const [jsonPath, translation] of Object.entries(translations)) {
    setAtPath({ data }, jsonPath, translation);
  }
  const sourceMask = clone(source.data);
  const targetMask = clone(data);
  for (const jsonPath of Object.keys(translations)) {
    setAtPath({ data: sourceMask }, jsonPath, "__TRANSLATED_TEXT__");
    setAtPath({ data: targetMask }, jsonPath, "__TRANSLATED_TEXT__");
  }
  if (!isDeepStrictEqual(sourceMask, targetMask)) {
    throw new Error(`Applying translations changed non-text structure for ${source.id}`);
  }
  return data;
}

export function walkDocumentLinks(value, visitor, pathName = "data") {
  if (Array.isArray(value)) {
    value.forEach((child, index) => walkDocumentLinks(child, visitor, `${pathName}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (value.link_type === "Document") {
    visitor(value, pathName);
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    walkDocumentLinks(child, visitor, `${pathName}.${key}`);
  }
}

function isEmptyLink(value) {
  return value == null || value.link_type === "Any" || (value.link_type === "Document" && !value.id);
}

export function findEmptyActionableLinks(data) {
  const failures = [];
  function visit(value, currentPath) {
    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, `${currentPath}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    const hasActionLabel = Object.entries(value).some(
      ([key, child]) =>
        typeof child === "string" &&
        child.trim() &&
        /(?:label|text|title|platform|name)$/i.test(key),
    );
    if (hasActionLabel) {
      for (const [key, child] of Object.entries(value)) {
        const isDropdownTrigger = key === "link" && value.has_dropdown === true;
        const isUnusedAnnouncementLink =
          key === "announcement_link" && !value.announcement_link_text;
        if (
          /(?:link|url)$/i.test(key) &&
          isEmptyLink(child) &&
          !isDropdownTrigger &&
          !isUnusedAnnouncementLink
        ) {
          failures.push(`${currentPath}.${key}`);
        }
      }
    }
    for (const [key, child] of Object.entries(value)) visit(child, `${currentPath}.${key}`);
  }
  visit(data, "data");
  return failures;
}

export function loadManifests(directory, batch) {
  const batches = batch === "all" ? BATCHES : [batch];
  const entries = [];
  for (const batchName of batches) {
    const file = path.join(directory, `${batchName}.json`);
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array`);
    parsed.forEach((entry) => entries.push({ ...entry, batch: batchName }));
  }
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.sourceId)) throw new Error(`Duplicate sourceId across manifests: ${entry.sourceId}`);
    ids.add(entry.sourceId);
  }
  return entries;
}

export function createRateLimiter(intervalMs = 1000) {
  let nextStart = 0;
  return async function limited(operation) {
    const delay = Math.max(0, nextStart - Date.now());
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    nextStart = Date.now() + intervalMs;
    return operation();
  };
}
