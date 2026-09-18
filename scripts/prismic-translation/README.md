# Prismic Chinese migration

This directory contains reusable, manifest-driven tooling for migrating `en-us` Prismic content to `zh-cn`. Validation is read-only. Staging creates or updates drafts in a Prismic Migration Release; this runner has no publishing command or publishing API call.

## Manifests

Each file in `manifests/` is one migration batch and must contain a JSON array:

```json
[
  {
    "sourceId": "English Prismic document ID",
    "type": "page",
    "uid": "about-us",
    "title": "关于我们",
    "translations": {
      "data.meta_title": "关于我们",
      "data.slices[0].primary.heading": "我们的公司",
      "data.slices[0].primary.body[0].text": "翻译后的段落"
    }
  }
]
```

Use `null` for `uid` on singleton types. Entries may contain only the five properties shown above.

The manifest must provide exactly every non-empty, model-backed Text and Rich Text string currently present in the English source. Paths for missing fields fail validation, as do extra paths, stale source IDs, changed types/UIDs, and empty translations. URLs, dates, phone/numeric strings, Select values, media, rich-text spans, slice structure, and other configuration are copied without translation.

## Exact commands

Run the local, no-network tests:

```powershell
npm run prismic:translation:test
```

Validate one batch against current Prismic content (read-only):

```powershell
npm run prismic:translation -- --validate --batch foundation-core
npm run prismic:translation -- --validate --batch foundation-pages
npm run prismic:translation -- --validate --batch services
npm run prismic:translation -- --validate --batch editorial
```

Validate every batch:

```powershell
npm run prismic:translation -- --validate --batch all
```

Stage drafts only after validation succeeds. Set the token in the current PowerShell process; the runner does not read or modify `.env.local` and never prints the token:

```powershell
$env:PRISMIC_WRITE_TOKEN = Read-Host -MaskInput "Prismic write token"
npm run prismic:translation -- --stage --batch foundation-core
Remove-Item Env:PRISMIC_WRITE_TOKEN
```

To stage all approved batches:

```powershell
$env:PRISMIC_WRITE_TOKEN = Read-Host -MaskInput "Prismic write token"
npm run prismic:translation -- --stage --batch all
Remove-Item Env:PRISMIC_WRITE_TOKEN
```

`PRISMIC_REPOSITORY_NAME` is optional and defaults to `mach1logistics`.

## Safety and behavior

- All Prismic SDK requests are started no faster than one request per second.
- Existing Chinese alternates are updated; missing alternates are created with the same UID and their English source as `masterLanguageDocument`.
- Document links are changed to an included or existing Chinese alternate. Web and Media links are preserved.
- Header/footer rows with labels or button text fail validation when their actionable link is empty.
- `--stage` is the only write mode and only stages a Migration Release. Publishing is intentionally impossible from this runner.
- Reports list each planned create/update, translated path count, and rewired relationship count.
