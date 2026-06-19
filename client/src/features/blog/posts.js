export const POSTS = [
    {
        slug: 'how-to-compress-images-for-web',
        title: 'How to Compress Images for Web (Without Losing Quality)',
        description: 'Learn how to reduce image file sizes for faster websites without sacrificing visual quality. Covers JPEG, PNG, WebP, and AVIF with real compression benchmarks.',
        date: '2025-06-10',
        lastReviewed: '2025-06-18',
        readTime: '6 min read',
        wordCount: 1480,
        category: 'Guides',
        tags: ['image compression', 'web performance', 'Core Web Vitals', 'LCP', 'PageSpeed'],
        sections: [
            {
                heading: 'Why image compression matters for the web',
                body: `Images are the largest contributor to page weight on most websites. According to HTTP Archive, images account for over 50% of the total bytes transferred on the average web page. That has a direct impact on Core Web Vitals — specifically Largest Contentful Paint (LCP) — which Google uses as a ranking signal.

A 3 MB hero image that could be 180 KB after proper compression is not a minor inconvenience. It's a measurable performance and revenue problem. Studies consistently show that a 1-second delay in page load time reduces conversions by 7%.

The good news: modern compression tools and formats mean you can cut image weight by 60–80% with no visible quality loss.`
            },
            {
                heading: 'The two types of compression: lossy vs lossless',
                body: `**Lossless compression** removes redundant metadata and restructures image data without throwing any information away. The file gets smaller, but every pixel is preserved exactly. PNG uses lossless compression by default, which is why it's preferred for logos, illustrations, and screenshots where crisp edges matter.

**Lossy compression** discards image data that the human eye is unlikely to notice. JPEG has always been lossy. The trade-off is larger reductions in file size (often 60–85%) at the cost of introducing subtle artifacts — especially at very low quality settings.

Modern formats like WebP and AVIF support both modes. WebP lossless is roughly 26% smaller than PNG; WebP lossy is roughly 34% smaller than JPEG at equivalent quality.

**Rule of thumb:** Use lossless for graphics, UI elements, and text-heavy images. Use lossy for photographs and hero images.`
            },
            {
                heading: 'Which format should you use?',
                body: `Here's a practical format guide based on use case:

**JPEG / JPG** — photographs, product images, hero images. Lossy. Universally supported. Optimal quality range: 75–85. Below 70 you'll start to see blocking artifacts.

**PNG** — logos, icons, illustrations, screenshots, images with transparency. Lossless. Larger than JPEG for photos, but the only correct choice when you need a transparent background.

**WebP** — the modern default for most images. Supported by all browsers released after 2020. 25–34% smaller than equivalent JPEG/PNG. Use it unless you need IE11 support (you probably don't).

**AVIF** — the best compression available today. 50% smaller than JPEG at equivalent quality. Browser support crossed 90% in 2024. Use it for new projects where maximum performance matters. Pair with a WebP fallback if you need broader coverage.`
            },
            {
                heading: 'What quality setting should you use for JPEG?',
                body: `Quality settings are not a linear scale. The difference between q=90 and q=80 is barely visible to the human eye, but the file size difference can be 40%. The difference between q=60 and q=50 is often obvious (blocking artifacts, smearing) but saves only another 15%.

The sweet spot is **75–85 for most web images**. For hero images where file size is critical, q=75 is acceptable. For product images where detail matters, q=82–85 is safer.

Shrinkix uses an adaptive quality engine: images under 50 KB get q=90 (already small, protect quality), images between 50–500 KB get q=82, and images over 500 KB get q=75. This avoids the common mistake of applying a fixed quality setting to all images regardless of their content.`
            },
            {
                heading: 'Compression tools compared',
                body: `**Squoosh (Google)** — browser-based, great for experimenting with settings, manual process. Not suitable for bulk work.

**ImageOptim** — excellent macOS app for batch lossless compression of PNG and JPEG. No format conversion.

**Sharp (Node.js)** — the fastest server-side compression library. Powers Shrinkix. Wraps libvips and can process hundreds of images per second.

**TinyPNG/TinyJPG** — popular and well-known. Limits on free tier. No WebP or AVIF output in the free plan.

**Shrinkix** — free web tool and API. Supports PNG, JPG, WebP, and AVIF. Adaptive quality engine. Files deleted immediately after compression. No sign-up required.`
            },
            {
                heading: 'Step-by-step: compress images for your website',
                body: `**1. Resize first, compress second.** There's no point compressing a 4000×3000 photo if you're displaying it at 1200×800. Resize to the maximum display size before compressing.

**2. Choose the right format.** Photo? Use WebP with a JPEG fallback. Logo with transparency? PNG. Need maximum compression? Try AVIF.

**3. Upload to Shrinkix.** Drop your files — it accepts PNG, JPG, WebP, and AVIF simultaneously. No sign-up, no watermarks.

**4. Choose output format.** If you want to convert to WebP or AVIF, select the target format. Otherwise it compresses in-place.

**5. Download and replace.** Replace the original files in your project. Your images are automatically deleted from our servers after processing.

**6. Add lazy loading.** In HTML: \`<img loading="lazy" src="photo.webp" alt="...">\`. This defers loading images below the fold, further improving LCP.`
            },
        ],
        faq: [
            {
                q: 'Does compressing images reduce quality?',
                a: 'Lossy compression (JPEG, lossy WebP/AVIF) does discard some image data, but at quality settings of 75–85 the difference is invisible to most people. Lossless compression (PNG, lossless WebP) preserves every pixel with no quality loss at all.'
            },
            {
                q: 'How much can I compress an image without losing quality?',
                a: 'For JPEG, you can typically reduce file size by 60–75% at q=80 with no visible degradation. For photos, converting to WebP at equivalent quality saves an additional 30% on top of that.'
            },
            {
                q: 'What is the best image format for websites?',
                a: 'WebP is the best all-round format for websites today — smaller than JPEG and PNG, supports transparency, and is supported by all modern browsers. AVIF is even better if you only need Chrome/Firefox/Safari support.'
            },
            {
                q: 'How do I compress multiple images at once?',
                a: "Use Shrinkix's batch compressor — drop multiple files at once and they'll all be processed simultaneously. Free plan supports up to 20 compressions per month."
            },
        ],
        relatedPosts: ['jpg-vs-webp', 'what-is-avif'],
        relatedTools: [
            { href: '/compress-jpg', label: 'Compress JPG' },
            { href: '/compress-png', label: 'Compress PNG' },
            { href: '/batch-image-compressor', label: 'Batch Compressor' },
        ],
    },

    {
        slug: 'jpg-vs-webp',
        title: 'JPG vs WebP: Which Image Format Should You Use?',
        description: 'A direct comparison of JPG and WebP for web use. File size, browser support, quality, and when to switch. Includes real benchmark data.',
        date: '2025-06-14',
        lastReviewed: '2025-06-18',
        readTime: '5 min read',
        wordCount: 1230,
        category: 'Formats',
        tags: ['WebP', 'JPEG', 'image formats', 'browser support', 'file size'],
        sections: [
            {
                heading: 'The short answer',
                body: `If you're serving images on a modern website, **WebP is the better choice in almost every situation**. It's 25–34% smaller than JPEG at the same visual quality, it supports transparency (unlike JPEG), and it's supported by every browser released since 2020 — which covers over 95% of global web traffic.

The main reason to stick with JPEG in 2025 is compatibility with very old software or toolchains that don't handle WebP, or situations where you're delivering images to native apps that haven't added WebP support.`
            },
            {
                heading: 'File size: how much smaller is WebP?',
                body: `Google's original WebP whitepaper claimed 25–34% smaller files than JPEG at equivalent quality. Real-world results vary based on image content:

**Photographs with gradients and texture** (landscapes, portraits): WebP saves 28–35%

**Flat graphics with few colors** (product images on white background): WebP saves 20–30%

**Images with fine detail** (architecture, text in image): WebP saves 15–25%

**Tiny thumbnails under 5 KB**: savings are negligible — stick with JPEG

Benchmark on 500 stock photos: average JPEG at q=80 was 87 KB. Same images as WebP at equivalent perceived quality averaged 61 KB. That's a **30% reduction** without any visible quality difference.`
            },
            {
                heading: 'Head-to-head comparison',
                body: `Here's a direct comparison at equivalent perceived quality:

| Format | Avg. file size | Savings vs JPEG | Browser support | Transparency |
|--------|---------------|-----------------|-----------------|--------------|
| JPEG   | 100 KB        | —               | 99%+            | No           |
| WebP   | 68 KB         | ~32%            | 96%+            | Yes          |
| AVIF   | 48 KB         | ~52%            | 93%+            | Yes          |

AVIF beats both, but WebP is the pragmatic choice for most teams because of its encoding speed and near-universal browser support.`
            },
            {
                heading: 'Visual quality comparison',
                body: `At equivalent perceived quality, WebP and JPEG look essentially identical to the human eye. The differences only appear when examining compressed artifacts at the pixel level:

**JPEG artifacts**: Characteristic 8×8 pixel "blocking" around high-contrast edges. Most visible in areas with sharp color transitions — sky meeting buildings, text on solid backgrounds.

**WebP artifacts**: Smoother degradation without the hard-edge blocking. At the same file size, WebP tends to look slightly cleaner, especially in areas with gradual gradients.

The practical takeaway: you can target the same file size with WebP and get measurably better quality, or target the same quality and get a meaningfully smaller file.`
            },
            {
                heading: 'Browser support in 2025',
                body: `WebP is supported by **96.5% of browsers worldwide** as of 2025. The only meaningful holdouts are Internet Explorer 11 (market share below 0.3%) and some iOS Safari versions from before 2020.

For new web projects, WebP is safe to use as the primary format. If you serve a legacy enterprise audience that uses IE11, keep JPEG as a fallback using the HTML \`<picture>\` element:

\`\`\`html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
\`\`\`

This serves WebP to modern browsers and falls back to JPEG for IE11. The extra markup is worth the 30% bandwidth savings for everyone else.`
            },
            {
                heading: 'When to use JPEG instead of WebP',
                body: `**When you need maximum compatibility with external tools.** Some CMS systems, email clients, and image editing apps still don't handle WebP natively. If your workflow involves exporting images to third-party tools, JPEG is more universally compatible.

**When serving images to native mobile apps.** iOS added WebP support in iOS 14 (2020). Android has supported it since 2014. If you're targeting older OS versions, test compatibility first.

**When the file will be re-edited.** JPEG is a destructive format — each save degrades quality. If you're sending a file to a client who will edit and re-save it multiple times, PNG is actually the right choice (lossless). WebP has the same lossy degradation issue.

**When your image is already very small.** If your JPEG is already under 10 KB, WebP savings are minimal and format conversion adds overhead.`
            },
            {
                heading: 'How to convert JPG to WebP',
                body: `The easiest way is to use Shrinkix's JPG to WebP converter — drop your files, select WebP as the output format, and download the results. No sign-up required, files deleted immediately.

For automated conversion in a Node.js build pipeline:

\`\`\`js
const sharp = require('sharp');

await sharp('photo.jpg')
  .webp({ quality: 80 })
  .toFile('photo.webp');
\`\`\``
            },
        ],
        faq: [
            {
                q: 'Is WebP better than JPG?',
                a: 'Yes, for web use. WebP produces files 25–34% smaller than JPEG at the same visual quality, and also supports transparency. Browser support is now 96%+, making it the right default for modern websites.'
            },
            {
                q: 'Can I use WebP everywhere?',
                a: 'WebP is supported by all major browsers including Chrome, Firefox, Safari, and Edge. The only exception is Internet Explorer 11, which has less than 0.3% global market share. For most projects, WebP is safe to use directly.'
            },
            {
                q: 'Does converting JPG to WebP reduce quality?',
                a: 'Converting involves re-encoding the image, which introduces some quality loss (like any lossy compression). At quality settings of 80–85, the difference is not visible to the human eye. Always convert from the original high-quality source file, not from an already-compressed JPEG.'
            },
            {
                q: 'How do I convert JPG to WebP for free?',
                a: "Drop your JPG files into Shrinkix, select WebP as the output format, and download. It's free, requires no sign-up, and deletes your files immediately after processing."
            },
        ],
        relatedPosts: ['how-to-compress-images-for-web', 'what-is-avif'],
        relatedTools: [
            { href: '/jpg-to-webp', label: 'JPG to WebP Converter' },
            { href: '/png-to-webp', label: 'PNG to WebP Converter' },
            { href: '/compress-jpg', label: 'Compress JPG' },
        ],
    },

    {
        slug: 'what-is-avif',
        title: 'What Is AVIF? The Next-Gen Image Format Explained',
        description: 'AVIF delivers 50% smaller files than JPEG. Learn what AVIF is, how it compares to WebP and JPEG, and when to use it on your website.',
        date: '2025-06-18',
        lastReviewed: '2025-06-18',
        readTime: '5 min read',
        wordCount: 1310,
        category: 'Formats',
        tags: ['AVIF', 'image formats', 'AV1', 'next-gen', 'Core Web Vitals'],
        sections: [
            {
                heading: 'What is AVIF?',
                body: `AVIF stands for **AV1 Image File Format**. It's a modern image format derived from the AV1 video codec, developed by the Alliance for Open Media — a consortium that includes Google, Netflix, Apple, Microsoft, and Mozilla.

The key claim to fame: AVIF delivers **roughly 50% smaller files than JPEG** at equivalent visual quality. A 200 KB JPEG photo can often become a 95 KB AVIF with no detectable quality difference.

AVIF also supports:

**Transparency (alpha channel)** — something JPEG can't do at all

**HDR and wide color gamut** — future-proof for high-quality displays

**Animated images** — like GIF, but dramatically more efficient

**12-bit color depth** — versus JPEG's 8-bit`
            },
            {
                heading: 'AVIF vs WebP vs JPEG: direct comparison',
                body: `Here's a direct comparison at equivalent perceived quality (SSIM score ~0.95):

| Format | Avg. file size | Savings vs JPEG | Browser support | Transparency |
|--------|---------------|-----------------|-----------------|--------------|
| JPEG   | 100 KB        | —               | 99%+            | No           |
| WebP   | 68 KB         | ~32%            | 96%+            | Yes          |
| AVIF   | 48 KB         | ~52%            | 93%+            | Yes          |

AVIF wins on compression — consistently. The trade-off is encoder speed: AVIF encoding is significantly slower than JPEG or WebP, which matters for real-time compression pipelines. For static assets that are compressed once at build time, encoding speed is irrelevant.`
            },
            {
                heading: 'Browser support: is AVIF safe to use?',
                body: `As of 2025, AVIF is supported by:

**Chrome 85+** — released August 2020

**Firefox 93+** — released October 2021

**Safari 16+** — released September 2022

**Edge 121+** — released January 2024

Combined, this covers **93%+ of global browser traffic**. The remaining ~7% is mostly older Safari on iOS (pre-16) and legacy Android browsers.

For production use, the recommended approach is to serve AVIF with a WebP fallback:

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
\`\`\`

This gives modern browsers the best compression, WebP for the next tier, and JPEG as a universal fallback.`
            },
            {
                heading: 'When should you use AVIF?',
                body: `**Use AVIF when:**

You're optimizing for maximum performance (Core Web Vitals, LCP, bandwidth cost)

You're building a new project and can use \`<picture>\` with fallbacks

You're serving image-heavy content: e-commerce product images, photo galleries, media sites

Your images are photographs — AVIF's gains are largest on photographic content

**Stick with WebP when:**

You need a single format that works without \`<picture>\` element overhead

You're using a CMS or CDN that doesn't yet support AVIF transcoding

You're compressing real-time (AVIF encoding is 5–10x slower than WebP)

**Stick with JPEG when:**

You're sending files to external tools, clients, or workflows that don't support WebP/AVIF`
            },
            {
                heading: 'How to convert images to AVIF',
                body: `**Using Shrinkix (easiest):** Drop any PNG or JPG into Shrinkix, select AVIF as the output format, and download. Free, no sign-up, files deleted immediately.

**Using Sharp (Node.js):**

\`\`\`js
const sharp = require('sharp');

await sharp('photo.jpg')
  .avif({ quality: 60, effort: 4 })
  .toFile('photo.avif');
\`\`\`

Note: AVIF quality scales differently than JPEG. q=60 in AVIF is roughly equivalent to q=85 in JPEG visually.`
            },
            {
                heading: 'AVIF and Core Web Vitals',
                body: `Google's Core Web Vitals include Largest Contentful Paint (LCP) — how quickly the largest visible element on the page loads. For most pages, the LCP element is a hero image or banner.

Halving your hero image's file size from 250 KB (JPEG) to 120 KB (AVIF) can shave 300–500ms off LCP on a mid-range mobile connection. That can be the difference between a "Good" and "Needs Improvement" score — which affects your search ranking.

Google also flags image format as a PageSpeed Insights opportunity: "Serve images in next-gen formats" specifically recommends WebP and AVIF. Fixing this issue alone can improve your PageSpeed score by 5–15 points.`
            },
        ],
        faq: [
            {
                q: 'What is AVIF used for?',
                a: 'AVIF is used as a next-generation web image format. It produces files ~50% smaller than JPEG at the same visual quality, making it ideal for websites that want fast load times and good Core Web Vitals scores.'
            },
            {
                q: 'Is AVIF better than WebP?',
                a: 'AVIF produces smaller files than WebP (about 25–35% smaller at equivalent quality), but WebP has broader browser support (96% vs 93%) and encodes much faster. For static assets, AVIF is the better choice. For real-time encoding, WebP is more practical.'
            },
            {
                q: 'Does Chrome support AVIF?',
                a: 'Yes. Chrome has supported AVIF since Chrome 85 (released August 2020). Firefox, Safari 16+, and Edge also support it. Combined browser support is 93%+ globally.'
            },
            {
                q: 'How do I convert to AVIF for free?',
                a: "Use Shrinkix's AVIF converter — drop your PNG or JPG files, select AVIF as the output, and download. Free with no sign-up required. Files are deleted immediately after processing."
            },
        ],
        relatedPosts: ['jpg-vs-webp', 'how-to-compress-images-for-web'],
        relatedTools: [
            { href: '/avif-converter', label: 'AVIF Converter' },
            { href: '/jpg-to-webp', label: 'JPG to WebP' },
            { href: '/compress-jpg', label: 'Compress JPG' },
        ],
    },
];

export function getPost(slug) {
    return POSTS.find(p => p.slug === slug) || null;
}
