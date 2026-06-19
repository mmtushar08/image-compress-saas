import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'JPG',
    title: 'Convert JPG to WebP Online — Free | Shrinkix',
    metaDescription: 'Convert JPG images to WebP free online. WebP is 25–35% smaller than JPG with the same quality. Batch convert, no signup, files deleted immediately.',
    canonical: '/jpg-to-webp',
    breadcrumb: 'JPG to WebP',
    heading: 'Convert JPG to WebP — Free Online Converter',
    subheading: 'WebP is 25–35% smaller than JPG at identical quality. Convert in seconds — no signup, no limits on file count, deleted after download.',
    defaultTargetFormats: ['webp'],

    stats: [
        { value: '25–35%', label: 'Smaller than JPG' },
        { value: '97%+', label: 'Browser support (2025)' },
        { value: 'Batch', label: 'Convert multiple at once' },
        { value: 'Free', label: 'No account needed' },
    ],

    definitionTitle: 'Why convert JPG to WebP?',
    definition: 'WebP is a modern image format developed by Google for the web. Converting your JPG images to WebP reduces file size by 25–35% at the same visual quality — no visible difference, but significantly smaller files. Google PageSpeed Insights and Core Web Vitals directly reward serving images in next-gen formats like WebP. Every major browser supports WebP in 2025 (Chrome, Firefox, Safari, Edge — 97%+ global coverage).',
    definitionExtra: "Converting JPG to WebP is one of the top recommendations from Google Lighthouse and PageSpeed Insights. Smaller image files improve your LCP (Largest Contentful Paint) score — a Core Web Vitals metric that directly influences Google search rankings. For a site with 10 product images, switching from JPG to WebP can reduce total page weight by 200–500 KB.",

    howToTitle: 'How to convert JPG to WebP online',
    steps: [
        {
            name: 'Upload your JPG files',
            text: 'Drop your JPG or JPEG images onto the upload zone above. The WebP conversion is pre-selected automatically. You can upload multiple files for batch conversion.',
        },
        {
            name: 'Automatic conversion to WebP',
            text: 'Shrinkix converts each JPG to WebP using the Sharp image engine with effort level 6 — the best compression/speed balance. You see the original size and the converted WebP size side by side.',
        },
        {
            name: 'Download your WebP files',
            text: 'Click the download button for each converted file, or use Download All to get a ZIP of all WebP files. Files are automatically deleted after 1 hour.',
        },
    ],

    tipsTitle: 'JPG to WebP conversion tips',
    tips: [
        { title: 'Use the HTML picture element for browser fallbacks', text: "Despite 97%+ support, serve WebP with a JPG fallback: <picture><source srcset='image.webp' type='image/webp'><img src='image.jpg'></picture>. This ensures all users see your image." },
        { title: 'WebP works for WordPress', text: 'WordPress 5.8+ natively supports WebP. Upload WebP files directly to your media library — no plugin needed.' },
        { title: 'Convert product images first', text: 'E-commerce product images are often the largest files on a page. Converting them from JPG to WebP gives you the biggest performance gain per image.' },
        { title: 'Batch convert your entire image library', text: 'Drag and drop your entire image folder onto Shrinkix. All JPGs are converted to WebP simultaneously, and you can download them all as a single ZIP.' },
    ],

    faqHeading: 'JPG to WebP conversion',
    faqs: [
        {
            q: 'Is JPG to WebP conversion safe? Will you store my files?',
            a: 'No. Your files are processed and immediately queued for deletion. Each download link is a one-time token valid for 1 hour. After download, files are permanently removed from our servers.',
        },
        {
            q: 'Will converting JPG to WebP reduce image quality?',
            a: "No — at the default quality settings (75–85), the converted WebP is visually identical to the original JPG but 25–35% smaller. WebP's compression algorithm is more efficient than JPEG's, meaning better quality at smaller sizes.",
        },
        {
            q: 'Do all browsers support WebP?',
            a: 'Yes. As of 2025, WebP has 97%+ global browser support including Chrome, Firefox, Safari (since version 14), Edge, and Opera. For maximum compatibility, serve WebP with an HTML picture element and a JPG fallback.',
        },
        {
            q: 'Can I convert multiple JPG files to WebP at once?',
            a: 'Yes. Drag and drop as many JPG files as you need. Shrinkix converts all of them simultaneously. Free users get 20 conversions per month. Use Download All to get a ZIP of all converted WebP files.',
        },
        {
            q: 'Will WebP preserve my JPG transparency?',
            a: 'JPG does not support transparency. But if you are converting PNG (which supports transparency) to WebP, transparency is fully preserved. WebP supports alpha channels just like PNG.',
        },
        {
            q: 'Can I convert WebP back to JPG if needed?',
            a: 'Yes. Shrinkix converts in both directions. Upload your WebP files and they will be compressed as WebP by default, or you can select JPG as the output format from the conversion options.',
        },
        {
            q: 'Is WebP better than AVIF?',
            a: 'AVIF is smaller (20–50% smaller than WebP at the same quality) but has slightly less browser support (93–95% vs 97%+). For maximum compatibility, use WebP. For cutting-edge performance, use AVIF with WebP and JPG fallbacks.',
        },
    ],

    relatedLinks: [
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/png-to-webp', label: 'PNG to WebP →' },
        { href: '/convert-to-webp', label: 'All formats to WebP →' },
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/avif-converter', label: 'Convert to AVIF →' },
        { href: '/', label: 'All tools →' },
    ],

    relatedBlogPosts: [
        { slug: 'jpg-vs-webp', title: 'JPG vs WebP: Which Image Format Should You Use?', category: 'Formats', readTime: '5 min' },
        { slug: 'how-to-compress-images-for-web', title: 'How to Compress Images for Web (Without Losing Quality)', category: 'Guide', readTime: '6 min' },
    ],
};

export default function JpgToWebp() {
    return <FormatLandingPage config={config} />;
}
