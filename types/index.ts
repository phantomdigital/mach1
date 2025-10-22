// Custom type exports that aren't available from prismic-ts-codegen
// This file won't be overwritten by code generation

import type * as Generated from '../types.generated';

// Create our own slice union types by extracting them from the document types
export type PageDocumentDataSlicesSlice = Generated.PageDocument['data']['slices'][number];
export type HomeDocumentDataSlicesSlice = Generated.HomeDocument['data']['slices'][number];
export type NewsDocumentDataSlicesSlice = Generated.NewsDocument['data']['slices'][number];
export type SolutionDocumentDataSlicesSlice = Generated.SolutionDocument['data']['slices'][number];

// Convenient aliases
export type PageSlices = PageDocumentDataSlicesSlice;
export type HomeSlices = HomeDocumentDataSlicesSlice;
export type NewsSlices = NewsDocumentDataSlicesSlice;
export type SolutionSlices = SolutionDocumentDataSlicesSlice;
