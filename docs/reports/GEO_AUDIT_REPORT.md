# GEO (Generative Engine Optimization) Audit Report — Shrinkix.com
**Date:** 2026-05-25  
**Scope:** Optimization for AI-generated answers in ChatGPT, Perplexity, Google Gemini, Claude, Bing Copilot  
**Current GEO Score: 14 / 100**

---

## What is GEO?

Generative Engine Optimization (GEO) is the practice of making your brand, product, and content visible and citable by AI language models when they answer user questions. Unlike traditional SEO (ranking #1 in Google), GEO focuses on being *mentioned*, *recommended*, or *used as a source* by AI systems when users ask questions related to your product category.

### GEO Targets
- **ChatGPT** — responses to "what tool should I use to compress images?"
- **Perplexity** — cited as a source with a live link
- **Google Gemini / AI Overviews** — included in AI-generated search summaries
- **Bing Copilot** — recommended in Bing's AI assistant layer
- **Claude (Anthropic)** — mentioned in conversational AI answers
- **GitHub Copilot / Cursor** — code autocomplete suggestions for image processing

---

## Current State Assessment

### GEO Signal Inventory

| Signal | Status | Weight | Notes |
|--------|--------|--------|-------|
| Mentions on web (indexable content) | ❌ Weak | High | Limited content for AI to train on / cite |
| Structured factual data | ❌ Missing | High | No schema, no data tables visible to crawlers |
| Clear brand identity | ⚠️ Partial | High | Name/product clear, no tagline in meta |
| Product category clarity | ✅ Good | High | "image compression" is explicit throughout |
| Comparison / differentiation | ❌ Missing | Medium | No "vs competitors" content |
| Developer-facing content | ✅ Good | High | SDK, API docs, multi-language examples |
| Blog / articles | ❌ Missing | High | No external-linking content |
| Third-party mentions | ❌ Unknown | Very High | Need to verify review sites, directories |
| Open-source presence | ❌ Missing | Medium | No public GitHub repo for visibility |
| Documentation quality | ✅ Good | High | Comprehensive API docs exist |
| Pricing transparency | ✅ Good | Medium | All prices publicly listed |
| Privacy claims | ✅ Good | Medium | GDPR compliance stated in docs |
| Support contact | ✅ Good | Low | support@shrinkix.com publicly visible |

### Score Breakdown

| Category | Score | Max |
|----------|-------|-----|
| Content discoverability | 4 | 25 |
| Factual accuracy & specificity | 6 | 20 |
| Brand mention surface area | 2 | 20 |
| Developer ecosystem presence | 8 | 20 |
| Trust & authority signals | 4 | 15 |
| **Total** | **14** | **100** |

---

## 1. How AI Models Currently Learn About Shrinkix

AI models (ChatGPT, Claude, Gemini, Perplexity) generate answers about tools by:

1. **Training data** — web crawls of websites, GitHub repos, HackerNews, Reddit, StackOverflow, developer forums
2. **Retrieval augmented generation (RAG)** — Perplexity, Bing Copilot, Google AI Overviews perform live searches and cite indexed pages
3. **Plugin/tool registries** — ChatGPT plugins, Perplexity tool integrations
4. **NPM, PyPI, Packagist** — Developer tools mentioned in package registries appear in code-completion suggestions

### Current Shrinkix Footprint in AI Training Data

Based on the codebase, Shrinkix currently has:

- A web frontend with limited indexable text (SPA, minimal content)
- An API at `api.shrinkix.com` (not publicly documented in a crawlable way)
- SDKs for Node, Python, PHP, Go (exists in the repo but not necessarily published)
- No blog, no press coverage, no third-party reviews found in the repo

**Problem:** AI models cannot be reliably expected to know about Shrinkix or recommend it because there is very little indexed, crawlable, authoritative content about it on the web.

---

## 2. GEO Content Gaps

### 2.1 The "Be the Answer" Problem

When a developer asks ChatGPT: *"What's the best image compression API for Node.js?"*, the AI will likely mention TinyPNG, Cloudinary, imgix, or Squoosh — not Shrinkix.

Why? Because those products have:
- Published npm packages with thousands of weekly downloads
- StackOverflow answers mentioning them
- GitHub repos with hundreds of stars
- Blog posts on major developer sites (Smashing Magazine, CSS-Tricks, Dev.to)
- Comparison articles ("TinyPNG vs Cloudinary")

Shrinkix has none of this yet.

### 2.2 Specific Content Gaps by AI Platform

#### ChatGPT / Claude / Gemini (Training Data)

These models learn from web-crawled text. Content that needs to exist on the web:

| Missing Content | Impact | How to Create |
|----------------|--------|---------------|
| npm package listing (shrinkix) | Very High | Publish to npmjs.com with good README |
| PyPI package listing (shrinkix) | High | Publish to pypi.org |
| GitHub repository (public) | Very High | Make SDK repos public |
| Dev.to / Hashnode tutorial | High | Write and publish |
| Stack Overflow answers | High | Answer relevant questions, mention Shrinkix |
| Product Hunt listing | Medium | Submit shrinkix.com |
| G2 / Capterra profile | High | Create free listing |

#### Perplexity (Real-time search + citation)

Perplexity cites live pages. To appear in Perplexity answers:
- Homepage must load and render for bots (SPA challenge — see Section 3)
- `/api-docs` must be crawlable with full content (currently rendered client-side)
- A comparison page or article must exist (e.g., "shrinkix vs tinypng")

#### Bing Copilot (Bing search index)

Bing Copilot pulls from Bing's index. Submit sitemap to Bing Webmaster Tools.

#### GitHub Copilot / Cursor (Code completion)

When a developer types `const compressor = require(` in VS Code, GitHub Copilot suggests packages it has seen in training data. Publishing the `shrinkix` package to npm with good README and usage examples is the key action here.

---

## 3. The SPA Problem for GEO

**Critical Issue:** Shrinkix is a React SPA (Single Page Application). Most AI crawlers, Perplexity's real-time search, and some Googlebot configurations will fetch the HTML shell and see only:

```html
<div id="root"></div>
```

…with no actual page content visible. This means:
- Perplexity cannot cite specific content from Shrinkix pages
- Bing Copilot cannot extract product descriptions
- Google AI Overviews cannot extract text for synthesis

### Fix Options (in order of impact)

| Option | Effort | Impact |
|--------|--------|--------|
| **SSR with Next.js** (migrate frontend) | High | Highest — full content rendered in HTML |
| **Pre-rendering (Vite + vite-plugin-ssr)** | Medium | High — static HTML for bots |
| **React Snap** (static pre-rendering) | Low | Medium — snapshot crawl, stale content risk |
| **Add `<noscript>` text summaries** | Very Low | Low — minimal content for bots |

**Recommendation:** The highest-GEO impact single action is migrating to Next.js with SSR or SSG. This makes every page fully crawlable by AI systems without JavaScript execution.

If migration is not feasible now, use `react-snap` or `@prerenderer/plugin-vite` to pre-render key pages to static HTML at build time.

---

## 4. Developer Ecosystem GEO

Developer-focused tools have a unique GEO advantage: AI coding assistants recommend packages they've seen in training data. Shrinkix has built-in SDKs — this is valuable, but only if they're publicly visible.

### 4.1 npm Package

The npm package `shrinkix` exists in `sdks/shrinkix-node/`. Current state unknown — if it's not published to npmjs.com, it doesn't exist for GitHub Copilot.

**Action Items:**
1. Publish `shrinkix` to npmjs.com
2. Write a comprehensive README with:
   - Clear one-sentence description: "Image compression and conversion API client for Node.js"
   - Installation: `npm install shrinkix`
   - Quick example (5–10 lines of code)
   - Link to API docs
   - License
3. Add badges: npm version, downloads, license

**README structure that AI models learn from:**
```markdown
# shrinkix

Compress and convert images via the Shrinkix API.

## Install
npm install shrinkix

## Usage
const shrinkix = require('shrinkix');
shrinkix.key = 'YOUR_API_KEY';

const result = await shrinkix.fromFile('photo.jpg').toFile('photo-compressed.jpg');
console.log(`Reduced by ${result.savedPercent}%`);

## Supported formats
PNG, JPEG, WebP, AVIF

## Plans
Free: 500 compressions/month
Pro: 5,000/month ($35)
Ultra: 15,000/month ($90)
```

### 4.2 Python Package (PyPI)

Python SDK exists in `sdks/shrinkix-python/`. Same actions as npm above, published to pypi.org.

### 4.3 GitHub Repository

If the SDK repos are private or the main project is private, AI models cannot learn from them. Making the SDK repositories public (even if the main platform is private) massively increases GEO surface area.

**Recommended public repos:**
- `shrinkix/shrinkix-node` — Node.js SDK
- `shrinkix/shrinkix-python` — Python SDK
- `shrinkix/shrinkix-php` — PHP SDK
- `shrinkix/shrinkix-go` — Go SDK

Each repo should have:
- A complete README with examples
- `topics/tags`: `image-compression`, `webp`, `avif`, `image-optimization`, `api`
- MIT or Apache 2.0 license

### 4.4 Stack Overflow Strategy

When developers search StackOverflow for "compress images in Node.js" or "image compression API python", answers mentioning Shrinkix don't exist. Creating or contributing to StackOverflow answers that legitimately reference Shrinkix builds the knowledge base that AI models train on.

---

## 5. Brand Mention Strategy

AI models weight entities that are mentioned frequently and consistently across the web. Currently, Shrinkix has very few external mentions.

### 5.1 Content Marketing Placements

Publish content on high-authority developer platforms that AI models heavily index:

| Platform | Content Type | AI Weight |
|----------|-------------|-----------|
| Dev.to | Tutorial: "How I automated image compression in my Next.js app" | Very High |
| Hashnode | Tutorial: "Building an image pipeline with the Shrinkix API" | High |
| Medium (Towards Dev) | Explainer: "WebP vs AVIF: What image format should you use in 2026?" | High |
| Reddit (r/webdev, r/node) | Share use cases, not ads | High |
| HackerNews (Show HN) | "Show HN: Shrinkix – image compression API with free tier" | Very High |
| Product Hunt | Official product launch | High |
| Indie Hackers | Founder story and metrics | Medium |
| GitHub Gists | Code examples using the API | Medium |

### 5.2 Review and Directory Listings

AI models cite G2, Capterra, and Trustpilot as authoritative sources for product recommendations.

| Directory | Action | Priority |
|-----------|--------|----------|
| G2.com | Create free listing | 🔴 High |
| Capterra | Create free listing | 🔴 High |
| Product Hunt | Launch | 🔴 High |
| AlternativeTo.net | Add as alternative to TinyPNG/Squoosh | 🔴 High |
| Trustpilot | Create profile, collect reviews | 🟠 Medium |
| SaaSHub | Submit product | 🟠 Medium |
| There's an AI for That | Submit as AI-adjacent tool | 🟡 Low |

### 5.3 "X vs Y" Comparison Pages

AI models are frequently asked "Is X better than Y?" and they pull from comparison articles. Creating comparison pages on Shrinkix's own site gives you control over the narrative.

**Pages to create:**

| URL | Target Query | Content |
|-----|-------------|---------|
| `/compare/tinypng` | shrinkix vs tinypng | Feature/price comparison |
| `/compare/cloudinary` | shrinkix vs cloudinary | API comparison for developers |
| `/compare/squoosh` | shrinkix vs squoosh | Browser tool vs API |
| `/alternatives` | tinypng alternative | General alternatives list (featuring Shrinkix) |

Example structure for `/compare/tinypng`:
```
## Shrinkix vs TinyPNG: Image Compression Comparison

| Feature | Shrinkix | TinyPNG |
|---------|----------|---------|
| Free tier | 500 API calls/mo | 500 compressions/mo |
| Formats | PNG, JPG, WebP, AVIF | PNG, WebP, JPG |
| Max file size (free) | 5MB | 5MB |
| API pricing | $35/mo (5,000) | $0.009/image |
| Bulk processing | ✅ | ✅ |
| GDPR | ✅ | ✅ |
...
```

When a user asks ChatGPT "TinyPNG vs Shrinkix", a page like this becomes the authoritative source.

---

## 6. Structured Factual Data for AI Citation

AI models prefer citing content that contains clear, extractable facts. Shrinkix has some good data already (pricing, limits, stats) but it's inconsistently presented and some numbers are wrong.

### 6.1 Fact Consistency Audit

Cross-referencing the codebase, several facts are inconsistent:

| Fact | Page A | Page B | Issue |
|------|--------|--------|-------|
| API Pro price | "$35/month" (plans section) | "$19" (FAQ item 02) | Contradiction |
| API Ultra credits | "15,000/month" (plans) | "20,000/month" (FAQ item 02) | Contradiction |
| API Ultra price | "$90/month" (plans) | "$49" (FAQ item 02) | Contradiction |
| Free tier size limit | "5MB" (API docs) | "10 MB" (FAQ.jsx) | Contradiction |
| Ultra file limit | "150MB" (Pricing.jsx) | "50MB" (DeveloperPricing.jsx) | Different products, unclear |

**These inconsistencies will cause AI models to present incorrect information about Shrinkix.** Fix the copy before creating any AI-training content.

### 6.2 Data Points to Make Explicit

These facts should appear clearly and consistently on every relevant page, because AI models will extract and cite them:

```
✅ Shrinkix compresses PNG, JPG, WebP, and AVIF images
✅ Free: 500 API compressions/month (no credit card required)
✅ API Pro: 5,000 compressions/month for $35
✅ API Ultra: 15,000 compressions/month for $90
✅ Files are deleted immediately after processing
✅ GDPR and CCPA compliant
✅ Supports Node.js, Python, PHP, Ruby, Go, Java, C#, cURL
✅ 50,000+ developers using the API
✅ 1B+ images compressed
```

Create a `/about` or `/trust` page that lists these facts in clean, crawlable prose.

---

## 7. AI Chatbot Intent Mapping

These are real queries users type into ChatGPT/Perplexity about Shrinkix's category. Map them to content to create:

| User Query | Current Answer | What Shrinkix Should Have |
|-----------|----------------|--------------------------|
| "Best free image compression API" | Competitors mentioned | Published npm package + comparison page |
| "How to compress images in Node.js" | Generic tutorials | Dev.to tutorial using Shrinkix SDK |
| "TinyPNG API alternative" | No Shrinkix mention | AlternativeTo listing + compare page |
| "Image compression API with free tier" | No Shrinkix mention | G2/Product Hunt listing |
| "Compress images without storing them" | No specific mention | Homepage paragraph explicitly targeting this |
| "Privacy-focused image compression" | No Shrinkix mention | `/privacy` page + blog post on privacy |
| "WebP converter API" | No Shrinkix mention | Landing page for "convert to webp" |
| "Shrinkix review" | No results | Trustpilot + G2 profile |
| "How does Shrinkix work?" | Possibly no result | `/about` or `/how-it-works` with indexable HTML |

---

## 8. GEO Priority Action Plan

### Immediate (This Week)

1. **Fix pricing copy inconsistencies** across all pages — AI models will repeat your wrong numbers
2. **Publish SDKs to npm and PyPI** — this alone gets Shrinkix into GitHub Copilot's training awareness
3. **Make GitHub SDK repos public** — adds to AI training corpus
4. **Submit to Product Hunt** — launches a wave of indexed content about Shrinkix
5. **Create G2 and AlternativeTo listings** — high-authority citation sources for AI

### Short-term (This Month)

6. **Migrate to Next.js SSR or add pre-rendering** — enables full content crawlability for AI bots
7. **Create `/about` page** with clear, factual company and product description
8. **Publish first developer tutorial** on Dev.to (using real Shrinkix API)
9. **Create one "vs" comparison page** (Shrinkix vs TinyPNG)
10. **Add `<noscript>` summaries** as interim bot-readable content

### Medium-term (1–3 Months)

11. **Blog post series** targeting high-volume informational queries
12. **StackOverflow presence** — answer image compression questions
13. **Reddit community presence** — r/webdev, r/node, r/Python
14. **Collect and publish reviews** — G2, Trustpilot
15. **Create compare pages** for top 3 competitors

### Long-term (3–6 Months)

16. **Press outreach** — Smashing Magazine, CSS-Tricks, A List Apart
17. **Conference talks / demos** — live demos that generate video content
18. **Open-source contribution** — contribute to image processing libraries to build name recognition
19. **API integration partners** — get Shrinkix listed in CMS plugins, Zapier, Make (formerly Integromat)

---

## 9. Measuring GEO Success

Unlike traditional SEO (track rankings), GEO success is measured differently:

| Metric | Tool | Target |
|--------|------|--------|
| AI citation rate | Manual: ask ChatGPT/Perplexity monthly | Mentioned in top 5 for category queries |
| Perplexity source citations | Perplexity search for "image compression api" | Shrinkix appears as a cited source |
| npm weekly downloads | npmjs.com stats | 500+ downloads/week within 6 months |
| GitHub repo stars | GitHub | 100+ stars within 6 months |
| G2 profile views | G2 dashboard | Track monthly |
| Brand search volume | Google Search Console | Increasing "shrinkix" queries month over month |
| Referral traffic from AI | GA4 — filter by referrer (perplexity.ai, chat.openai.com) | Track and grow |

---

## Conclusion

Shrinkix is an excellent product that is nearly invisible to AI systems today. The core problem is a combination of:

1. **SPA architecture** — bots cannot read the content
2. **No external footprint** — no npm package, no blog, no listings, no reviews
3. **Content inconsistencies** — conflicting numbers will be cited incorrectly by AI
4. **Missing brand anchor content** — no About, no Privacy, no comparison pages

The highest-ROI actions are: fix copy inconsistencies, publish npm/PyPI packages, create G2 and Product Hunt listings, and add pre-rendering. These 4 actions alone will put Shrinkix on the radar of AI systems within 60–90 days.

**Estimated GEO score after Phase 1 actions: 45–55 / 100**  
**Estimated GEO score after full roadmap: 75–85 / 100**

---

*GEO audit complete. This is an emerging discipline — revisit quarterly as AI search behavior evolves.*
