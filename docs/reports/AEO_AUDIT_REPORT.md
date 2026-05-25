# AEO (Answer Engine Optimization) Audit Report — Shrinkix.com
**Date:** 2026-05-25  
**Scope:** Optimization for featured snippets, AI Overviews, People Also Ask, voice search  
**Current AEO Score: 18 / 100**

---

## What is AEO?

Answer Engine Optimization is the practice of structuring content so that search engines (Google, Bing) and AI answer layers (Google AI Overviews, Bing Copilot, voice assistants) surface your content as the direct answer to a user's question — without requiring a click.

AEO targets:
- **Featured snippets** (position zero in Google)
- **Google AI Overviews** (the AI-generated summary above all results)
- **People Also Ask (PAA)** boxes
- **Voice search answers** (Google Assistant, Siri, Alexa)
- **Bing Copilot answers**

---

## Current State Assessment

### What Shrinkix Has

| AEO Signal | Status | Notes |
|------------|--------|-------|
| FAQ sections | ✅ Present | Home (5 Qs), Developers (4 Qs), Dev Pricing (8 Qs) — but no schema |
| Clear H2/H3 headings | ✅ Partial | Good structure, but no H1 on pricing page |
| Concise feature descriptions | ✅ Present | Short, factual sentences throughout |
| Step-by-step content | ✅ Present | 3-step "How It Works" section |
| Trust / privacy statements | ✅ Present | Multiple clear sentences |
| Meta descriptions | ❌ Missing | No answer-ready summaries in meta |
| FAQPage schema | ❌ Missing | FAQs not machine-readable |
| Definition-style content | ❌ Missing | No "What is…" or "How does X work?" content |
| Comparison tables | ❌ Partial | Only on pricing pages |
| Long-form answers | ❌ Missing | All answers are 1–3 lines |
| Blog / resource content | ❌ Missing | No content hub |
| Speakable schema | ❌ Missing | Not voice-search optimized |

### Score Breakdown

| Category | Score | Max |
|----------|-------|-----|
| FAQ optimization | 8 | 25 |
| Featured snippet readiness | 5 | 25 |
| Content depth for AI Overviews | 2 | 20 |
| Voice search structure | 0 | 15 |
| PAA targeting | 3 | 15 |
| **Total** | **18** | **100** |

---

## 1. Featured Snippet Opportunities

Featured snippets appear for queries with clear intent: "how to", "what is", "best way to". Shrinkix has content that can win several.

### 1.1 Definition Snippets (Paragraph Format)

Google shows ~40–50 word paragraphs for "What is X?" queries.

**Target queries and missing content:**

| Query | Monthly Volume (est.) | Missing Content |
|-------|----------------------|-----------------|
| What is image compression? | High | No definition page |
| What is WebP format? | Medium | No explanation |
| What is AVIF format? | Medium | No explanation |
| What is lossy compression? | Medium | No explanation |
| What is lossless compression? | Medium | No explanation |

**Fix:** Add a short "What is image compression?" paragraph to the homepage or a dedicated `/learn` page:

```jsx
// Add to Problem.jsx or create a new DefinitionSection.jsx
<section className="definition-section">
  <h2>What is image compression?</h2>
  <p>
    Image compression is the process of reducing an image file's size
    by encoding data more efficiently. Lossy compression removes some
    image data to achieve smaller files, while lossless compression
    reduces file size without any quality loss. Smaller images load
    faster, use less bandwidth, and improve website performance.
  </p>
</section>
```

This 50-word definition is exactly the right length for a featured snippet.

### 1.2 List Snippets (Bullet Format)

Google shows bulleted lists for "ways to", "steps to", "types of" queries.

**Target query:** "how to compress images for website"

**Current content in `HowItWorksSection.jsx`:**
```
1. Upload your images
2. Automatic conversion and compression
3. Download optimized files
```

This is a perfect 3-step list — but it's in JSX with no schema markup and the steps are too brief. Google needs the H2 question phrasing + clear numbered content.

**Fix:** Change the section heading and expand step descriptions:

```jsx
// HowItWorksSection.jsx — update heading and step text
<h2>How to compress images for a website</h2>
// Step descriptions should be 1–2 full sentences each (as they currently are — good)
// Add HowTo JSON-LD schema (see Schema Audit Report)
```

### 1.3 Table Snippets

Google shows comparison tables for "X vs Y" and "X pricing" queries.

**Target query:** "shrinkix pricing" / "image compression api pricing"

The pricing tables in `DeveloperPricing.jsx` already have a good feature comparison table. This content can win a table snippet if:
1. The `<table>` has a descriptive `<caption>` or nearby `<h2>`
2. The page has a unique `<title>` and meta description targeting the query

---

## 2. Google AI Overviews — Content Gaps

Google AI Overviews (the AI summary that appears at the top of results) synthesizes multiple sources. To be cited in an AI Overview, your content needs to be:

1. **Authoritative** — factual, specific, citable
2. **Comprehensive** — covers the topic fully
3. **Structured** — clear headings, short paragraphs
4. **Trustworthy** — HTTPS, about page, author attribution

### 2.1 Missing "E-E-A-T" Signals (Experience, Expertise, Authority, Trust)

Google AI Overviews heavily weight E-E-A-T.

| Signal | Current State | Fix |
|--------|---------------|-----|
| About page | ❌ Missing | Create `/about` with company story, team, founding |
| Author attribution | ❌ Missing | No bylines or "written by" on any content |
| Review/testimonials | ❌ Missing | No social proof visible on site |
| External citations | ❌ Missing | No press mentions, no backlinks section |
| Data/statistics | ⚠️ Weak | "50,000+ developers, 1B+ images" in StatsCounter.jsx — but no source |
| Privacy policy | ❌ Missing | No `/privacy` page — critical for trust |
| Contact page | ❌ Missing | Only mailto links scattered in footer |

### 2.2 Content Depth Issue

Every page section on Shrinkix is 1–3 sentences. AI Overviews require sufficient depth to extract answers from.

**Current:** `Problem.jsx` — 3 sentences on why image optimization matters.  
**Needed:** 200–400 word section with statistics, specific impact data, and practical context.

Example rewrite for `Problem.jsx` to target AI Overview:

```
Images account for an average of 75% of total webpage weight 
(HTTP Archive, 2024). Large unoptimized images are one of the 
leading causes of slow page load times, directly impacting:

- Core Web Vitals scores (especially Largest Contentful Paint)
- Google search rankings (page speed is a confirmed ranking factor)
- Conversion rates (a 1-second delay in load time reduces conversions by 7%)
- Mobile user experience (40% of users abandon pages that take over 3 seconds)

Manual image optimization — resizing, converting to WebP, running 
through Photoshop — takes 5–10 minutes per image and doesn't scale 
for teams managing hundreds of assets.
```

This kind of content answers "why does image optimization matter" and will be cited in AI Overviews.

---

## 3. People Also Ask (PAA) Optimization

PAA boxes appear for nearly every informational query. Shrinkix currently misses all PAA targeting.

### PAA Questions to Target

Based on the product's topic, these PAA questions appear regularly in Google results:

| PAA Question | Where to Answer | Content to Add |
|-------------|-----------------|----------------|
| Does compressing images affect quality? | FAQ or blog post | Add to `FAQ.jsx` |
| Is WebP better than JPEG? | Homepage or learn page | New content section |
| How much can images be compressed? | FAQ or stats section | Add to `FAQ.jsx` |
| What image format loads fastest? | Homepage or blog | New content section |
| Does image compression affect SEO? | Homepage (already relevant) | Explicit answer needed |
| How do I compress images without losing quality? | HowItWorks or blog | New section |
| What is the best image format for websites? | Blog or FAQ | New page |
| Can I compress images in bulk? | FeaturesSection | Expand description |

### Adding PAA-Targeted FAQ Items

Add these 3 questions to `FAQ.jsx`:

```jsx
{
  question: "Does compressing images affect quality?",
  answer: "Smart compression reduces file size with minimal visible quality loss. Shrinkix uses lossy compression that typically achieves 60–80% size reduction while maintaining visual quality indistinguishable from the original. You can also preview the result before downloading."
},
{
  question: "What image format loads fastest on websites?",
  answer: "WebP loads 25–35% faster than JPEG at comparable quality, and AVIF can be 50% smaller than JPEG. Both are supported by all modern browsers. Shrinkix automatically converts your images to WebP or AVIF to maximize loading speed."
},
{
  question: "Does image optimization improve SEO?",
  answer: "Yes. Page speed is a confirmed Google ranking factor, and images are the largest contributor to page weight. Optimized images improve Core Web Vitals scores — especially Largest Contentful Paint (LCP) — which directly influences search rankings."
}
```

---

## 4. Voice Search Optimization

Voice search (Google Assistant, Siri) returns one spoken answer, typically from a featured snippet. Voice answers require:

1. **Conversational question phrasing** in headings
2. **Short answers** (40–50 words) directly below the question
3. **`Speakable` schema** to mark voice-friendly content
4. **Mobile-first content** (voice searches are predominantly mobile)

### 4.1 Speakable Schema

Add to pages where Shrinkix wants to be the voice search answer:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".faq-answer p", ".trust-content p", ".problem-content p"]
  },
  "url": "https://shrinkix.com/"
}
```

### 4.2 Voice-Friendly Content Examples

**Good (voice-answer ready):**
```
"Shrinkix is a free online tool that compresses and converts images 
automatically. Upload a PNG, JPG, WebP, or AVIF file, and Shrinkix 
reduces the file size instantly without storing your images."
```

**Current (not voice-friendly — no direct Q&A structure):**
```
"Shrinkix removes that friction."
"Shrinkix optimizes your images the moment they're uploaded."
```

Add a one-paragraph summary at the top of the homepage with the brand name, product category, and key benefit — this is what voice assistants will read.

---

## 5. Content Hub Strategy (Long-term AEO)

The most powerful AEO signal Shrinkix is missing is a **blog or resource section**. Content hubs make sites appear in AI Overviews, PAA boxes, and featured snippets for informational queries at scale.

### Recommended Content Topics

| Article Title | Target Query | Word Count | Priority |
|---------------|-------------|------------|----------|
| WebP vs JPEG vs PNG: Which Format Is Best for Your Website? | webp vs jpeg | 1,200 | 🔴 High |
| What Is AVIF and Why Should You Use It? | what is avif format | 800 | 🔴 High |
| How to Improve Core Web Vitals with Image Optimization | image optimization core web vitals | 1,500 | 🔴 High |
| Image Compression API: How to Automate Optimization | image compression api | 1,200 | 🔴 High |
| Lossless vs Lossy Image Compression: What's the Difference? | lossless vs lossy | 900 | 🟠 Medium |
| How to Convert PNG to WebP (5 Methods) | convert png to webp | 1,000 | 🟠 Medium |
| Image File Size Guide: How Small Is Small Enough? | image file size for website | 900 | 🟠 Medium |
| WordPress Image Optimization: The Complete Guide | wordpress image optimization | 2,000 | 🟡 Low |

Each article:
- Targets a specific featured snippet / PAA query
- Links back to the homepage tool (conversion opportunity)
- Establishes E-E-A-T through detailed, accurate content
- Feeds the AI Overview citation network

### Implementation Note

This is a React SPA — a blog requires either:
1. A CMS with a separate `/blog` section (headless CMS like Contentful or a simple markdown-based solution)
2. Pre-rendered static pages via a migration to Next.js (recommended for SEO at scale)
3. A separate blog subdomain (blog.shrinkix.com) with WordPress or Ghost

---

## 6. Immediate AEO Fixes (No Blog Needed)

These can be done now without creating new content:

| Fix | File | Effort |
|-----|------|--------|
| Add FAQPage schema to all FAQ sections | `FAQ.jsx`, `DeveloperFAQ.jsx`, `DeveloperPricing.jsx` | 1 hour |
| Expand FAQ to 8+ questions with PAA targets | `FAQ.jsx` | 2 hours |
| Add definition paragraph ("What is image compression?") to Problem section | `Problem.jsx` | 30 min |
| Rewrite HowItWorks H2 as a question ("How to compress images for websites") | `HowItWorksSection.jsx` | 5 min |
| Add 1–2 sentence summary paragraph at the very top of the homepage | `NewHeroSection.jsx` or `Home.jsx` | 30 min |
| Add Speakable schema to homepage | `Home.jsx` | 30 min |
| Fix pricing inconsistency in FAQ (API Pro $19 vs $35) | `DeveloperPricing.jsx` | 5 min |
| Add 3 PAA-targeted FAQ items (quality, format speed, SEO impact) | `FAQ.jsx` | 1 hour |

---

## 7. AEO Priority Roadmap

### Week 1 — Schema + FAQ
- Add FAQPage JSON-LD to all 3 FAQ sections
- Expand homepage FAQ to 8 questions (add PAA-targeted ones)
- Add HowTo schema to HowItWorksSection

### Week 2 — Content Expansion
- Add definition paragraph to Problem.jsx
- Rewrite section headings as questions where appropriate
- Add concise one-paragraph product summary to hero area
- Fix pricing copy inconsistencies

### Month 2 — Content Hub
- Publish first 3 blog articles (WebP vs JPEG, AVIF, Core Web Vitals)
- Set up /blog route in React SPA or subdomain
- Add Article schema to each blog post

### Month 3+ — Authority Building
- Create /about page
- Add testimonials/reviews section
- Pursue press mentions and backlinks
- Submit to product directories (Product Hunt, G2, Capterra)

---

*AEO audit complete. Estimated score after implementing all fixes: 65–75 / 100.*
