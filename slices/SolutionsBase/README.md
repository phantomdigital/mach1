# Solutions Base Slice

A flexible base content slice for solution pages with hero imagery, breadcrumb navigation, main heading, rich text content, and a sticky contact/quote card.

## Features

- **80rem max-width container** - Matches project standard
- **Hero image with clipped edge** - Uses the polygon clip-path pattern (top-right angled edge)
- **Padding to header** - Configurable padding (12-20 in Tailwind scale)
- **Simple breadcrumbs** - Clean text-based breadcrumbs without badge/pill styling
- **H1 Main Heading** - Large, prominent heading above content
- **Split Layout** - Rich text content on left (2/3), contact card on right (1/3)
- **Sticky Contact Card** - Card stays in view while scrolling, with configurable background
- **Rich text content** - Fully formatted with proper text hierarchy
- **Flexible spacing** - Configurable top/bottom padding and margins

## Design Patterns

### Layout Structure
- **Desktop**: Two-column layout (2fr + 1fr) with sticky card on right
- **Mobile**: Stacked layout with card below content
- **Card touches image**: No margin between hero image and content start

### Text Hierarchy
The rich text content follows typography patterns from JoinOurTeam and FreightServices:

- **H1**: Main page heading (4xl/5xl/6xl) - bold, prominent
- **H2**: Large section headers (3xl/4xl)
- **H3**: Medium section headers (xl/2xl)  
- **H4-H6**: Smaller subsection headers
- **Body text**: sm/base size, neutral-700 color, relaxed leading
- **Lists**: Proper spacing and indentation
- **Links**: Mach1 green with hover states

### Contact/Quote Card
- **Background**: Configurable color (defaults to #F5F5F5 light grey)
- **Sticky behavior**: Stays in viewport on desktop (lg:sticky lg:top-8)
- **Card styling**: Matches project pattern with rounded corners and border
- **Contact info**: Repeatable label/value pairs
- **CTA buttons**: Primary (green) and secondary (white) buttons

### Image Clipped Edge
The hero image uses the same clipped corner pattern:
```css
clipPath: 'polygon(0 0, calc(100% - 2.5rem) 0, 100% 2rem, 100% 100%, 0 100%)'
```

## Usage in Prismic

### Primary Fields
- **hero_image**: Header image with clipped edge (recommended: 1920x800)
- **breadcrumb_home_text**: Home breadcrumb text (e.g., "Home")
- **breadcrumb_current_text**: Current page name (e.g., "Solutions")
- **heading**: Main H1 heading
- **content**: Rich text editor for main content
- **card_heading**: Heading for the contact card (e.g., "Get a Quote")
- **card_description**: Description text in the card
- **primary_button_text**: Main CTA button text
- **primary_button_link**: Main CTA button link
- **secondary_button_text**: Secondary button text
- **secondary_button_link**: Secondary button link
- **margin_top**: Top margin spacing
- **padding_top**: Top padding spacing
- **padding_bottom**: Bottom padding spacing
- **background_color**: Section background color
- **card_background_color**: Card background color (default: #F5F5F5)

### Repeatable Items (Contact Info)
- **contact_label**: Label for contact item (e.g., "Phone", "Email")
- **contact_value**: Value for contact item (e.g., "1300 123 456")

## Example Content Structure

```
Hero Image (with clipped edge) - touches card
  ↓ (no gap)
Breadcrumbs: Home > Solutions
  ↓
H1: Main Heading
  ↓
┌─────────────────────┬──────────────┐
│ Rich Text Content   │ [Card]       │
│                     │              │
│ ## Heading 2        │ Get a Quote  │
│ Paragraph text...   │              │
│                     │ Description  │
│ ### Heading 3       │              │
│ - List item 1       │ Phone:       │
│ - List item 2       │ 1300 123 456 │
│                     │              │
│ More content...     │ Email:       │
│                     │ info@...     │
│                     │              │
│                     │ [Button 1]   │
│                     │ [Button 2]   │
└─────────────────────┴──────────────┘
```

## Styling Notes

- Container: `max-w-[80rem]` (1280px)
- Responsive padding: `px-4 lg:px-8`
- Hero aspect ratio: `16/9` on mobile, `21/9` on desktop
- Grid layout: `lg:grid-cols-[2fr_1fr]` (66% content, 33% card)
- Card default background: `#F5F5F5` (light grey)
- Card is sticky on desktop: `lg:sticky lg:top-8`
