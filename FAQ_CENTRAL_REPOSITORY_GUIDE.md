# FAQ Slice Guide - Simple 2-Variant System

## ✅ What You Get

The FAQ slice now has **2 clean variants with different designs**:

### **Variant 1: Default** (Main FAQ Page)
- ✅ Full-featured design
- ✅ Search bar for finding FAQs
- ✅ Category filtering
- ✅ Grouped by category with badges
- ✅ Add FAQs directly to this page

### **Variant 2: Referenced** (Service Pages)  
- ✅ Simple, clean design
- ✅ Centered heading + subheading
- ✅ Full-width FAQ list (max-w-[88rem] - matches site standard)
- ✅ No search, no filters
- ✅ Just a clean list of relevant FAQs
- ✅ Pull FAQs from your main FAQ page with filtering

---

## 🎨 Design Comparison

### **Default Variant** (Main FAQ Page)
```
┌─────────────────────────────────────┐
│  [Search Bar]  [Category Filter ▼]  │  ← Search & Filter
├─────────────────────────────────────┤
│  🏷️ Road Freight                     │  ← Category Badge
│                                     │
│  ▼ Question 1 about road freight?   │  ← Accordion
│  ▼ Question 2 about road freight?   │
│  ▼ Question 3 about road freight?   │
│                                     │
│  🏷️ Air Freight                      │  ← Next Category
│                                     │
│  ▼ Question 1 about air freight?    │
│  ▼ Question 2 about air freight?    │
└─────────────────────────────────────┘
```

### **Referenced Variant** (Service Pages)
```
┌─────────────────────────────────────┐
│    FREQUENTLY ASKED QUESTIONS        │  ← Centered Subheading
│ Common questions about road freight  │  ← Centered Heading
│                                     │
▼ Question 1 about road freight?      │  ← Full-width FAQ list
▼ Question 2 about road freight?      │     (88rem container)
▼ Question 3 about road freight?      │
▼ Question 4 about road freight?      │
▼ Question 5 about road freight?      │
│                                     │
└─────────────────────────────────────┘
```

**Key Differences:**
- ❌ Referenced variant has NO search
- ❌ Referenced variant has NO category badges
- ❌ Referenced variant has NO grouping
- ✅ Referenced variant has custom heading/subheading
- ✅ Heading is **centered** for clean service page look
- ✅ FAQ list uses **full container width** (max-w-[88rem] - matches site standard)
- ✅ Referenced variant is cleaner and simpler

---

## 🎯 How It Works

```
Main FAQ Page (e.g., /faqs)
   ├── FAQ Slice with ALL your FAQs
   │   ├── Road Freight FAQ 1
   │   ├── Road Freight FAQ 2
   │   ├── Air Freight FAQ 1
   │   └── ... 50+ FAQs
   
↓ Reference this page ↓

Road Freight Page
   ├── FAQ Slice (Referenced variant)
   ├── FAQ Page: /faqs
   ├── Filter by: Road Freight
   └── Limit: 10

↓ Automatically shows ↓

Only 10 Road Freight FAQs from main page
```

---

## 📋 Setup Instructions

### Step 1: Create Your Main FAQ Page

1. Create a page: **FAQs** (UID: `faqs`)
2. Add **FAQ** slice (Default variant)
3. Add ALL your company FAQs to this slice:
   - Road Freight FAQs (category: "Road Freight")
   - Air Freight FAQs (category: "Air Freight")
   - Sea Freight FAQs (category: "Sea Freight")
   - etc.
4. **Publish** the page

### Step 2: Use Referenced Variant on Other Pages

#### For Road Freight Page:

1. Add **FAQ** slice
2. Choose **"Referenced"** variant
3. Configure:
   - **FAQ Page to Pull From**: Select your `/faqs` page
   - **Filter by Category**: Road Freight
   - **FAQ Limit**: 10
4. **Publish**

Done! It will automatically pull Road Freight FAQs from your main page.

---

## 🎛️ Variant Comparison

### **Default Variant**

```json
{
  "variation": "default",
  "primary": {
    "faq_limit": 10
  },
  "items": [
    {
      "category": "General",
      "question": "Custom question for this page only",
      "answer": "..."
    }
  ]
}
```

**Use when:**
- ✅ This page needs unique FAQs
- ✅ You want one-off questions
- ✅ Testing/temporary FAQs

---

### **Referenced Variant**

```json
{
  "variation": "referenced",
  "primary": {
    "subheading": "FREQUENTLY ASKED QUESTIONS",
    "heading": "Common questions about road freight",
    "faq_page": {
      "link_type": "Document",
      "id": "...",
      "uid": "faqs"
    },
    "filter_by_category": "Road Freight",
    "faq_limit": 10
  },
  "items": []
}
```

**Use when:**
- ✅ You want to reuse FAQs from main page
- ✅ You want filtered views (e.g., only Road Freight)
- ✅ You want easy updates (change once, updates everywhere)

---

## 💡 Real-World Examples

### Example 1: Main FAQ Page
Shows ALL FAQs from all categories

```
Variant: Default
Limit: 100
Items: All 50+ FAQs added directly
```

### Example 2: Road Freight Page
Shows ONLY Road Freight FAQs from main page

```
Variant: Referenced
FAQ Page: /faqs
Filter: Road Freight
Limit: 10
```

### Example 3: Air Freight Page
Shows ONLY Air Freight FAQs from main page

```
Variant: Referenced
FAQ Page: /faqs
Filter: Air Freight
Limit: 8
```

### Example 4: Contact Page
Shows custom contact-specific FAQs

```
Variant: Default
Limit: 5
Items: Add 5 contact-related FAQs manually
```

---

## 🔄 Update Workflow

### With Referenced Variant:

1. **Edit FAQs** on main `/faqs` page
2. **Publish**
3. ✅ **All pages automatically update!**

Road Freight page, Air Freight page, etc. all show the latest FAQs instantly.

### With Default Variant:

1. Edit FAQs on each individual page
2. Publish each page separately
3. ⚠️ Must update multiple pages if FAQ changes

---

## 🎯 Your National Road Freight Page

### Recommended Setup:

```
Main FAQ Page (/faqs):
├── Variant: Default
├── All categories included
└── 50+ FAQs

Road Freight Page (/solutions/national-road-freight):
├── Variant: Referenced
├── FAQ Page: /faqs
├── Filter: Road Freight
└── Limit: 10
```

**Mock Data for Road Freight Page:**

```json
{
  "variation": "referenced",
  "primary": {
    "faq_page": {
      "link_type": "Document",
      "id": "your-faq-page-id",
      "uid": "faqs"
    },
    "filter_by_category": "Road Freight",
    "faq_limit": 10
  },
  "items": []
}
```

---

## ✅ Benefits

| Feature | Default Variant | Referenced Variant |
|---------|----------------|-------------------|
| Single source of truth | ❌ | ✅ |
| Easy updates | ❌ | ✅ |
| Category filtering | ❌ | ✅ |
| Unique FAQs per page | ✅ | ❌ |
| Reusable across pages | ❌ | ✅ |

---

## 🚀 Next Steps

1. **Create main FAQ page** at `/faqs`
2. **Add all your FAQs** to that page with categories
3. **Use Referenced variant** on service pages (Road Freight, Air Freight, etc.)
4. **Enjoy automatic updates** - change FAQ once, updates everywhere!

---

## 🎨 Category Options

When using Referenced variant, you can filter by:

- All (show all categories)
- General
- International Shipping
- Air Freight
- Sea Freight
- **Road Freight** ← Use this for your road freight page
- Customs & Compliance
- Pricing & Charges
- Vehicle Transport
- Warehousing

---

**Simple, clean, and effective!** 🎯
