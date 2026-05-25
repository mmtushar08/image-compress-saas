# Schema Markup Audit Report — Shrinkix.com
**Date:** 2026-05-25  
**Scope:** JSON-LD structured data across all pages  
**Current Schema Score: 0 / 100** — no schema markup exists anywhere

---

## Executive Summary

Shrinkix has zero structured data. No JSON-LD, no microdata, no RDFa.
This is a significant missed opportunity: the site has rich content that directly maps to high-value schema types — FAQPage, HowTo, SoftwareApplication, Offer, and APIReference — all of which can produce rich results in Google (expanded FAQs, step-by-step snippets, price chips, star ratings).

This report lists every schema type that applies, the exact code for each, and the component file where it should be injected.

---

## 1. Schema Inventory by Page

### Homepage (`/`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `WebSite` | Root identity | Sitelinks search box |
| `Organization` | Brand info, contact, logo | Knowledge panel |
| `SoftwareApplication` | Web-based compression tool | App card with rating/price |
| `HowTo` | 3-step "Upload once, Shrinkix does the rest" section | Step-by-step snippet |
| `FAQPage` | 5-question FAQ accordion | Expandable FAQ in results |
| `ItemList` (features) | 6 feature cards | Could appear in AI answers |

### Pricing Page (`/pricing`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `Product` + `Offer` | Free, Web Pro ($39/yr), Web Ultra ($59/yr) plans | Pricing chip in results |
| `FAQPage` | No FAQ on this page yet — should add one | Expandable FAQ |

### Developers Page (`/developers`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `FAQPage` | 4 FAQ items in DeveloperFAQ.jsx | Expandable FAQ in results |
| `SoftwareApplication` | Developer API as a software product | App info |

### Developer Pricing Page (`/developers/pricing`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `Product` + `Offer` | API Free, Pro ($35/mo), Ultra ($90/mo), Enterprise | Pricing chip |
| `FAQPage` | 8-question FAQ (longest FAQ on the site) | Expandable FAQs |

### API Docs Page (`/api-docs`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `TechArticle` | Full API reference documentation | Article snippet |
| `HowTo` | "Getting started" code examples | Step-by-step |
| `BreadcrumbList` | Docs > Authentication > Compressing | Breadcrumb in results |

### How It Works (`/developers/how-it-works`)

| Schema Type | Why It Applies | Rich Result Potential |
|-------------|---------------|----------------------|
| `HowTo` | Step-by-step developer integration | Step snippet |
| `BreadcrumbList` | Home > Developers > How It Works | Breadcrumb |

---

## 2. Schema Implementations (Ready-to-Use Code)

### 2.1 WebSite Schema — Add to `index.html`

Enables the sitelinks search box in Google results.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shrinkix",
  "url": "https://shrinkix.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://shrinkix.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

### 2.2 Organization Schema — Add to all pages (global component)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shrinkix",
  "url": "https://shrinkix.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://shrinkix.com/logo.png",
    "width": 200,
    "height": 60
  },
  "description": "Shrinkix is an image compression and conversion tool for developers, designers, and teams. Supports PNG, JPG, WebP, and AVIF formats.",
  "email": "support@shrinkix.com",
  "foundingDate": "2024",
  "sameAs": [],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@shrinkix.com",
      "availableLanguage": "English"
    }
  ]
}
```

**File:** `client/src/App.jsx` — inject once as a global `<script type="application/ld+json">` via `react-helmet-async`.

---

### 2.3 SoftwareApplication Schema — `Home.jsx`

Maps to Shrinkix as a web application. Required for App cards in Google.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shrinkix",
  "applicationCategory": "MultimediaApplication",
  "applicationSubCategory": "Image Compression",
  "operatingSystem": "Web",
  "url": "https://shrinkix.com",
  "description": "Compress and convert PNG, JPG, WebP, and AVIF images automatically. Free online image compressor with API access for developers.",
  "featureList": [
    "Image compression",
    "Format conversion (WebP, AVIF, PNG, JPG)",
    "Bulk image optimization",
    "REST API",
    "Privacy-first — files deleted after processing",
    "Supports up to 150MB files (Ultra plan)"
  ],
  "screenshot": "https://shrinkix.com/screenshot.png",
  "softwareVersion": "2.0",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "description": "20 images per day, 5MB file limit"
    },
    {
      "@type": "Offer",
      "name": "Web Pro",
      "price": "39",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "39",
        "priceCurrency": "USD",
        "unitCode": "ANN",
        "billingDuration": "P1Y"
      }
    },
    {
      "@type": "Offer",
      "name": "Web Ultra",
      "price": "59",
      "priceCurrency": "USD"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

> **Note:** Only add `aggregateRating` when you have real reviews (Trustpilot, G2, etc.) — fabricated ratings violate Google's guidelines.

---

### 2.4 HowTo Schema — `HowItWorksSection.jsx`

Maps directly to the 3 steps currently in the component:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Compress Images with Shrinkix",
  "description": "Shrinkix automatically compresses and converts your images in three simple steps.",
  "totalTime": "PT1M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Upload your images",
      "text": "Add PNG, JPG, WebP, or AVIF files — single images or bulk uploads.",
      "url": "https://shrinkix.com/#upload"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Automatic conversion and compression",
      "text": "Shrinkix optimizes each image for size and quality in seconds.",
      "url": "https://shrinkix.com/#upload"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Download optimized files",
      "text": "Smaller images, same visual quality, ready for production.",
      "url": "https://shrinkix.com/#upload"
    }
  ]
}
```

---

### 2.5 FAQPage Schema — `FAQ.jsx` (Homepage)

Maps directly to the 5 existing FAQ items:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my data safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your images are uploaded via a secure SSL connection. Shrinkix processes them automatically and deletes them from servers immediately after download. No one else has access to your files."
      }
    },
    {
      "@type": "Question",
      "name": "How does the compression work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shrinkix uses smart lossy compression techniques to reduce the number of colors in image data, requiring fewer bytes to store. The effect is nearly invisible to the eye but makes a very large difference in file size."
      }
    },
    {
      "@type": "Question",
      "name": "What is the maximum file size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free users: 10 MB per image. Pro users: 25 MB. Ultra users: 100 MB per image."
      }
    },
    {
      "@type": "Question",
      "name": "Do you support animated PNGs or WebPs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Currently, Shrinkix focuses on static image compression to ensure the highest quality and speed. Supported formats: standard JPG, PNG, and WebP."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the compressed images commercially?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Once compressed, images are yours to use freely for any personal or commercial project with no attribution required."
      }
    }
  ]
}
```

---

### 2.6 FAQPage Schema — `DeveloperFAQ.jsx` (Developers Page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I sign up for an API account?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sign up for the developer API by entering your name and email above. An activation email will be sent. Clicking the link in that email logs you in and directs you to the dashboard immediately."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a maximum file size limit for the API?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The maximum file size is 100MB for Enterprise plans. Images should not exceed 256MP canvas size (32,000 pixels in width or height)."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use one API account for multiple websites?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. In the API dashboard, you can create multiple API keys — one per project or website. This lets you monitor compressions separately for each implementation."
      }
    },
    {
      "@type": "Question",
      "name": "Can Shrinkix see what images I have uploaded?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Shrinkix cannot see the content of your images. Only minimal personal information is collected to administer your account and provide requested services."
      }
    }
  ]
}
```

---

### 2.7 Product + Offer Schema — `Pricing.jsx`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Shrinkix Web Plans",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Shrinkix Free",
        "description": "20 images per day, up to 5MB per file, web interface only.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/pricing"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "name": "Shrinkix Web Pro",
        "description": "Unlimited images, 75MB file limit, priority support. Web interface only.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "39",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/checkout?tier=pro",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "39",
            "priceCurrency": "USD",
            "billingDuration": "P1Y",
            "unitCode": "ANN"
          }
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Product",
        "name": "Shrinkix Web Ultra",
        "description": "Unlimited images, 150MB file limit, highest priority support. Web interface only.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "59",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/checkout?tier=ultra"
        }
      }
    }
  ]
}
```

---

### 2.8 Product + Offer Schema — `DeveloperPricing.jsx`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Shrinkix API Plans",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Shrinkix API Free",
        "description": "500 API credits per month, 5MB file limit, PNG/JPEG/WebP/AVIF.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/developers"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "name": "Shrinkix API Pro",
        "description": "5,000 API credits/month, batch processing, format conversion, 25MB file limit.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "35",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/checkout/api?tier=api-pro",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "35",
            "priceCurrency": "USD",
            "billingDuration": "P1M",
            "unitCode": "MON"
          }
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Product",
        "name": "Shrinkix API Ultra",
        "description": "15,000 API credits/month, dedicated support, 50MB file limit.",
        "brand": { "@type": "Brand", "name": "Shrinkix" },
        "offers": {
          "@type": "Offer",
          "price": "90",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://shrinkix.com/checkout/api?tier=api-ultra"
        }
      }
    }
  ]
}
```

---

### 2.9 TechArticle Schema — `APIDocsPage.jsx`

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Shrinkix API Reference Documentation",
  "description": "Complete reference for the Shrinkix Image Compression and Conversion API. Covers authentication, compressing images, converting formats, error handling, and rate limits.",
  "url": "https://shrinkix.com/api-docs",
  "author": {
    "@type": "Organization",
    "name": "Shrinkix"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Shrinkix",
    "logo": {
      "@type": "ImageObject",
      "url": "https://shrinkix.com/logo.png"
    }
  },
  "dateModified": "2026-05-25",
  "proficiencyLevel": "Beginner",
  "dependencies": "Node.js, Python, PHP, Ruby, Go, Java, or C#",
  "programmingLanguage": ["JavaScript", "Python", "PHP", "Ruby", "Go", "Java", "C#"]
}
```

---

### 2.10 BreadcrumbList Schema — Inner Pages

Add to `/developers`, `/docs`, `/api-docs`, `/developers/pricing`, `/developers/how-it-works`:

```json
// Example for /developers page:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://shrinkix.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Developers",
      "item": "https://shrinkix.com/developers"
    }
  ]
}
```

---

## 3. Implementation Architecture

### Option A: Inline per-component (Recommended for React SPA)

Create a `useJsonLd` hook and inject inside each page component via `react-helmet-async`:

```jsx
// client/src/hooks/useJsonLd.js
import { Helmet } from 'react-helmet-async';

export function JsonLd({ schema }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
```

Usage in a page component:
```jsx
// In Home.jsx:
import { JsonLd } from '../../../hooks/useJsonLd';
import { faqSchema, howToSchema, softwareAppSchema } from '../../../seo/schemas';

export default function Home() {
  return (
    <main>
      <JsonLd schema={softwareAppSchema} />
      <JsonLd schema={howToSchema} />
      <JsonLd schema={faqSchema} />
      {/* ... rest of component */}
    </main>
  );
}
```

### Schema File Structure

```
client/src/seo/
├── schemas/
│   ├── organization.js     ← global, inject in App.jsx
│   ├── website.js          ← global, inject in App.jsx
│   ├── softwareApp.js      ← Home.jsx
│   ├── howTo.js            ← Home.jsx (HowItWorksSection)
│   ├── faqHome.js          ← Home.jsx (FAQ component)
│   ├── faqDevelopers.js    ← Developers.jsx
│   ├── faqDeveloperPricing.js ← DeveloperPricing.jsx
│   ├── pricingWeb.js       ← Pricing.jsx
│   ├── pricingApi.js       ← DeveloperPricing.jsx
│   ├── techArticle.js      ← APIDocsPage.jsx
│   └── breadcrumbs.js      ← all inner pages
└── index.js                ← re-exports all schemas
```

---

## 4. Schema Issues to Fix Immediately

| Issue | File | Fix |
|-------|------|-----|
| FAQ uses `<h4>` instead of `<h3>` | `DeveloperFAQ.jsx`, `DeveloperPricing.jsx` | Change tags — schema answers must match visible HTML |
| Pricing inconsistency: FAQ says API Pro = $19, plans say $35 | `DeveloperPricing.jsx` FAQ item 02 | Align schema prices with actual displayed prices |
| FAQ says "API Ultra = 20,000 credits for $49" | `DeveloperPricing.jsx` FAQ item 02 | Actual plan shows 15,000 credits for $90 — fix the text |
| No `aggregateRating` source | — | Don't add rating schema without a real review source |

> **Critical:** The `DeveloperPricing.jsx` FAQ (item 02) has prices that contradict the pricing cards on the same page. Schema validators and Google will flag this inconsistency. Fix the copy first, then add schema.

---

## 5. Validation Checklist

After implementing, validate all schemas at:
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/
- **Structured Data Linter:** http://linter.structured-data.org/

Expected rich result types after implementation:
- ✅ FAQ dropdowns on homepage, /developers, /developers/pricing
- ✅ Pricing chips on /pricing and /developers/pricing
- ✅ How-To steps on homepage
- ✅ Breadcrumb trails on inner pages
- ✅ Organization knowledge panel (within 2–4 weeks of indexing)

---

*Schema audit complete. Total schemas to implement: 10 types across 6 pages.*
