# Shrinkix — Page Content Documentation
**For design reference. All copy, sections, and structure.**

---

## Brand & Design Tokens

| Token | Value |
|---|---|
| Primary blue | `#1e62c8` |
| Primary dark | `#1751a8` |
| Dark navy (hero/nav bg) | `#0a1628` |
| Background | `#f7f9fb` |
| Card background | `#ffffff` |
| Border | `#e3e8ee` |
| Text main | `#3d4852` |
| Text light | `#8795a1` |
| Success green | `#48c774` |
| Error red | `#f14668` |
| Font | Outfit (headings), system-ui (body) |
| Button radius | 50px (pill) |

---

## 1. Home Page (`/`)

### 1.1 Hero Section
**Background:** Dark navy `#0a1628` with hero-bg.png image (right side)

| Element | Content |
|---|---|
| H1 | Compress and convert images instantly — free |
| Subtitle | Shrinkix reduces PNG, JPG, WebP & AVIF by 60–80% with no visible quality loss. No sign-up. Files deleted immediately. |
| Upload zone label | Drop images here |
| Upload button | Choose files |
| Limit text | Free: up to 5 MB · 25 compressions/day |
| Checkbox | Convert images automatically |

**Format toggle chips:** PNG · JPG · WebP · AVIF

---

### 1.2 Stats Bar

| Stat | Label |
|---|---|
| 74% | Avg. Reduction |
| 4 Formats | PNG · JPG · WebP · AVIF |
| Instant Delete | Files Gone After Download |

---

### 1.3 Trust Signals (3 columns)

| Icon | Title | Body |
|---|---|---|
| 🔒 | Privacy First | Files are deleted instantly after compression. We never store, share, or retain your images. |
| ⚡ | Under 2 Seconds | Powered by Sharp and MozJPEG — industry-leading engines that compress at native speed. |
| 🎯 | Adaptive Quality | Our engine auto-selects the optimal quality level based on your file size and content. |

---

### 1.4 Format Support

**Heading:** Every format. One tool.
**Subtitle:** Compress or convert between PNG, JPG, WebP, and AVIF — no plugins needed.

| Format | Description | Link |
|---|---|---|
| PNG | Lossless PNG compression. Perfect for logos, illustrations & screenshots with transparency. | /compress-png |
| JPG | Lossy JPEG compression with adaptive quality. Ideal for photos & hero images. | /compress-jpg |
| WebP | Convert JPG or PNG to WebP. Up to 34% smaller than JPEG at equivalent visual quality. | /compress-webp |
| AVIF | Next-gen format with the best compression. Supported by all modern browsers. | /compress-avif |

---

### 1.5 How It Works (3 steps)

**Heading:** How to compress images for a website

| Step | Title | Body |
|---|---|---|
| 1 | Upload your images | Add PNG, JPG, WebP, or AVIF files — single images or bulk uploads. |
| 2 | Automatic conversion and compression | Shrinkix optimizes each image for size and quality in seconds. |
| 3 | Download optimized files | Smaller images, same visual quality, ready for production. |

---

### 1.6 Features (3 cards)

**Heading:** Everything you need to optimize images — nothing you don't

| Icon | Title | Body |
|---|---|---|
| ⚙️ | Intelligent Optimization | Advanced algorithms deliver maximum compression with optimal quality preservation. |
| 🖼️ | Multi-Format Support | Compress JPEG, PNG, WebP & AVIF — all in one place. |
| 🛡️ | Secure & Reliable | Your images are processed securely and deleted immediately after compression. |

---

### 1.7 API Callout
**Background:** Dark navy `#0a1628`

**Heading:** Building something? Use our API.
**Body:** Automate image compression at scale. Send an image, get back a smaller one. No dashboards, no storage, no friction.

**Checklist:**
- REST API with simple JSON responses
- Supports PNG, JPG, WebP & AVIF
- Files deleted immediately after delivery
- Pay-per-credit — no monthly surprises

**Buttons:**
- View API Docs → `/api-docs`
- See API Pricing → `/developers/pricing`

**Code snippet label:** Node.js

---

### 1.8 Pricing Preview

**Heading:** Simple pricing that scales with you
**Body:** Start free. Upgrade when you need higher limits or API usage.
**Button:** View pricing → `/pricing`

---

### 1.9 FAQ Section

| Question | Answer |
|---|---|
| Is Shrinkix really free? | Yes. The free plan gives you 25 compressions per day with no sign-up and no payment details needed. |
| Are my images stored on your servers? | No. Files are deleted immediately after compression. We never retain, share, or process your images beyond the compression task. |
| What formats does Shrinkix support? | JPEG, PNG, WebP, and AVIF — all as both input and output formats. |
| How much compression can I expect? | Typically 60–80% reduction. A 1 MB JPEG usually becomes 150–300 KB. A 500 KB PNG typically becomes 100–200 KB. |
| Can I compress images in bulk? | Yes. The free plan supports up to 25 files per session. Web Pro and Ultra plans allow unlimited bulk compression. |
| Does Shrinkix reduce image dimensions? | No. Only file size is reduced through compression. Dimensions stay the same unless you use the resize option. |

---

### 1.10 Final CTA

**Heading:** Start optimizing images in seconds
**Body:** Upload your images or connect the API — Shrinkix works instantly.
**Button 1:** Upload images
**Button 2:** Get API access → `/api-docs`

---

## 2. Developers Hub (`/developers`)

### 2.1 Hero
**Background:** Dark navy `#0a1628`

| Element | Content |
|---|---|
| Label pill | REST API |
| H1 | Automate image compression at any scale |
| Subtitle | One POST request compresses any JPEG, PNG, WebP, or AVIF. 60–80% smaller files, no visible quality loss, under 2 seconds. |
| Feature list item 1 | No SDK required — standard HTTP multipart |
| Feature list item 2 | Node.js, Python, PHP, Ruby, Go, Java, C# |
| Feature list item 3 | 500 free compressions per month, no card needed |
| Feature list item 4 | Scales to 50,000 compressions per month |
| Button primary | Get your free API key → /signup |
| Button secondary | View API reference → → /api-docs |

**Right side:** Terminal window titled `compress.js` with Node.js code example

---

### 2.2 Stats Bar (4 columns)

| Stat | Label |
|---|---|
| 60–80% | Average size reduction |
| < 2s | Processing time |
| 4 | Formats supported |
| 99.9% | API uptime |

---

### 2.3 Features Grid (6 cards)
**Label:** Features
**Heading:** Everything you need, nothing you don't
**Subtitle:** A single endpoint handles every image optimisation task. No SDK, no complex setup — just HTTP.

| Icon | Title | Body |
|---|---|---|
| ⚡ | Adaptive quality | Compression quality is tuned to each image — larger files get more aggressive compression, small files stay sharp. |
| 🔄 | Format conversion | Compress and convert in one request. JPEG → WebP, PNG → AVIF, or any combination. No extra steps. |
| 📐 | Resize on the fly | Pass width and height parameters to resize while compressing. Aspect ratio is always preserved. |
| 🔒 | No image storage | Images are processed in memory and immediately discarded. Nothing is persisted. GDPR and CCPA compliant. |
| 📊 | Usage tracking | Every response includes X-Original-Size, X-Compressed-Size, and X-Saved-Percent headers. |
| 🌐 | Any language | Standard HTTP multipart — works with Node.js, Python, PHP, Ruby, Go, Java, C#, or plain cURL. |

---

### 2.4 Quick Start (4-step + code)
**Label:** Quick start
**Heading:** Start compressing in minutes
**Subtitle:** No SDK needed — just an HTTP client and your API key. The same endpoint handles compression, conversion, and resizing.

| Step | Title | Body |
|---|---|---|
| 1 | Sign up and get your API key | Create a free account — no credit card needed. Your API key appears in the API Dashboard immediately. |
| 2 | Install an HTTP client | For Node.js: npm install axios form-data. Python, PHP, Ruby, Go, and Java ship with HTTP clients built-in. |
| 3 | Send your first request | POST your image to api.shrinkix.com/compress with the X-API-Key header. The compressed image is returned in the response body. |
| 4 | Read the full API reference | Convert formats, resize, preserve EXIF metadata, and handle errors — all documented in the API Reference. |

**Right side:** Code window titled `compress.py` with Python example

---

### 2.5 FAQ (6 items)
**Label:** FAQ
**Heading:** Common questions

| Question | Answer |
|---|---|
| Do I need to install an SDK? | No. The Shrinkix API is a standard HTTP multipart endpoint. Any HTTP client works — axios (Node.js), requests (Python), cURL (PHP / shell), net/http (Go), or java.net.http (Java). |
| Is there a free tier? | 500 compressions per month are free — no credit card required. The free plan supports files up to 5 MB in JPEG, PNG, and WebP format. |
| Can I use one API key across multiple projects? | Yes, but we recommend creating separate keys from the API Dashboard for each project. That way you can track usage per project and rotate keys independently. |
| Are my images stored on your servers? | No. Images are processed in memory and immediately discarded. Nothing is written to permanent storage. Shrinkix is GDPR and CCPA compliant. |
| What formats can I compress and convert? | JPEG, PNG, WebP, and AVIF are all supported as both input and output. AVIF output requires an API Pro plan or higher. |
| What happens when I hit my monthly limit? | The API returns a 429 status with error code QUOTA_EXCEEDED. You can upgrade your plan from the dashboard at any time, or add-on credits are available without changing your base plan. |

---

### 2.6 CTA
**Background:** Dark navy `#0a1628`

**Heading:** Ready to get started?
**Body:** Sign up for free, grab your API key, and send your first request in under five minutes. No credit card required.
**Button 1:** Get free API key → `/signup`
**Button 2:** Read the docs → → `/api-docs`

---

## 3. API Reference (`/api-docs`)

### Layout
- Left: sticky sidebar (240px), grouped navigation with scroll-spy
- Right: main content — each section is two columns (prose left, dark code panel right)

### Sidebar Navigation Groups

**Getting Started**
- Introduction
- Installation
- Authentication

**Endpoints**
- Compress images
- Convert images
- Preserve metadata

**Usage**
- Check quota
- Error handling

**Support**
- Need help?

---

### 3.1 Introduction (Header)
**Label:** REST API · v1
**H1:** Shrinkix API Reference
**Body:** Integrate lossless image compression into any application with a single POST request. Upload JPEG, PNG, WebP, or AVIF — receive a compressed file in the response body. No SDK required.

**Base URL chip:** `https://api.shrinkix.com`

**Right panel:** Quick start code (tabs: cURL / Node.js / Python)

---

### 3.2 Installation

**H2:** Installation
**Body:** No dedicated SDK is required — Shrinkix is a standard HTTP multipart API. Use any HTTP client library for your language.

**Install cards (6):**

| Language | Command |
|---|---|
| Node.js | npm install axios form-data |
| Python | pip install requests |
| PHP | Built-in cURL (no install) |
| Ruby | gem install multipart-post |
| Go | stdlib net/http (built-in) |
| Java | stdlib java.net.http (Java 11+) |

---

### 3.3 Authentication

**H2:** Authentication
**Body:** Pass your API key in the `X-API-Key` header with every request. Get your key from the API Dashboard after signing up for any paid plan.

**Code example:** `X-API-Key: YOUR_API_KEY`

**Warning box:** Security — Never expose your API key in client-side code or public repositories. Always make API calls from your server-side backend.

**Rate limits table:**

| Plan | Monthly limit | Req / sec | Max file |
|---|---|---|---|
| Free | 500 | 0.5 | 5 MB |
| API Pro | 5,000 | 2 | 10 MB |
| API Ultra | 20,000 | 5 | 25 MB |
| Business | 50,000 | 10 | 50 MB |

**Rate limit headers table:**

| Header | Description |
|---|---|
| X-RateLimit-Limit | Monthly quota |
| X-RateLimit-Remaining | Compressions left this month |
| X-RateLimit-Reset | Unix timestamp of next reset |

---

### 3.4 Compress Images

**H2:** Compress images
**Body:** Upload any JPEG, PNG, WebP, or AVIF image. Shrinkix automatically detects the format and applies adaptive quality compression (60–80% smaller, no visible loss).

**Endpoint badge:** `POST /compress`

**Request parameters table:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| image | File | Required | Image file to compress (JPEG, PNG, WebP, AVIF) |
| quality | Integer 1–100 | Optional | Output quality. Default: adaptive based on file size |
| width | Integer | Optional | Resize to width (pixels), preserves aspect ratio |
| height | Integer | Optional | Resize to height (pixels), preserves aspect ratio |
| format | String | Optional | Convert output: jpg / png / webp / avif |
| preserveMetadata | Boolean | Optional | Keep EXIF/GPS data. Default: false |

**Response headers table:**

| Header | Description |
|---|---|
| X-Original-Size | Input file size in bytes |
| X-Compressed-Size | Output file size in bytes |
| X-Saved-Percent | Percentage size reduction |
| Content-Type | Output MIME type |

**Body:** The response body is the compressed image binary.

**Right panel:** Code (tabs: cURL / Node.js / Python / PHP / Ruby / Go)

---

### 3.5 Convert Images

**H2:** Convert images
**Body:** Pass the `format` parameter to convert between formats in the same request. WebP is 25–35% smaller than JPEG at equivalent quality and is supported by all modern browsers.

**Endpoint badge:** `POST /compress`

**Supported conversions table:**

| Target format | format value | Notes |
|---|---|---|
| JPEG | jpg | Best for photographs |
| PNG | png | Lossless, supports transparency |
| WebP | webp | 25–35% smaller than JPEG |
| AVIF | avif | Best compression (Pro+ plans) |

**Tip box:** Convert PNG screenshots to WebP for the web — you'll typically get 50–70% smaller files with no visible quality difference.

**Right panel:** Code (tabs: cURL / Node.js / Python)

---

### 3.6 Preserve Metadata

**H2:** Preserve metadata
**Body:** By default Shrinkix strips all metadata (EXIF, IPTC, XMP) to minimise file size. Pass `preserveMetadata=true` to retain it.

**Endpoint badge:** `POST /compress`

**What is retained:**
- EXIF — camera settings, date and time
- GPS coordinates
- Camera make and model
- Copyright and author info
- ICC colour profile

**Info box:** Preserving metadata adds roughly 2–5 KB to the output file. Strip it when serving images on the web.

**Right panel:** Code (tabs: cURL / Node.js / Python)

---

### 3.7 Check Quota

**H2:** Check quota
**Body:** Check your current usage and remaining compressions for the billing cycle before starting a batch job.

**Endpoint badge:** `GET /check-limit`

**Response fields table:**

| Field | Type | Description |
|---|---|---|
| remaining | Integer | Compressions left this month |
| total | Integer | Monthly quota for your plan |
| usage | Integer | Compressions used this month |
| plan | String | Your current plan ID |
| maxFileSize | Integer | Max upload size in bytes |

**Right panel:** Request code (tabs: cURL / Node.js / Python) + JSON response example

---

### 3.8 Error Handling

**H2:** Error handling
**Body:** The API uses standard HTTP status codes. Error responses include a JSON body with `error`, `message`, and `status` fields.

**HTTP status codes table:**

| Status | Meaning |
|---|---|
| 200 | Success — compressed image in body |
| 400 | Bad request — unsupported format or invalid parameters |
| 401 | Unauthorized — missing or invalid API key |
| 413 | File too large for your plan |
| 429 | Rate limit or monthly quota exceeded |
| 500 | Server error — retry after a short delay |

**Error codes table:**

| Code | Status | Recommended action |
|---|---|---|
| INVALID_API_KEY | 401 | Check your API Dashboard |
| QUOTA_EXCEEDED | 429 | Upgrade plan or wait for reset |
| RATE_LIMIT_EXCEEDED | 429 | Add exponential backoff |
| FILE_TOO_LARGE | 413 | Reduce file size or upgrade plan |
| UNSUPPORTED_FORMAT | 400 | Use JPEG, PNG, WebP, or AVIF |
| CORRUPTED_IMAGE | 400 | Verify the file is a valid image |
| SERVER_ERROR | 500 | Retry with exponential backoff |

**Right panel:** JSON error example + error handling code (tabs: Node.js / Python)

---

### 3.9 Need Help?

**H2:** Need help?
**Body:** Questions, bugs, or feedback — we're here to help. Typical email response time is under 24 hours.

**Help cards (3):**

| Title | Body | Button |
|---|---|---|
| Email support | Get help from our team with API integration or account issues. | support@shrinkix.com |
| API Dashboard | Manage your API keys, view usage, and rotate secrets. | Open Dashboard |
| Upgrade plan | Need higher limits or larger file sizes? View API plans. | View plans |

---

## 4. Blog Listing (`/blog`)

### 4.1 Hero
**H1:** The Shrinkix Blog
**Subtitle:** Practical guides on image compression, formats, and web performance.
**Meta:** 3 articles published

### 4.2 Category Filter Tabs
All · Guides · Formats

### 4.3 Post Cards
Each card shows: Category chip · Title · Description · Read time · Tags · "Read article →" link

### 4.4 Newsletter CTA
**Heading:** Get new guides in your inbox
**Body:** We publish deep-dives on image formats, web performance, and compression techniques. No spam, unsubscribe any time.
**Input placeholder:** you@company.com
**Button:** Subscribe
**Note:** Or create a free account to get updates and 20 free compressions per month.

---

## 5. Blog Posts (`/blog/:slug`)

### Layout
- Reading progress bar at top
- Sticky table of contents (desktop, >1100px)
- Mid-article CTA at 50% word count
- Author box (E-E-A-T)
- Social share (Twitter/X, LinkedIn, copy link)
- Prev/next navigation

---

### Post 1: How to Compress Images for Web (Without Losing Quality)
**URL:** `/blog/how-to-compress-images-for-web`
**Category:** Guides · 6 min read

**Meta description:** Learn how to reduce image file sizes for faster websites without sacrificing visual quality. Covers JPEG, PNG, WebP, and AVIF with real compression benchmarks.

**Sections:**
1. Why image compression matters for the web
2. The two types of compression: lossy vs lossless
3. Which format should you use?
4. What quality setting should you use for JPEG?
5. Compression tools compared
6. Step-by-step: compress images for your website

**Tags:** image compression, web performance, Core Web Vitals, LCP, PageSpeed

**Related tools:**
- Compress JPG · Compress PNG · Compress WebP · Batch Compressor

---

### Post 2: JPG vs WebP: Which Image Format Should You Use?
**URL:** `/blog/jpg-vs-webp`
**Category:** Formats · 5 min read

**Meta description:** A direct comparison of JPG and WebP for web use. File size, browser support, quality, and when to switch. Includes real benchmark data.

**Sections:**
1. The short answer
2. File size: how much smaller is WebP?
3. Head-to-head comparison (table)
4. Visual quality comparison
5. Browser support in 2025
6. When to use JPEG instead of WebP
7. How to convert JPG to WebP

**Key stat:** Average JPEG at q=80 was 87 KB. Same images as WebP averaged 61 KB. 30% reduction.

**Tags:** WebP, JPEG, image formats, browser support, file size

**Related tools:**
- JPG to WebP · Compress JPG · Compress WebP

---

### Post 3: What Is AVIF? The Next-Gen Image Format Explained
**URL:** `/blog/what-is-avif`
**Category:** Formats · 5 min read

**Meta description:** AVIF delivers 50% smaller files than JPEG. Learn what AVIF is, how it compares to WebP and JPEG, and when to use it on your website.

**Sections:**
1. What is AVIF?
2. AVIF vs WebP vs JPEG: direct comparison (table)
3. Browser support: is AVIF safe to use?
4. When should you use AVIF?
5. How to convert images to AVIF
6. AVIF and Core Web Vitals

**Key stat:** AVIF is ~52% smaller than JPEG. A 200 KB JPEG becomes ~95 KB AVIF.

**Tags:** AVIF, image formats, AV1, next-gen, Core Web Vitals

**Related tools:**
- AVIF Converter · Compress AVIF · Compress PNG

---

## 6. Format Landing Pages (all follow the same template)

### Template Sections
1. Upload zone (same as homepage)
2. Stats bar (4 stats)
3. Definition / explainer
4. How-to steps
5. Tips
6. FAQ
7. Blog posts (2 related)
8. Related tools

---

### Compress JPG (`/compress-jpg`)
**H1:** Compress JPG Online — Free
**Meta:** Compress JPEG images online without losing quality. Free JPG compressor — reduce file size by 60–80%. No sign-up. Files deleted immediately.

**Stats:**
- 60–80% · Typical JPEG reduction
- 5 MB · Free file limit
- Instant · No account needed
- 25 files · Batch compression

**Definition heading:** What is JPEG compression?
**Definition:** JPEG uses lossy compression — it discards image data the human eye is unlikely to notice. The quality setting (1–100) controls how much data is discarded...

**How-to steps:**
1. Upload your JPG or JPEG — Drop a file or click to browse. Free users can upload files up to 5 MB.
2. Automatic compression — Shrinkix analyses your image and applies adaptive quality compression (q=75–82 for most images). You'll see the percentage saved.
3. Download your compressed JPG — Click download. Your image is the same dimensions, same format — just smaller.

**Tips (5):** quality 75-82, convert to WebP, photo vs graphics, monitor not visible, batch compression

**FAQ (8 questions):** standard JPEG compression questions

---

### Compress PNG (`/compress-png`)
**H1:** Compress PNG Online — Free
**Stats:** 50–70% reduction, 5 MB limit, Lossless option, 25 files

---

### Compress WebP (`/compress-webp`)
**H1:** Compress WebP Images Online — Free
**Stats:** 40–60% reduction, 5 MB limit, Lossless/lossy, 25 files

---

### Compress AVIF (`/compress-avif`)
**H1:** Compress AVIF Images Online — Free
**Stats:** 50–65% reduction, 5 MB limit, Next-gen format, 25 files

---

### JPG to WebP (`/jpg-to-webp`)
**H1:** Convert JPG to WebP Online — Free
**Stats:** 25–34% smaller, 5 MB limit, Lossless option, 25 files

---

### PNG to WebP (`/png-to-webp`)
**H1:** Convert PNG to WebP — Free Online Converter
**Stats:** 26–34% smaller, 5 MB limit, Transparency kept, 25 files

---

### AVIF Converter (`/avif-converter`)
**H1:** AVIF Converter — Free Online
**Stats:** ~50% smaller than JPEG, 5 MB limit, AV1-based, 25 files

---

### Convert to WebP (`/convert-to-webp`)
**H1:** Convert Any Image to WebP — Free Online
**Stats:** 25–50% smaller, 5 MB limit, All formats, 25 files

---

### Batch Image Compressor (`/batch-image-compressor`)
**H1:** Batch Image Compressor — Compress 25 Images at Once
**Stats:** 60–80% reduction, Up to 25 files, PNG/JPG/WebP/AVIF, Free

---

### Compress Image to KB (`/compress-image-to-kb`)
**H1:** Compress Image File Size Online — Free
**Meta:** Compress any image to under 100 KB, 200 KB, or 1 MB online. Free image size reducer for email, government forms, social media, and web. No signup.

**Stats:**
- 60–80% · Typical size reduction
- PNG, JPG · WebP, AVIF supported
- Free · No account needed
- 25 files · Bulk compression

---

## 7. Pricing Page (`/pricing`)

### 7.1 Hero
**H1:** Simple, transparent pricing that scales with you
**Subtitle:** Choose the web plan that fits your needs.

### 7.2 Plan Cards (3)

**Free**
- Price: $0
- Up to 5 MB per file ✓
- Max 20 images per day ✓
- Web Interface Only ✓
- No Priority Support ✗
- Button: Current Plan

**Web Pro** *(Featured)*
- Price: $39/year ($5/month equivalent)
- **Unlimited** images ✓
- **75 MB** file size limit ✓
- Web Interface Only ✓
- Priority Support ✓
- Button: Upgrade to Pro

**Web Ultra**
- Price: $59/year ($9/month equivalent)
- **Unlimited** images ✓
- **150 MB** file size limit ✓
- Web Interface Only ✓
- Highest Priority ✓
- Button: Upgrade to Ultra

### 7.3 API Plans Link
Link to developer pricing page for API-specific plans.

---

## 8. Navigation

### Navbar
**Brand:** Shrinkix
**Links:** (authenticated) Dashboard, Docs, Pricing
**Links:** (guest) Pricing, Developers, Blog, Sign Up

### Footer (4 columns)

**Product**
- Home
- Blog
- Pricing
- WordPress
- About
- Sign Up Free

**Compress**
- Compress JPG
- Compress PNG
- Compress WebP
- Compress AVIF
- Compress to 100 KB
- Batch Compressor

**Convert**
- JPG → WebP
- PNG → WebP
- AVIF Converter
- Convert to WebP
- All Formats

**Developers + Legal**
- API Docs
- Developer Pricing
- Privacy Policy
- Terms of Service
- support@shrinkix.com

**Footer tagline:** Fast, private image compression — files deleted immediately after download.

---

## 9. Dashboard Pages (authenticated)

### Overview Tab (`/dashboard`)
- Usage bar (used / total)
- Days until reset
- Plan name
- Quick links: API Dashboard, Upgrade

### API Tab (`/dashboard/api`)
- API key display (masked: `sk_live_xxxxxxxx...xxxx`)
- Generate / regenerate key button
- Copy button
- Usage stats

### Web Tab
- Web compressions used today
- Daily limit
- Reset time

### Account Tab
- Email
- Plan
- Billing

---

## 10. Auth Pages

### Sign Up (`/signup`)
**H1:** Create your free account
Fields: Name, Email, Password
Button: Create account
Note: No credit card needed · Cancel anytime

### Log In (`/login`)
**H1:** Welcome back
Fields: Email, Password
Button: Sign in
Link: Forgot password?

---

## Page Count Summary

| Page | URL | Status |
|---|---|---|
| Home | / | Live |
| Compress JPG | /compress-jpg | Live |
| Compress PNG | /compress-png | Live |
| Compress WebP | /compress-webp | Live |
| Compress AVIF | /compress-avif | Live |
| JPG to WebP | /jpg-to-webp | Live |
| PNG to WebP | /png-to-webp | Live |
| AVIF Converter | /avif-converter | Live |
| Convert to WebP | /convert-to-webp | Live |
| Batch Compressor | /batch-image-compressor | Live |
| Compress to KB | /compress-image-to-kb | Live |
| Pricing | /pricing | Live |
| Developers Hub | /developers | Live |
| API Reference | /api-docs | Live |
| Blog Listing | /blog | Live |
| Blog Post 1 | /blog/how-to-compress-images-for-web | Live |
| Blog Post 2 | /blog/jpg-vs-webp | Live |
| Blog Post 3 | /blog/what-is-avif | Live |
| Dashboard | /dashboard | Auth required |
| API Dashboard | /dashboard/api | Auth required |
| Sign Up | /signup | Live |
| Log In | /login | Live |
| About | /about | Live |
| Privacy | /privacy | Live |
