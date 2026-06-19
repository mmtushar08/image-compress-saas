import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'PNG',
    title: 'Convert PNG to WebP Online — Free | Shrinkix',
    metaDescription: 'Convert PNG images to WebP online free. WebP is 26% smaller than PNG with full transparency support. Batch convert, instant download, files deleted immediately.',
    canonical: '/png-to-webp',
    breadcrumb: 'PNG to WebP',
    heading: 'Convert PNG to WebP — Smaller Files, Same Transparency',
    subheading: 'WebP replaces PNG with 26% smaller files — and keeps your transparent backgrounds intact. Convert free, no signup, batch supported.',
    defaultTargetFormats: ['webp'],

    stats: [
        { value: '26%', label: 'Smaller than PNG (avg)' },
        { value: '100%', label: 'Transparency preserved' },
        { value: '97%+', label: 'Browser support (2025)' },
        { value: 'Free', label: 'No account needed' },
    ],

    definitionTitle: 'Why convert PNG to WebP?',
    definition: 'PNG is widely used for images that require transparency (logos, icons, UI elements). While PNG compression is lossless, PNG files tend to be large. WebP provides lossless compression with full alpha-channel (transparency) support — resulting in files that are on average 26% smaller than equivalent PNGs, with no loss in quality and no loss of transparency. This makes WebP a direct upgrade to PNG for web use.',
    definitionExtra: "Google PageSpeed Insights flags PNG files as an opportunity to 'Serve images in next-gen formats'. Switching from PNG to WebP is one of the quickest ways to improve your PageSpeed score and Core Web Vitals LCP metric. Shrinkix converts PNG to WebP in seconds, preserving transparency and delivering smaller files ready to deploy.",

    howToTitle: 'How to convert PNG to WebP online',
    steps: [
        {
            name: 'Upload your PNG files',
            text: 'Drag your PNG images onto the upload zone. WebP conversion is pre-selected. You can upload multiple PNG files for batch conversion — logos, icons, screenshots — all at once.',
        },
        {
            name: 'Conversion with transparency preserved',
            text: 'Shrinkix converts PNG to WebP using lossless or lossy compression (based on file characteristics). Your transparent backgrounds are fully preserved in the WebP output.',
        },
        {
            name: 'Download WebP files',
            text: 'Download each converted file individually or use Download All to get a single ZIP archive. All files are deleted from our servers within 1 hour.',
        },
    ],

    tipsTitle: 'PNG to WebP tips',
    tips: [
        { title: 'Test transparency before deploying', text: 'After converting, open the WebP file in a browser to verify the transparent background looks correct. Chrome, Firefox, and Safari all display WebP transparency natively.' },
        { title: 'Use WebP for your site logo', text: 'Logo files in PNG can be surprisingly large. Converting your site logo from PNG to WebP often saves 30–50% — and it loads faster on every page.' },
        { title: 'WordPress 5.8+ supports WebP natively', text: 'No plugin needed. Upload your converted WebP files directly to WordPress Media Library.' },
        { title: 'Use picture element for IE11 fallback', text: "If you need IE11 support (rare), use <picture><source srcset='logo.webp' type='image/webp'><img src='logo.png' alt='Logo'></picture>." },
    ],

    faqHeading: 'PNG to WebP conversion',
    faqs: [
        {
            q: 'Will converting PNG to WebP remove transparency?',
            a: 'No. WebP fully supports alpha channel (transparency), just like PNG. Your transparent backgrounds, logos, and icons are perfectly preserved when converting from PNG to WebP.',
        },
        {
            q: 'Is PNG to WebP conversion lossless?',
            a: 'Shrinkix uses the optimal compression mode based on your image. For graphics with few colours (logos, icons), it applies lossless WebP. For complex images, lossy WebP delivers smaller files with no visible quality difference.',
        },
        {
            q: 'How much smaller will my PNG be after converting to WebP?',
            a: 'On average, PNG files are 26% smaller as WebP in lossless mode. For photos or complex images stored as PNG, the savings can be much higher — up to 50% or more with lossy WebP.',
        },
        {
            q: 'Do all browsers support WebP transparency?',
            a: 'Yes. WebP transparency (alpha channel) is supported in all modern browsers: Chrome, Firefox, Safari 14+, Edge, and Opera. Global WebP support is 97%+ as of 2025.',
        },
        {
            q: 'Can I batch convert PNG files to WebP?',
            a: 'Yes. Drop as many PNG files as you need onto the upload zone. Shrinkix converts all of them simultaneously. Free plan users get 20 conversions per month. Web Pro ($39/mo) handles unlimited files up to 75 MB each.',
        },
        {
            q: 'Should I use WebP or AVIF instead of PNG?',
            a: 'Both are better than PNG for web use. WebP offers 26% savings with 97%+ browser support — it is the safe, practical choice for most sites. AVIF offers higher compression (40–50% savings) with 93–95% browser support. Start with WebP and add AVIF for performance-critical images.',
        },
    ],

    relatedLinks: [
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/jpg-to-webp', label: 'JPG to WebP →' },
        { href: '/convert-to-webp', label: 'All formats to WebP →' },
        { href: '/avif-converter', label: 'Convert to AVIF →' },
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/', label: 'All tools →' },
    ],
};

export default function PngToWebp() {
    return <FormatLandingPage config={config} />;
}
