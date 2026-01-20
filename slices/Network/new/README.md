# Supabase-Style Network Layout

## Overview

This folder contains the **NEW Supabase-style layout** for the Network slice, inspired by [https://supabase.com/careers](https://supabase.com/careers).

## Layout Structure

The new layout matches the Supabase careers page:

1. **Centered Stats Row** at the top (like "180+ team members", "15+ languages", etc.)
2. **Full-width section** below with:
   - **Globe on the left** (interactive 3D globe that rotates)
   - **Content blocks on the right** (region tabs + descriptions)

## Files

### New Components (Supabase-style)

- **`network-supabase-layout.tsx`** - Main layout component
- **`network-stats.tsx`** - Top stats row component
- **`network-content-blocks.tsx`** - Right-side content with region tabs
- **`network-supabase-animation.tsx`** - GSAP animations

### Original Components (Backed Up)

- **`network-default-client.original.tsx`** - Original layout
- **`network-tabs.original.tsx`** - Original tabs component  
- **`globe-3d.original.tsx`** - Original globe (still used, unchanged)

## Key Features

✅ **Preserved globe rotation** - Region tabs still control globe camera position  
✅ **Responsive design** - Mobile-first, scales beautifully  
✅ **Smooth animations** - GSAP-powered scroll animations  
✅ **Type-safe** - Full TypeScript support with Prismic types  

## How It Works

1. `network-default-client.tsx` now imports and delegates to `NetworkSupabaseLayout`
2. `NetworkSupabaseLayout` renders:
   - Header + description (centered)
   - `NetworkStats` component (centered stats row)
   - Globe section with `Globe3D` (left) and `NetworkContentBlocks` (right)
3. Region tabs update `activeRegion` state → triggers globe rotation (via `activeLocations`)

## Prismic Configuration

The Network slice schema includes:

### Primary Fields
- `statistics` (Group) - Repeatable stat items:
  - `number` (Text) - e.g., "180"
  - `suffix` (Text) - e.g., "+"
  - `label` (Text) - e.g., "team members"
  - `sub_label` (Text) - optional, e.g., "in 35+ countries"

### Items (Regions & Locations)
- `region_id`, `region_name`, `region_description`
- `location_name`, `location_coordinates`, `location_value`, `location_description`

## Reverting to Original

To revert to the original layout:

1. Restore `network-default-client.tsx` from `network-default-client.original.tsx`
2. The original `network-tabs.tsx` and `globe-3d.tsx` are unchanged

## Demo

Visit **Slice Machine** (`http://localhost:9999`) or the **Slice Simulator** to preview the new layout with mock data.


