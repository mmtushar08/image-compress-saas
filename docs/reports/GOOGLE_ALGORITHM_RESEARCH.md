# Google Algorithm Research — Shrinkix.com
**Date:** 2026-05-25  
**Scope:** All major Google ranking systems and how they affect Shrinkix

---

## Overview: How Google Ranks Pages in 2026

Google uses hundreds of signals but a small set of core systems determine most outcomes. For a SaaS tool like Shrinkix, the five most important systems are:

1. **Core Web Vitals / Page Experience** — speed and stability
2. **Helpful Content System** — content quality and depth
3. **E-E-A-T** — trust and authority
4. **RankBrain / Neural Matching** — query intent understanding
5. **Link Analysis (PageRank)** — authority from external sites

---

## 1. Core Web Vitals (Page Experience System)

### Current Metrics (as of 2024+)

| Metric | What It Measures | Good | Needs Work | Poor |
|--------|-----------------|------|------------|------|
| **LCP** — Largest Contentful Paint | How fast the main content loads | < 2.5s | 2.5–4.0s | > 4.0s |
| **INP** — Interaction to Next Paint | How fast the page responds to input | < 200ms | 200–500ms | > 500ms |
| **CLS** — Cumulative Layout Shift | Visual stability (do elements jump?) | < 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** — First Contentful Paint | When first text/image appears | < 1.8s | 1.8–3.0s | > 3.0s |
| **TTFB** — Time to First Byte | Server response time | < 800ms | 800ms–1.8s | > 1.8s |

> **Important:** INP replaced FID (First Input Delay) as a Core Web Vitals metric in March 2024. INP measures the worst-case interaction delay over the entire page session, not just the first.

### Shrinkix Baseline Issues (Pre-fix)

| Metric | Estimated Problem | Root Cause |
|--------|------------------|------------|
| LCP | Likely 3–5s | 613KB monolithic JS bundle blocked rendering |
| INP | Unknown | Heavy GSAP + React hydration on main thread |
| CLS | Moderate risk | No explicit dimensions on hero section, dynamic content insertion |
| FCP | Moderate | Large bundle delays first paint |
| TTFB | Depends on server | Express.js API response time (not measured) |

### What We Fixed

| Fix | Impact | Metric Improved |
|-----|--------|----------------|
| Vite `manualChunks` code splitting | JS split from 1 chunk to 5+ | LCP, FCP |
| React.lazy() for 15 routes | Home page JS reduced ~60% | LCP, FCP |
| `contain: layout style` on hero/cards | Reduces paint work | CLS, INP |
| `will-change: transform` on upload zone | GPU compositing for animation | INP |
| `min-height` on hero section | Prevents layout jump on load | CLS |
| Inline critical CSS in index.html | Eliminates render-blocking CSS | FCP |
| `<noscript>` bot-readable content | Not a vitals fix, but helps crawl | Crawlability |

### Remaining Recommendations (Not Yet Implemented)

| Recommendation | Effort | Metric |
|----------------|--------|--------|
| Migrate to Next.js with SSR | High | LCP, FCP, TTFB |
| Move hero bg from CSS to `<img fetchpriority="high">` | Low | LCP |
| Add `loading="lazy"` to below-fold sections | Low | LCP |
| Serve images in WebP/AVIF format | Medium | LCP |
| Use HTTP/2 push or `<link rel="preload">` for critical chunks | Low | FCP |
| Implement server-side caching (Redis/CDN) | Medium | TTFB |
| Use `scheduler.postTask()` for heavy compression logic | High | INP |

---

## 2. Helpful Content System

### What It Is

The Helpful Content System was a standalone algorithm update from August 2022 through early 2024. In March 2024 it was folded into Google's core ranking systems — meaning it now runs continuously, not as periodic updates.

The system uses a site-wide signal: if a significant portion of a site's content is deemed "unhelpful," all pages on that site can rank lower — even good pages.

### What Google Considers "Helpful"

- Content written **for people**, not for search engines
- Content where the author has **first-hand experience** with the topic
- Content that **fully satisfies** the user's query — they don't need to go back to Google
- Content with a **clear purpose and audience**
- Content that demonstrates **E-E-A-T** (see Section 3)

### What Google Penalises

- Thin content (pages with fewer than ~300 meaningful words)
- AI-generated content without human review or added value
- Pages that exist only to rank for a keyword, not to help users
- Content that makes claims without evidence or sources

### Shrinkix Assessment

| Page | Content Depth | Helpful Content Risk |
|------|--------------|---------------------|
| `/` (Home) | Medium | Low — product content is genuine and useful |
| `/pricing` | Low | Medium — very thin, few words of real content |
| `/developers` | Medium | Low |
| `/api-docs` | High | Very Low — comprehensive documentation |
| `/about` (new) | Good | Low — factual, specific |
| `/privacy` (new) | Good | Low |
| Blog (missing) | N/A | **High risk from absence** — no long-form content |

### Fix: Thin Content Pages

**`/pricing` has ~50 words of content.** Google may not rank a pricing page that competes with deeper pages from competitors. Add:
- A "Why Shrinkix?" value proposition paragraph (100 words)
- A brief FAQ section (already have one for developers, add one here)
- A comparison table vs. manual tools or competitors

---

## 3. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

E-E-A-T is not a direct ranking signal — it's the framework Google's Search Quality Evaluators use to assess content quality. But the signals that support E-E-A-T **are** measured algorithmically.

### E-E-A-T Signals and Shrinkix Status

| Signal | Shrinkix Status | Fix |
|--------|----------------|-----|
| **Experience** — first-hand use | ✅ Implied (the tool works) | Add case studies, real compression stats |
| **Expertise** — technical accuracy | ✅ API docs are detailed | Add author attribution to technical content |
| **Authoritativeness** — external mentions | ❌ Few external links | Get listed on G2, Product Hunt, npm |
| **Trustworthiness** — site signals | ⚠️ Partial | HTTPS ✅, Privacy policy ✅ (new), About ✅ (new), Terms ❌ |

### Trustworthiness Checklist

| Signal | Status |
|--------|--------|
| HTTPS | ✅ |
| Privacy Policy | ✅ (added) |
| Contact information | ✅ (email visible) |
| About page | ✅ (added) |
| Terms of Service | ❌ Missing |
| Physical address (for YMYL sites) | N/A |
| Author bylines | ❌ No blog yet |
| External reviews (G2, Trustpilot) | ❌ Missing |

---

## 4. RankBrain and Neural Matching

### What It Is

RankBrain (2015) and Neural Matching (2018) are Google's AI systems for understanding query intent — the "why" behind a search, not just the keywords.

### How It Affects Shrinkix

These systems mean Shrinkix can rank for **semantically related queries** it doesn't explicitly mention, if the page clearly satisfies the intent. For example:

- A page optimised for "compress images online" may also rank for "reduce image file size" and "make images smaller for website" — because the intent is the same.

### What We Already Do Well

- Clear, direct product descriptions ("compress PNG, JPG, WebP, AVIF")
- Action-oriented headings ("Upload your images", "Download optimized files")
- Real use-case scenarios in "Who It's For" section

### What We Should Add

| Missing Intent Coverage | Where to Add |
|------------------------|-------------|
| "convert jpg to webp online" | Add explicit conversion copy to homepage |
| "reduce image size without losing quality" | Add to Problem section |
| "image optimizer for web developers" | Strengthen Developers page |
| "bulk image compressor" | Add to FeaturesSection card |

---

## 5. Link Analysis (PageRank and Link Spam)

### Current Status

Shrinkix almost certainly has **very few external backlinks** — a brand-new SaaS with no blog, no press coverage, and no public npm package.

PageRank still matters. Without external links, Shrinkix will struggle to rank for competitive head terms like "image compressor" or "compress image online" — those SERP positions are dominated by sites with thousands of backlinks (TinyPNG, Squoosh, Cloudinary).

### Link-Building Strategy for Shrinkix

| Tactic | Domain Authority of Source | Effort |
|--------|---------------------------|--------|
| Publish npm package (shrinkix) | npmjs.com — DA 90+ | Low |
| Product Hunt launch | producthunt.com — DA 90+ | Low |
| G2 listing | g2.com — DA 90+ | Low |
| Dev.to article | dev.to — DA 80+ | Medium |
| CSS-Tricks / Smashing Magazine guest post | DA 80–90 | High |
| StackOverflow answers | stackoverflow.com — DA 95+ | Medium |
| GitHub repo (with README links back to site) | github.com — DA 95+ | Low |
| Indie Hackers listing | indiehackers.com — DA 80 | Low |

### Link Spam Update

Google's Link Spam updates (2021, 2022, ongoing) devalue low-quality link building:
- **Avoid:** paid links, link farms, reciprocal link schemes
- **Focus on:** editorial links from real developer communities, product directories, and content that earns links naturally

---

## 6. AI Overviews (Search Generative Experience)

### Current State (2025–2026)

Google AI Overviews appear above all organic results for an estimated 30–40% of queries. They synthesize answers from multiple sources. Being cited in an AI Overview is often more valuable than ranking #1 organically.

### How AI Overviews Decide What to Cite

1. **High E-E-A-T signals** — trustworthy, authoritative sources
2. **Clear, extractable answers** — short paragraphs with direct answers
3. **FAQPage schema** — explicitly marked Q&A content
4. **Factual specificity** — pages with numbers, data, comparisons
5. **Freshness** — recently updated content preferred

### Shrinkix AI Overview Opportunities

| Query | AI Overview Likelihood | Our Readiness |
|-------|----------------------|---------------|
| "how to compress images for website" | High | ✅ HowTo schema added |
| "what is image compression?" | High | ✅ Definition added to Problem.jsx |
| "best image compression api" | Medium | ❌ No external mentions |
| "webp vs jpeg" | High | ❌ No comparison content |
| "does image optimization affect seo?" | High | ✅ FAQ answer added |

---

## 7. Google Algorithm Update Calendar (Major Updates Relevant to Shrinkix)

| Date | Update | Impact on Shrinkix |
|------|--------|-------------------|
| Mar 2024 | INP replaces FID in Core Web Vitals | Must optimise interaction responsiveness |
| Mar 2024 | Helpful Content folded into core | Thin content pages at ongoing risk |
| Aug 2023 | Core Update (quality focus) | E-E-A-T signals matter more |
| Oct 2023 | Link Spam Update | Low-quality links devalued |
| Nov 2023 | Core Update (helpful content emphasis) | Thin SaaS pages may be demoted |
| 2025 | AI Overviews expansion | GEO becomes equal to SEO in importance |

---

## 8. Monitoring Recommendations

Set up these free tools immediately:

| Tool | What to Monitor | Frequency |
|------|----------------|-----------|
| **Google Search Console** | Impressions, clicks, CTR, average position | Weekly |
| **Google PageSpeed Insights** | LCP, INP, CLS scores per page | Monthly |
| **Chrome UX Report (CrUX)** | Real-user Core Web Vitals data | Monthly |
| **web-vitals JS library** | Real-user vitals in production | Ongoing (implemented ✅) |
| **Google Rich Results Test** | Schema markup validation | After any schema changes |
| **Bing Webmaster Tools** | Bing index coverage | Monthly |

---

## Summary: Algorithm Risk Matrix for Shrinkix

| Risk | Severity | Probability | Status |
|------|----------|-------------|--------|
| Low Core Web Vitals score | High | Medium | ⚠️ Partially fixed |
| Thin content penalty | Medium | High | ⚠️ /pricing still thin |
| No external authority | High | High | ❌ Not fixed (requires off-site work) |
| Missing E-E-A-T trust signals | Medium | High | ✅ About + Privacy added |
| SPA crawlability | High | High | ❌ Not fixed (needs SSR) |
| No AI Overview presence | High | High | ⚠️ Schema added, content improving |

*Revisit this document quarterly as Google releases core updates.*
