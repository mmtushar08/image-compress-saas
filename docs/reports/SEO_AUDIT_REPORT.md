# SEO Audit Report — Shrinkix.com
**Date:** 2026-05-25  
**Project:** image-compress-saas  
**Stack:** React 19 SPA + Vite + Express API  
**Auditor:** Claude Code (automated deep scan)

---

## Executive Summary

Shrinkix has solid content and good internal linking, but is missing almost every technical SEO foundation a React SPA needs. The site ships one static `<title>` for all pages, has zero meta descriptions, no Open Graph / Twitter cards, no robots.txt, no sitemap, and no structured data. Search engines will crawl it but will struggle to rank, preview, or understand it. These are high-leverage fixes that can be implemented in a single sprint.

**Overall SEO Score: 28 / 100**

---

## Audit Categories

| # | Category | Score | Priority |
|---|----------|-------|----------|
| 1 | Title Tags & Meta Descriptions | 5/20 | 🔴 Critical |
| 2 | Open Graph & Social Sharing | 0/10 | 🔴 Critical |
| 3 | Robots.txt & Sitemap | 0/10 | 🔴 Critical |
| 4 | Structured Data (JSON-LD) | 0/15 | 🔴 Critical |
| 5 | Canonical Tags | 0/5 | 🔴 Critical |
| 6 | Heading Hierarchy (H1–H3) | 8/10 | 🟡 Medium |
| 7 | Image Alt Tags | 3/10 | 🟠 High |
| 8 | Internal Linking | 8/10 | ✅ Good |
| 9 | Performance & Loading | 4/10 | 🟡 Medium |
| **Total** | | **28/100** | |

---

## 1. Title Tags & Meta Descriptions — 5/20

### Current State

**File:** `client/index.html`

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Image Compression Web & API for Faster Websites | Shrinkix</title>
  <!-- No meta description -->
  <!-- No OG tags -->
  <!-- No Twitter cards -->
</head>
```

### Issues

- **Single static title** — every route (`/`, `/pricing`, `/developers`, `/docs`, `/signup`) shows the exact same title in the browser tab and in Google results. Google will not rank multiple pages for different keywords when they all share one title.
- **Zero meta descriptions** — Google uses these for the blue-link snippet in results. Missing descriptions lead to Google auto-generating unhelpful excerpts.
- **No `react-helmet-async`** or any head management library installed.

### Recommended Page Titles & Descriptions

| Route | Recommended Title (≤60 chars) | Recommended Description (≤160 chars) |
|-------|-------------------------------|--------------------------------------|
| `/` | Compress & Convert Images Free — Shrinkix | Instantly compress PNG, JPG, WebP, and AVIF images online. Free, fast, and private — files deleted after processing. No account required. |
| `/pricing` | Pricing Plans — Shrinkix | Choose a free or paid Shrinkix plan. Unlimited images, priority support, and large file limits from $39/year. |
| `/developers` | Image Compression API for Developers — Shrinkix | Automate image optimization with the Shrinkix REST API. Compress PNG, JPEG, and WebP at scale. Free plan available. |
| `/docs` | API Documentation — Shrinkix | Complete reference for the Shrinkix Image Compression API. Endpoints, authentication, SDKs, and code examples. |
| `/signup` | Create a Free Account — Shrinkix | Sign up for Shrinkix and start compressing images instantly. Free plan includes 20 images per day. |

### Fix

Install `react-helmet-async` and create a `SEOHead` component:

```bash
cd client && npm install react-helmet-async
```

```jsx
// client/src/components/SEOHead.jsx
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, canonical, ogImage }) {
  const siteUrl = 'https://shrinkix.com';
  const fullTitle = title ? `${title} | Shrinkix` : 'Compress & Convert Images Free — Shrinkix';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
```

Then wrap `App.jsx` in `<HelmetProvider>` and add `<SEOHead>` to each page component.

---

## 2. Open Graph & Social Sharing — 0/10

### Current State

No Open Graph or Twitter card tags exist anywhere in the codebase.

```bash
# Verified via grep — zero results:
grep -r "og:\|twitter:" client/src --include="*.jsx" --include="*.html"
```

### Impact

When someone shares a Shrinkix link on Twitter, LinkedIn, Slack, or WhatsApp, the preview shows a bare URL with no image, no title, and no description. This kills click-through rates from social sharing.

### Required Tags (per page)

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://shrinkix.com/" />
<meta property="og:title" content="Compress & Convert Images Free — Shrinkix" />
<meta property="og:description" content="Instantly compress PNG, JPG, WebP, and AVIF images..." />
<meta property="og:image" content="https://shrinkix.com/og-image.png" />
<meta property="og:site_name" content="Shrinkix" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@shrinkix" />
<meta name="twitter:title" content="Compress & Convert Images Free — Shrinkix" />
<meta name="twitter:description" content="Instantly compress PNG, JPG, WebP, and AVIF images..." />
<meta name="twitter:image" content="https://shrinkix.com/og-image.png" />
```

### Action Items

1. Create an OG image (`1200×630px`) showing the Shrinkix logo + tagline and save to `client/public/og-image.png`
2. Add OG and Twitter tags via the `SEOHead` component described above

---

## 3. Robots.txt & Sitemap — 0/10

### Current State

Neither file exists:

```bash
find client/public -name "robots.txt" -o -name "sitemap.xml"
# (no output)
```

### Impact

- Without `robots.txt`, Google makes its own crawl decisions and may crawl `/admin`, `/checkout`, `/dashboard` which wastes crawl budget and exposes internal routes in search results.
- Without a `sitemap.xml`, Google has to discover pages by crawling links — it may miss or deprioritize important pages.

### Fix: robots.txt

Create `client/public/robots.txt`:

```
User-agent: *
Allow: /

Disallow: /admin
Disallow: /dashboard
Disallow: /checkout
Disallow: /buy-credits
Disallow: /auth
Disallow: /verify

Sitemap: https://shrinkix.com/sitemap.xml
```

### Fix: sitemap.xml

Create `client/public/sitemap.xml` (static version, update when routes change):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://shrinkix.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://shrinkix.com/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://shrinkix.com/developers</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://shrinkix.com/docs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://shrinkix.com/developers/how-it-works</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://shrinkix.com/signup</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

After this, submit the sitemap URL in [Google Search Console](https://search.google.com/search-console).

---

## 4. Structured Data (JSON-LD) — 0/15

### Current State

No JSON-LD, microdata, or schema.org markup exists anywhere:

```bash
grep -r "schema\|ld+json\|@context\|itemscope" client/src
# (no output)
```

### Impact

Structured data enables rich results in Google: star ratings, FAQ dropdowns, pricing chips, and breadcrumbs. Missing it means competitors with schema markup appear more prominent in results.

### Schemas to Implement

#### A. Organization Schema (add to all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shrinkix",
  "url": "https://shrinkix.com",
  "logo": "https://shrinkix.com/logo.png",
  "description": "Image compression and optimization tool for developers, designers, and teams.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@shrinkix.com"
  }
}
```

#### B. SoftwareApplication Schema (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shrinkix",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Compress and convert PNG, JPG, WebP, and AVIF images automatically."
}
```

#### C. FAQPage Schema (homepage & developers page)

The FAQ component at `client/src/components/FAQ.jsx` has 5 real questions — these should be marked up as FAQPage schema for Google FAQ rich results:

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
        "text": "Your images are uploaded via a secure SSL connection. We process them automatically and delete them from our servers immediately after you download them."
      }
    },
    {
      "@type": "Question",
      "name": "What is the maximum file size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free users: 10 MB. Pro users: 25 MB. Ultra users: 100 MB per image."
      }
    }
  ]
}
```

#### D. Pricing / Offer Schema (pricing page)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Shrinkix Web Pro",
  "description": "Unlimited image compression with 75MB file limit and priority support.",
  "offers": {
    "@type": "Offer",
    "price": "39",
    "priceCurrency": "USD",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock"
  }
}
```

#### E. BreadcrumbList Schema (inner pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shrinkix.com/" },
    { "@type": "ListItem", "position": 2, "name": "Developers", "item": "https://shrinkix.com/developers" }
  ]
}
```

---

## 5. Canonical Tags — 0/5

### Current State

No `<link rel="canonical">` tags anywhere in the codebase.

### Impact

React SPAs served via multiple URL patterns (with/without trailing slash, query params like `?tier=pro`) can create duplicate content. Google may split ranking signals across URLs.

### Fix

Include `<link rel="canonical">` in the `SEOHead` component per route (shown in Section 1 fix above). Example for home:

```html
<link rel="canonical" href="https://shrinkix.com/" />
```

---

## 6. Heading Hierarchy — 8/10

### Current State

Headings are generally well-structured but have one critical issue on the homepage.

**Homepage (`/`):**

The homepage renders two components both containing `<h1>`:

```jsx
// NewHeroSection.jsx:
<h1>Convert and compress images automatically</h1>

// DeveloperHero.jsx (on /developers):
<h1>Developer API: Automate your image compression workflow</h1>
```

The home page renders `<HeroSection>` (no h1) then `<NewHeroSection>` (has h1) — this is acceptable structure, but the upload area above NewHeroSection has no h1, which means the above-the-fold content lacks a primary heading.

**Pricing Page (`/pricing`):**

```jsx
// PricingHero.jsx:
<h2>Simple, Transparent Pricing</h2>
// ^ Uses h2 as the top heading on the page — should be h1
```

**Good patterns found:**
- `h2` for major sections (Features, FAQ, Problem, Solution)
- `h3` for cards and feature items
- Consistent nesting throughout

### Issues

| Page | Issue |
|------|-------|
| `/pricing` | Top heading is `<h2>` — should be `<h1>` |
| `/` | Upload area above the fold has no `<h1>` |
| `/developers` FAQ | Uses `<h4>` for FAQ items instead of semantic question elements |

### Fix

In `client/src/features/pricing/components/pricing/PricingHero.jsx`:
```jsx
// Change:
<h2>Simple, Transparent Pricing</h2>
// To:
<h1>Simple, Transparent Pricing</h1>
```

---

## 7. Image Alt Tags — 3/10

### Current State

The codebase uses almost no `<img>` tags. The one image is used as a CSS background:

```jsx
// HeroSection.jsx:
import heroBg from '../../../../assets/hero-bg.png';
<section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
```

CSS background images cannot have alt text and are invisible to screen readers and search engines.

Icons throughout the app use emoji characters (`⚡`, `📦`, `🎨`, `🚀`) as decorative elements — these are acceptable but may need `aria-hidden="true"` for accessibility.

The logo in `Navbar.jsx` is text-only ("Shrinkix"), not an `<img>` — so no alt tag issue there.

### Issues

- The hero background image conveys no meaning to Google Image Search
- No `<img>` tags with `alt` attributes found anywhere
- If images are ever added, there's no alt-text convention or enforcement

### Recommendations

1. Convert the hero background to a proper `<img>` element with meaningful alt text if it's content-relevant, or keep as CSS background (decorative)
2. Add `aria-hidden="true"` to all emoji icon elements
3. Add a linting rule (e.g. `eslint-plugin-jsx-a11y`) to enforce alt text going forward

```bash
cd client && npm install -D eslint-plugin-jsx-a11y
```

---

## 8. Internal Linking — 8/10

### Current State

Internal linking is the strongest SEO area. React Router `<Link>` components are used throughout.

**Navigation links (Navbar):**
- Home (`/`)
- Pricing (`/pricing`)
- Developers (`/developers`)
- Login / Dashboard

**Cross-page CTAs found:**
- Home → `/api-docs` (View API documentation)
- Home → `#upload` (anchor scroll)
- APISection → `/api-docs`
- FinalCTA → `/api-docs` and `#upload`
- PricingPreview → `/pricing`
- DeveloperCta → `/developers`

**Footer:** Only shows copyright — no footer navigation links.

### Issues

| Issue | Impact |
|-------|--------|
| Footer has no links | Google values footer links for crawl discovery and site structure |
| `/docs` and `/api-docs` are separate routes with duplicate content | Potential duplicate content issue |
| No breadcrumb navigation on inner pages | Missed structured data opportunity |
| Anchor CTAs use `<a href="#upload">` instead of React scroll | May cause full-page reloads on some routes |

### Fix: Expand Footer Links

```jsx
// Footer.jsx — add meaningful navigation
<footer className="footer">
  <div className="footer-links">
    <a href="/">Home</a>
    <a href="/pricing">Pricing</a>
    <a href="/developers">Developers</a>
    <a href="/docs">API Docs</a>
    <a href="/signup">Sign Up</a>
  </div>
  <p>&copy; 2025 Shrinkix. All rights reserved.</p>
</footer>
```

---

## 9. Performance & Page Load — 4/10

### Current State

**Good:**
- Font preconnect hints in `index.html` (`fonts.googleapis.com`, `fonts.gstatic.com`)
- GSAP animations are client-side only and don't block rendering
- Vite build system produces optimized bundles

**Missing:**

| Issue | Details |
|-------|---------|
| No `preload` for critical assets | Hero background image loads without `<link rel="preload">` |
| No favicon | `<link rel="icon">` missing from `index.html` |
| No `apple-touch-icon` | Missing for mobile home screen bookmarks |
| No `theme-color` meta tag | Missing for PWA-style browser chrome theming |
| No font `display=swap` fallback handling | Fonts could cause FOUT |
| SPA = no SSR | Google can render JavaScript, but crawl latency is higher than static HTML |
| Large JS bundle (GSAP + Stripe loaded eagerly) | Stripe.js should only load on checkout pages |

### Fix: Favicon & Basic Meta

Add to `client/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#3c78d8" />
```

### Fix: Defer Stripe to Checkout Only

Move Stripe imports from global scope into the `Checkout` and `CreditPurchase` components with dynamic import:

```js
// Only load Stripe when the user navigates to checkout
const { loadStripe } = await import('@stripe/stripe-js');
```

---

## 10. Additional Issues Found

### A. Duplicate/Inconsistent Content

The codebase has files duplicated between `client/src/components/` and `client/src/features/*/components/`. This is a code maintenance issue, not a search ranking issue, but inconsistent copy may ship slightly different text to users.

### B. Missing Privacy Policy & Terms Pages

No routes found for `/privacy`, `/terms`, or `/legal`. Google and users both expect these for trust signals. They also protect the business legally.

```jsx
// Add to App.jsx:
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
```

### C. Lang Attribute

`index.html` correctly sets `<html lang="en">` — this is good for i18n signals.

### D. No 404 Page

No catch-all route in `App.jsx`:

```jsx
// Add to App.jsx routes:
<Route path="*" element={<NotFound />} />
```

A proper 404 prevents Google from indexing broken URLs.

### E. FAQ Uses `<h4>` Instead of `<h3>`

In `DeveloperFAQ.jsx`, questions use `<h4>` tags:
```jsx
<h4>01. How can I sign up for an API account?</h4>
```
These should be `<h3>` for proper heading nesting under the `<h2>Frequently Asked Questions</h2>`.

---

## Priority Action Plan

### Phase 1 — Critical (1–2 days)

| Task | File(s) to Edit |
|------|-----------------|
| Install `react-helmet-async` | `client/package.json` |
| Create `SEOHead` component | `client/src/components/SEOHead.jsx` (new) |
| Add unique title + description to each page | `Home.jsx`, `Pricing.jsx`, `Developers.jsx`, `ApiDocs.jsx`, `Signup.jsx` |
| Add canonical tags via `SEOHead` | Same as above |
| Add Open Graph + Twitter tags via `SEOHead` | Same as above |
| Create `robots.txt` | `client/public/robots.txt` (new) |
| Create `sitemap.xml` | `client/public/sitemap.xml` (new) |
| Add favicon | `client/public/favicon.svg` (new) + `index.html` |

### Phase 2 — High Impact (3–5 days)

| Task | File(s) to Edit |
|------|-----------------|
| Add FAQPage JSON-LD schema | `FAQ.jsx`, `DeveloperFAQ.jsx` |
| Add Organization JSON-LD schema | `index.html` or `App.jsx` |
| Add SoftwareApplication schema | `Home.jsx` |
| Add Pricing schema | `Pricing.jsx` |
| Fix `<h2>` → `<h1>` on Pricing page | `PricingHero.jsx` |
| Expand Footer with navigation links | `Footer.jsx` |
| Create `/privacy` and `/terms` pages | New components + `App.jsx` |
| Add 404 Not Found route | `App.jsx`, new `NotFound.jsx` |

### Phase 3 — Medium Impact (1 week)

| Task | Notes |
|------|-------|
| Submit sitemap to Google Search Console | Manual action |
| Create OG image (1200×630px) | Design asset |
| Add breadcrumb navigation on inner pages | New component |
| Lazy-load Stripe on checkout only | Performance |
| Add `eslint-plugin-jsx-a11y` | Alt text enforcement |
| Fix `<h4>` → `<h3>` in DeveloperFAQ | `DeveloperFAQ.jsx` |
| Consolidate `/docs` vs `/api-docs` or add canonical | Avoid duplicate content |

---

## Keyword Opportunities

Based on the product, these are high-value keywords the site should target:

| Keyword | Target Page | Monthly Volume (est.) |
|---------|-------------|----------------------|
| compress image online | `/` | Very High |
| image compressor | `/` | Very High |
| compress png online | `/` | High |
| webp converter | `/` | High |
| image compression api | `/developers` | Medium |
| compress jpeg online free | `/` | High |
| avif converter | `/` | Medium |
| bulk image compressor | `/` | Medium |
| image optimization api | `/developers` | Medium |
| compress image for website | `/` | Medium |

Content on the homepage already covers most of these organically. With proper title/description tags in place, the site should rank for several of these within 3–6 months.

---

## Conclusion

Shrinkix has good content, a clean product, and strong internal linking — a solid SEO foundation to build on. The critical gap is that all the technical SEO infrastructure (meta tags, sitemaps, structured data, social cards) is completely absent. These are well-understood, implementable fixes.

**Estimated improvement after Phase 1+2 fixes:** SEO score would rise from ~28 to ~75+, and Google would be able to properly index, preview, and rank each page individually.

---

*Report generated by automated code analysis. Verify keyword volumes with Google Search Console, Ahrefs, or SEMrush before prioritizing content changes.*
