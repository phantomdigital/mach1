import assert from "node:assert/strict";
import test from "node:test";
import {
  applyTranslations,
  discoverTranslatablePaths,
  findEmptyActionableLinks,
  getAtPath,
  parseJsonPath,
  validateEntry,
  walkDocumentLinks,
} from "./core.mjs";

const model = {
  json: {
    Main: {
      heading: { type: "Text" },
      phone: { type: "Text" },
      image: { type: "Image" },
      body: { type: "StructuredText" },
      rows: {
        type: "Group",
        config: { fields: { label: { type: "Text" }, mode: { type: "Select" } } },
      },
      slices: { type: "Slices" },
    },
  },
};

const slices = new Map([
  [
    "hero",
    {
      variations: [
        {
          id: "default",
          primary: { title: { type: "Text" }, layout: { type: "Select" } },
          items: { caption: { type: "Text" }, image: { type: "Image" } },
        },
      ],
    },
  ],
]);

const source = {
  id: "source-1",
  type: "page",
  uid: "about",
  lang: "en-us",
  data: {
    heading: "About us",
    phone: "+61 3 1234 5678",
    image: {
      alt: "Freight truck",
      url: "https://images.example/truck.jpg",
      dimensions: { width: 1200, height: 800 },
    },
    body: [{ type: "paragraph", text: "Welcome", spans: [{ start: 0, end: 7, type: "strong" }] }],
    rows: [{ label: "Fast freight", mode: "compact" }],
    slices: [
      {
        slice_type: "hero",
        variation: "default",
        primary: { title: "Logistics", layout: "wide" },
        items: [{ caption: "A truck", image: { url: "https://images.example/truck.jpg" } }],
      },
    ],
  },
};

const translations = {
  "data.body[0].text": "欢迎",
  "data.heading": "关于我们",
  "data.image.alt": "货运卡车",
  "data.rows[0].label": "快速货运",
  "data.slices[0].items[0].caption": "一辆卡车",
  "data.slices[0].primary.title": "物流",
};

test("parses and reads data-rooted JSON paths", () => {
  assert.deepEqual(parseJsonPath("data.slices[0].primary.title"), ["data", "slices", 0, "primary", "title"]);
  assert.equal(getAtPath(source, "data.body[0].text"), "Welcome");
  assert.equal(getAtPath(source, "data.body.0.text"), "Welcome");
  assert.throws(() => parseJsonPath("slices[0].title"), /must start/);
});

test("discovers model-backed text while excluding technical strings", () => {
  assert.deepEqual(discoverTranslatablePaths(source, model, slices), Object.keys(translations).sort());
});

test("validates exact manifest paths and current source identity", () => {
  const entry = {
    sourceId: "source-1",
    type: "page",
    uid: "about",
    title: "About us",
    translations,
  };
  assert.doesNotThrow(() => validateEntry(entry, source, model, slices));
  assert.throws(
    () => validateEntry({ ...entry, translations: { ...translations, "data.unknown": "错误" } }, source, model, slices),
    /Extra/,
  );
  const { ["data.heading"]: _removed, ...incomplete } = translations;
  assert.throws(() => validateEntry({ ...entry, translations: incomplete }, source, model, slices), /Missing/);
});

test("applies only translated strings and preserves rich-text spans and structure", () => {
  const result = applyTranslations(source, translations);
  assert.equal(result.heading, "关于我们");
  assert.equal(result.phone, source.data.phone);
  assert.equal(result.image.alt, "货运卡车");
  assert.equal(result.image.url, source.data.image.url);
  assert.deepEqual(result.body[0].spans, source.data.body[0].spans);
  assert.deepEqual(result.slices[0].items[0].image, source.data.slices[0].items[0].image);
  assert.equal(source.data.heading, "About us");
});

test("walks Document links but leaves Web and Media links alone", () => {
  const value = {
    relation: { link_type: "Document", id: "doc-1" },
    website: { link_type: "Web", url: "https://example.com" },
    asset: { link_type: "Media", id: "asset-1" },
  };
  const visited = [];
  walkDocumentLinks(value, (link, jsonPath) => visited.push([link.id, jsonPath]));
  assert.deepEqual(visited, [["doc-1", "data.relation"]]);
  assert.equal(value.website.url, "https://example.com");
  assert.equal(value.asset.id, "asset-1");
});

test("finds empty links attached to actionable labels", () => {
  assert.deepEqual(
    findEmptyActionableLinks({
      buttons: [{ label: "Track freight", link: { link_type: "Any" } }],
      optional: { link: { link_type: "Any" } },
    }),
    ["data.buttons[0].link"],
  );
});
