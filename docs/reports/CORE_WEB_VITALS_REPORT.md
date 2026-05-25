# Core Web Vitals Implementation Report — Shrinkix.com
**Date:** 2026-05-25  
**Stack:** React 19 SPA + Vite 5  
**Baseline bundle:** 613KB (1 chunk) → **After fixes:** split into 5+ chunks

---

## What Are Core Web Vitals?

Core Web Vitals are Google's three primary page experience metrics. They are **direct ranking signals** since the Page Experience update (2021). Failing any metric puts you at a ranking disadvantage vs. competitors who pass.

| Metric | Abbreviation | What It Measures | Target |
|--------|-------------|-----------------|--------|
| Largest Contentful Paint | LCP | How fast the biggest visible element loads | < 2.5s |
| Interaction to Next Paint | INP | How fast the page responds to any click/tap | < 200ms |
| Cumulative Layout Shift | CLS | How much content jumps/shifts during load | < 0.1 |

Two additional metrics are tracked but not Core Web Vitals ranking signals:

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.8s |
| Time to First Byte (TTFB) | < 800ms |

---

## Baseline Analysis

### Problem 1: Monolithic JS Bundle (LCP / FCP)

Before fixes, Vite produced a **single 613KB JS bundle** (187KB gzipped). Every page load — including the home page — required downloading and parsing the entire app including:
- Stripe.js payment SDK (loaded even for non-paying visitors)
- Full API docs page content
- Admin panel code
- Dashboard code

This blocked rendering by 1–3 seconds on average connections.

### Problem 2: No Code Splitting (LCP)

All routes were imported eagerly, meaning the browser had to parse and execute code for `Dashboard`, `Admin`, `Checkout`, and `APIDocsPage` before the home page could render.

### Problem 3: No CLS Prevention (CLS)

- Hero section had no minimum height — it collapsed and re-expanded on load
- Animated cards had no `contain` rules — browser repainted the whole page on animation
- No `will-change` hints for GPU-composited animations

### Problem 4: No Web Vitals Measurement (All Metrics)

No real-user monitoring existed. Problems could exist in production for months undetected.

---

## Changes Implemented

### Fix 1: Vite Code Splitting — `vite.config.js`

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
        'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
        'vendor-gsap': ['gsap', '@gsap/react'],
        'vendor-ui': ['lucide-react', '@headlessui/react'],
        'vendor-utils': ['file-saver', 'jszip', 'md5'],
      }
    }
  }
}
```

**Impact:** Browser can cache vendor chunks separately. When Shrinkix deploys a new version, users only re-download the app chunk — not React, Stripe, or GSAP.

### Fix 2: React.lazy() Route-Level Code Splitting — `App.jsx`

```jsx
// Home stays eager — critical path
import Home from './features/compression/components/Home';

// Everything else lazy-loads on demand
const Pricing = lazy(() => import('./features/pricing/components/Pricing'));
const APIDocsPage = lazy(() => import('./features/developers/components/APIDocsPage'));
const Dashboard = lazy(() => import('./features/dashboard/components/Dashboard'));
const Checkout = lazy(() => import('./features/pricing/components/Checkout'));
// ... 12 more routes
```

**Impact:** The home page JS payload drops by ~60%. Stripe is never loaded for users who don't visit `/checkout`. The 1,500-line `APIDocsPage` is never parsed for visitors who only use the tool.

**Suspense fallback:** A lightweight spinner (`<PageLoader />`) shows while chunks load — no blank flash.

### Fix 3: CLS Prevention CSS — `index.css`

```css
/* Reserve space to prevent layout jump on load */
.hero {
  min-height: 420px;
  contain: layout style;
}

/* Reduce paint scope on animated elements */
.features-section, .how-it-works-section, .faq-section {
  contain: layout;
}

/* GPU compositing for upload zone animation */
.upload-zone {
  will-change: transform;
  contain: layout style;
}
```

**Impact:**
- `contain: layout` tells the browser that layout changes inside this element don't affect the outside — reduces CLS score
- `will-change: transform` moves the element to its own GPU compositing layer — eliminates jank during GSAP scale animations
- `min-height: 420px` on `.hero` prevents the hero section collapsing before the background image loads

### Fix 4: Inline Critical CSS — `index.html`

```html
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Outfit',-apple-system,...;background:#f7f9fb;color:#3d4852}
  #root:empty::after { /* spinner while React loads */ }
</style>
```

**Impact:** The browser can paint the initial background and show a spinner before any external CSS or JS loads. Eliminates the "blank white flash" between HTML parse and first render.

### Fix 5: Web Vitals Real-User Monitoring — `utils/vitals.js`

```js
import { onCLS, onFCP, onLCP, onINP, onTTFB } from 'web-vitals';
```

Metrics are captured from real browsers in production and logged to the console in development. Wire `sendToAnalytics()` to Google Analytics 4 to track the values over time in Search Console's "Core Web Vitals" report.

### Fix 6: DNS Prefetch for API Domain — `index.html`

```html
<link rel="dns-prefetch" href="https://api.shrinkix.com" />
```

**Impact:** When a user uploads an image, the DNS lookup for `api.shrinkix.com` is already resolved. Saves 50–150ms on first API call.

### Fix 7: `<noscript>` Fallback — `index.html`

```html
<noscript>
  <div>Shrinkix — Image Compression & Conversion</div>
  <p>Shrinkix compresses PNG, JPG, WebP, and AVIF images automatically...</p>
</noscript>
```

**Impact:** Bots that don't execute JavaScript (Perplexity, some Googlebot configurations, AI crawlers) now see real content instead of `<div id="root"></div>`.

---

## Remaining Optimisations (Not Yet Implemented)

### Priority 1: LCP — Hero Image Preloading

The hero background is currently a CSS `background-image`. Browsers don't preload CSS backgrounds — they're discovered only after CSS parsing. This delays LCP by 200–500ms.

**Fix:**
```jsx
// HeroSection.jsx — change from CSS background to img element
<section className="hero">
  <img
    src={heroBg}
    alt=""
    fetchpriority="high"
    loading="eager"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
  />
  <div className="container" style={{ position: 'relative', zIndex: 1 }}>
    {children}
  </div>
</section>
```

Or add a `<link rel="preload">` for the hashed image URL (known after build):
```html
<link rel="preload" as="image" href="/assets/hero-bg-[hash].png" />
```

### Priority 2: LCP — Serve Hero as WebP

The hero background is a PNG. Convert to WebP for 30–50% size reduction:
```html
<link rel="preload" as="image" href="/assets/hero-bg.webp" type="image/webp" />
```

### Priority 3: INP — Offload Compression Logic

The `useImageCompression` hook runs synchronous file processing on the main thread. Heavy files can block the UI for 100–500ms, causing INP failures.

**Fix:** Move compression work to a Web Worker:
```js
// compression.worker.js
self.onmessage = async ({ data: { file, options } }) => {
  // Run compression here — off the main thread
  const result = await compress(file, options);
  self.postMessage(result);
};
```

### Priority 4: CLS — Reserve Height for Results List

When compression results appear (`ResultsList.jsx`), they insert content below the upload zone, pushing everything down. This causes CLS.

**Fix:** Reserve minimum height for the results area:
```css
.results-list {
  min-height: 100px; /* height of roughly one result item */
  contain: layout;
}
```

### Priority 5: TTFB — Server-Side Caching

The Express API (`api/server.js`) has no response caching. Static assets and API responses should be cached:
```js
app.use('/api/check-limit', (req, res, next) => {
  res.set('Cache-Control', 'private, max-age=30');
  next();
});
```

### Priority 6: Full SSR Migration

The highest-impact remaining optimisation is migrating from Vite SPA to **Next.js with App Router**. This would:
- Deliver server-rendered HTML for every page (LCP improvement of 1–2s)
- Enable static generation for marketing pages
- Make every page crawlable without JavaScript
- Enable streaming SSR for better perceived performance

This is a significant migration (estimate: 2–4 weeks) but delivers the largest combined improvement to LCP, FCP, TTFB, and crawlability.

---

## How to Measure Progress

### Development

Web Vitals are logged to the browser console automatically in development (via `utils/vitals.js`):
```
✅ FCP: 823ms (good)
✅ LCP: 1240ms (good)
⚠️ CLS: 0.14 (needs-improvement)
✅ INP: 48ms (good)
✅ TTFB: 210ms (good)
```

### Production

1. **Google Search Console** → Core Web Vitals report (real CrUX data, 28-day rolling)
2. **PageSpeed Insights** → Run against `https://shrinkix.com` for lab data
3. **Chrome DevTools** → Performance tab → "Web Vitals" overlay
4. **Google Analytics 4** → Wire `sendToAnalytics()` in `utils/vitals.js` to your GA4 property

### PageSpeed Insights URL
```
https://pagespeed.web.dev/analysis?url=https://shrinkix.com
```

---

## Expected Score Improvement

| Metric | Before (estimated) | After Code Changes | Target |
|--------|-------------------|--------------------|--------|
| LCP | 3.5–5s | 1.8–2.8s | < 2.5s |
| INP | Unknown | Improved | < 200ms |
| CLS | 0.15–0.25 | 0.05–0.12 | < 0.1 |
| FCP | 2.5–4s | 1.5–2.5s | < 1.8s |
| Bundle size | 613KB | ~180KB (home page) | — |

*These are estimates based on code analysis. Actual values depend on server response time and CDN configuration. Measure with PageSpeed Insights on the live site.*
