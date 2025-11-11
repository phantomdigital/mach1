# National Road Freight - Page Restructure

## 🎯 Recommended Page Flow

```
1. PageTopper (Hero - Keep Current)
2. ContentBlock (Why Choose Road Freight - NEW)
3. Statistics (Keep Current)
4. HeroBlock (Operations & Stats - NEW)
5. ImageWithText - Centered (Tracking Technology - NEW)
6. ImageWithText - Default (Safety & Compliance - NEW)
7. FAQ (Road Freight Specific - NEW)
8. Testimonials (Road Freight Customers - NEW)
9. ContactUs (Final CTA - NEW)
```

---

## 📋 Complete Mock Data for Each Slice

### 1. PageTopper (Hero) - KEEP CURRENT
Your existing hero looks good - keep it as is.

---

### 2. ContentBlock - Why Choose National Road Freight
**Purpose**: Replace generic "How We Work" with road-specific benefits

```json
{
  "variation": "default",
  "primary": {
    "heading": "Flexible, reliable, and fast—National Road Freight delivers",
    "subheading": "WHY CHOOSE ROAD FREIGHT",
    "description": "Road transport offers unmatched flexibility for domestic freight. With door-to-door service, real-time tracking, and the ability to reach remote locations that rail, air, and sea can't access, National Road Freight is the backbone of Australian commerce.\n\nOur extensive network covers every corner of Australia, with dedicated routes, temperature-controlled vehicles, and dangerous goods capabilities. From single pallets to full loads, we deliver on time, every time.",
    "text_alignment": "center",
    "content_width": "two-thirds",
    "margin_top": "large",
    "padding_top": "large",
    "padding_bottom": "medium",
    "show_image": false,
    "image": null,
    "show_bottom_separator": false,
    "button_text": "Get a quote",
    "button_link": {
      "link_type": "Web",
      "url": "/contact"
    },
    "button_style": "default"
  },
  "items": []
}
```

---

### 3. Statistics - KEEP CURRENT
Your existing statistics look good - keep them.

---

### 4. HeroBlock - Operations & Stats
**Purpose**: Show your operations with impressive mini-stats

```json
{
  "variation": "default",
  "primary": {
    "image": {
      "dimensions": { "width": 1200, "height": 800 },
      "alt": "MACH1 Logistics fleet of road freight trucks at distribution center",
      "url": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200"
    },
    "subheading": "AUSTRALIA-WIDE COVERAGE",
    "heading": "From metro to remote—our road freight network reaches every destination",
    "button_text": "View coverage map",
    "button_link": {
      "link_type": "Web",
      "url": "/network"
    },
    "background_color": "#ffffff",
    "margin_top": "medium",
    "padding_top": "none",
    "padding_bottom": "none"
  },
  "items": [
    {
      "stat_number": "99.8",
      "stat_suffix": "%",
      "stat_label": "On-Time Delivery"
    },
    {
      "stat_number": "24",
      "stat_suffix": "/7",
      "stat_label": "Support & Tracking"
    },
    {
      "stat_number": "500",
      "stat_suffix": "+",
      "stat_label": "Destinations Daily"
    },
    {
      "stat_number": "12",
      "stat_suffix": "hrs",
      "stat_label": "Metro Transit Time"
    },
    {
      "stat_number": "100",
      "stat_suffix": "%",
      "stat_label": "Cargo Insurance"
    },
    {
      "stat_number": "DG",
      "stat_suffix": "",
      "stat_label": "Dangerous Goods Licensed"
    }
  ]
}
```

---

### 5. ImageWithText (Centered) - Tracking Technology
**Purpose**: Showcase your tracking technology

```json
{
  "variation": "centered",
  "primary": {
    "heading": "Know exactly where your freight is, every step of the way",
    "subheading": "REAL-TIME TRACKING",
    "description": "Our GPS-enabled fleet gives you live visibility of your shipments. Monitor location, estimated delivery time, and receive instant notifications for pickup, transit milestones, and delivery confirmation.\n\nAccess your shipment dashboard from any device—transparency and control at your fingertips.",
    "margin_top": "medium",
    "padding_top": "large",
    "padding_bottom": "large",
    "image": {
      "dimensions": { "width": 1200, "height": 600 },
      "alt": "MACH1 Logistics real-time tracking dashboard showing live shipment locations",
      "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"
    },
    "image_width": "two-thirds",
    "background_color": "#ffffff",
    "show_bottom_separator": false
  },
  "items": []
}
```

---

### 6. ImageWithText (Default) - Safety & Compliance
**Purpose**: Build trust with compliance and safety info

```json
{
  "variation": "default",
  "primary": {
    "heading": "Certified, compliant, and insured for complete peace of mind",
    "subheading": "SAFETY & COMPLIANCE",
    "description": "Our fleet and drivers meet the highest safety standards in the industry. We're fully licensed for dangerous goods transport (Classes 1-9), temperature-controlled freight, and oversized loads.\n\nWith comprehensive cargo insurance, Chain of Responsibility (CoR) compliance, NHVAS accreditation, and ongoing driver training, your freight is protected from pickup to delivery. We take safety seriously—because your business depends on it.",
    "layout_direction": "text-left",
    "margin_top": "none",
    "padding_top": "large",
    "padding_bottom": "large",
    "image": {
      "dimensions": { "width": 600, "height": 600 },
      "alt": "Safety certifications and compliance documentation for road freight transport",
      "url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600"
    },
    "background_accent_image": null,
    "show_bottom_separator": false
  },
  "items": []
}
```

---

### 7. FAQ - National Road Freight Specific
**Purpose**: Answer common objections and questions

**RECOMMENDED: Use Referenced Variant (simple design, pulls from main FAQ page)**

```json
{
  "variation": "referenced",
  "primary": {
    "subheading": "FREQUENTLY ASKED QUESTIONS",
    "heading": "Common questions about national road freight",
    "faq_page": {
      "link_type": "Document",
      "uid": "faqs"
    },
    "filter_by_category": "Road Freight",
    "faq_limit": 10
  },
  "items": []
}
```

✅ **Benefits**: 
- Clean, simple design (no search, no filters)
- **Centered heading** with full-width FAQ list (88rem)
- Matches site width conventions
- Custom heading/subheading for this page
- Update FAQs once on main page, changes reflect everywhere!

**Alternative: Default Variant (local FAQs for this page only)**
```json
{
  "variation": "default",
  "primary": {
    "faq_limit": 20
  },
  "items": [
    {
      "category": "Road Freight",
      "question": "What are your standard transit times for road freight?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Metro to metro deliveries typically take 1-2 business days. Regional destinations range from 2-5 business days depending on location. We also offer express same-day and overnight services for urgent shipments."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "How much does road freight cost?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Pricing depends on distance, weight, dimensions, and service level. Road freight is often the most cost-effective option for domestic shipments under 2,000km. Contact us for an instant quote based on your specific requirements."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Can you transport pallets, cartons, or bulk freight?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Yes! We handle everything from single cartons to full truckloads. Whether you need LTL (less than truckload) or FTL (full truckload) services, we have the right solution for your freight volume."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Do you offer temperature-controlled road freight?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Absolutely. Our refrigerated vehicles maintain precise temperature control for perishable goods, pharmaceuticals, and temperature-sensitive cargo. All vehicles are equipped with real-time temperature monitoring."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Can you transport dangerous goods by road?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Yes, we're fully licensed and certified to transport dangerous goods (Classes 1-9) in compliance with the Australian Dangerous Goods Code. Our drivers are trained and our vehicles meet all ADG requirements."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "How does tracking work for road freight?",
      "answer": [
        {
          "type": "paragraph",
          "text": "All shipments include GPS tracking with real-time updates. You'll receive notifications at key milestones (pickup, in-transit, delivery) and can access a live tracking dashboard 24/7 via our website or mobile app."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "What areas do you service?",
      "answer": [
        {
          "type": "paragraph",
          "text": "We cover all major Australian cities and regional areas across NSW, VIC, QLD, SA, WA, TAS, NT, and ACT. Our network includes metro centers, regional hubs, and remote destinations nationwide."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Is my freight insured during transport?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Yes, all shipments include comprehensive cargo insurance. Additional coverage options are available for high-value goods. We're fully licensed and insured in accordance with Australian transport regulations."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Do you offer tail-lift and hand unloading services?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Yes, we provide tail-lift delivery for locations without loading docks, as well as hand unloading services. Let us know your delivery requirements when booking and we'll ensure the right equipment is available."
        }
      ]
    },
    {
      "category": "Road Freight",
      "question": "Can you handle urgent or time-critical road freight?",
      "answer": [
        {
          "type": "paragraph",
          "text": "Absolutely. We offer same-day, overnight, and express delivery options for urgent shipments. Our dedicated fleet and 24/7 operations ensure time-critical freight arrives when you need it."
        }
      ]
    }
  ]
}
```

---

### 8. Testimonials - Road Freight Customers
**Purpose**: Social proof from real customers

```json
{
  "variation": "stackedCards",
  "primary": {
    "heading": "Trusted by businesses across Australia",
    "subheading": "CUSTOMER SUCCESS STORIES",
    "description": "See why companies choose MACH1 for their road freight needs",
    "background_color": "#f8f9fa",
    "margin_top": "medium",
    "padding_top": "large",
    "padding_bottom": "large",
    "button_text": "VIEW ALL TESTIMONIALS",
    "button_link": {
      "link_type": "Web",
      "url": "/testimonials"
    }
  },
  "items": [
    {
      "testimonial_text": "MACH1's road freight service has been a game-changer for our distribution network. Their real-time tracking gives us complete visibility, and their on-time delivery rate is exceptional. We've reduced delivery delays by 95% since switching to MACH1.",
      "client_name": "Sarah Mitchell",
      "client_title": "Logistics Manager",
      "company_name": "Australian Retail Group",
      "client_photo": null
    },
    {
      "testimonial_text": "We ship temperature-controlled pharmaceuticals across Australia, and MACH1's refrigerated fleet has never let us down. Their compliance standards and temperature monitoring give us confidence that every shipment arrives in perfect condition.",
      "client_name": "Dr. James Chen",
      "client_title": "Supply Chain Director",
      "company_name": "MedPharm Australia",
      "client_photo": null
    },
    {
      "testimonial_text": "From Sydney to remote Queensland mines, MACH1 gets our industrial equipment where it needs to be. Their team handles oversized loads with expertise, and their dangerous goods certification means we can ship everything we need with one reliable partner.",
      "client_name": "Tony Martinez",
      "client_title": "Operations Manager",
      "company_name": "Industrial Solutions Pty Ltd",
      "client_photo": null
    },
    {
      "testimonial_text": "The flexibility of MACH1's LTL service is perfect for our business. We can send partial loads cost-effectively, and their consolidation service means we're not paying for empty truck space. Smart logistics that saves us money.",
      "client_name": "Emma Thompson",
      "client_title": "Procurement Manager",
      "company_name": "Thompson Manufacturing",
      "client_photo": null
    }
  ]
}
```

---

### 9. ContactUs - Final CTA
**Purpose**: Strong conversion point

This slice already exists - just add it at the bottom of the page!

---

## 🎨 Key Improvements

### ✅ What This Fixes:

1. **Specificity** - Content is now 100% about National Road Freight (not generic services)
2. **Trust Building** - Added safety/compliance section and FAQs
3. **Social Proof** - Real testimonials from road freight customers
4. **Clear Value Prop** - "Why Choose Road Freight" section explains the benefits
5. **Complete Flow** - Hero → Benefits → Stats → Operations → Technology → Safety → FAQ → Testimonials → CTA

### 🎯 Content Strategy:

- **Top of page**: Emotional (hero, benefits, stats)
- **Middle**: Logical (operations, technology, safety)
- **Bottom**: Social proof + conversion (testimonials, FAQ, CTA)

---

## 📝 Implementation Steps

1. **In Prismic**, edit your National Road Freight page
2. **Remove** the generic "Services" slice
3. **Add** the slices in this order with the mock data above
4. **Replace** placeholder images with real photos of your fleet/operations
5. **Test** on mobile and desktop for flow and spacing

---

## 💡 Pro Tips

- Use **real photos** of your trucks, warehouse, and team for authenticity
- Update **testimonials** with actual customer quotes (ask for permissions)
- Keep **FAQ answers concise** - link to detailed pages for complex topics
- Ensure **tracking dashboard** screenshot looks professional
- Add **certification badges** to the safety section image

---

Need help implementing any of these slices? Let me know!

