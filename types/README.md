# Custom Types

This directory contains custom TypeScript type definitions that complement the auto-generated types from Prismic.

## Why This Directory Exists

The `prismic-ts-codegen` tool generates types in `types.generated.ts`, but it doesn't export certain internal union types that we need in our components. Specifically, the slice union types like `PageDocumentDataSlicesSlice` are generated but not exported.

## Solution

Instead of manually modifying the generated file (which gets overwritten on each generation), we create our own type definitions in this directory that derive the needed types from the exported document types.

## Files

- `index.ts` - Main export file containing slice union types derived from Prismic document types

## Usage

Import the slice types you need:

```typescript
import type { PageDocumentDataSlicesSlice } from "@/types";

// Use in your components
const slice = page.data.slices?.find(
  (slice: PageDocumentDataSlicesSlice) => slice.slice_type === "legal_content"
);
```

## Available Types

- `PageDocumentDataSlicesSlice` - Union of all slices available in Page documents
- `HomeDocumentDataSlicesSlice` - Union of all slices available in Home documents  
- `NewsDocumentDataSlicesSlice` - Union of all slices available in News documents
- `SolutionDocumentDataSlicesSlice` - Union of all slices available in Solution documents

Plus convenient aliases:
- `PageSlices`, `HomeSlices`, `NewsSlices`, `SolutionSlices`

## Maintenance

These types are automatically kept in sync with the generated types since they derive from the exported document types. No manual updates needed when slices are added or removed.
