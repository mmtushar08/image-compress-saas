import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'AVIF',
    title: 'Compress AVIF Images Online — Free',
    metaDescription: 'Free AVIF compressor online. AVIF offers 50% smaller files than JPEG at the same quality. Compress or convert images to AVIF. No signup needed.',
    canonical: '/compress-avif',
    breadcrumb: 'Compress AVIF',
    heading: 'Compress AVIF Images Online — Free',
    subheading: 'AVIF is the most efficient image format available — 50% smaller than JPEG. Compress or convert to AVIF instantly.',
    defaultTargetFormats: [],

    stats: [
        { value: '50%', label: 'Smaller than JPEG' },
        { value: '20%', label: 'Smaller than WebP' },
        { value: '2020', label: 'Format released (modern)' },
        { value: 'Free', label: 'No account needed' },
    ],

    definitionTitle: 'What is AVIF image compression?',
    definition: 'AVIF (AV1 Image File Format) is a modern open-source image format based on the AV1 video codec, developed by the Alliance for Open Media. It was finalised in 2019 and achieves outstanding compression: AVIF files are typically 50% smaller than JPEG and 20% smaller than WebP at the same perceived visual quality. Like WebP, AVIF supports both lossy and lossless compression, transparency (alpha channel), wide colour gamut (HDR), and animation.',
    definitionExtra: 'As of 2024, AVIF is supported in Chrome 85+, Firefox 93+, Safari 16+, and Edge 121+. For maximum performance, serve AVIF as the primary source in a <picture> element with WebP and JPEG fallbacks. Shrinkix compresses and converts AVIF files alongside JPEG, PNG, and WebP.',

    howToTitle: 'How to compress AVIF images online',
    steps: [
        {
            name: 'Upload your AVIF files',
            text: 'Drop your AVIF images onto the upload zone above, or click to browse. Shrinkix also accepts JPEG, PNG, and WebP — you can convert any of these to AVIF.',
        },
        {
            name: 'Automatic AVIF compression',
            text: 'Shrinkix compresses your AVIF at optimal quality settings, reducing file size while maintaining visual fidelity. Compression results show the original size, new size, and percentage saved.',
        },
        {
            name: 'Download optimised AVIF images',
            text: 'Download each file individually or click "Download All" for a ZIP of all compressed AVIF images.',
        },
    ],

    tipsTitle: 'AVIF implementation tips for web developers',
    tips: [
        {
            title: 'Use <picture> with AVIF, WebP, and JPEG',
            text: 'Serve the most efficient format each browser supports: <picture><source srcset="img.avif" type="image/avif"><source srcset="img.webp" type="image/webp"><img src="img.jpg" alt="..."></picture>',
        },
        {
            title: 'AVIF encoding is slow — use a CDN',
            text: 'AVIF encoding is 5–10× slower than JPEG or WebP. For production, encode AVIF files once during your build pipeline and serve them from a CDN. Don\'t encode on-the-fly for every request.',
        },
        {
            title: 'AVIF is best for photographs',
            text: 'AVIF\'s compression advantage is most pronounced on photographs and complex images. For simple graphics and logos, WebP lossless or PNG are simpler to work with.',
        },
        {
            title: 'Check browser support before defaulting to AVIF',
            text: 'Safari added AVIF support only in version 16 (September 2022). Users on older iPhones/Macs may not see AVIF. Always provide a WebP or JPEG fallback.',
        },
        {
            title: 'AVIF supports HDR and wide colour gamut',
            text: 'AVIF is one of the few web image formats supporting HDR (High Dynamic Range) images. This makes it the preferred format for modern photography portfolios and e-commerce on HDR-capable displays.',
        },
    ],

    faqHeading: 'AVIF compression',
    faqs: [
        {
            q: 'What is AVIF and how does it compare to JPEG?',
            a: 'AVIF (AV1 Image File Format) is a modern image format based on the AV1 video codec. At the same visual quality, AVIF files are approximately 50% smaller than JPEG and 20% smaller than WebP. It supports transparency, HDR, wide colour gamut, and animation.',
        },
        {
            q: 'Does every browser support AVIF?',
            a: 'Chrome 85+ (2020), Firefox 93+ (2021), Edge 121+ (2024), and Safari 16+ (2022) support AVIF. Internet Explorer does not. Always use a <picture> element with WebP and JPEG fallbacks to ensure all users see your images.',
        },
        {
            q: 'Is AVIF better than WebP?',
            a: 'AVIF typically achieves 20% better compression than WebP at the same quality. However, AVIF has slightly lower browser support (older Safari and some Android browsers don\'t support it) and much slower encoding time. For most sites, WebP is the practical first choice; AVIF is worth adding as a secondary source.',
        },
        {
            q: 'Can AVIF have a transparent background?',
            a: 'Yes. AVIF supports alpha channel transparency, just like PNG and WebP. A transparent AVIF is typically 20% smaller than an equivalent WebP and significantly smaller than PNG.',
        },
        {
            q: 'How do I use AVIF on my website with a fallback?',
            a: 'Use the <picture> element: <picture><source srcset="image.avif" type="image/avif"><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="description"></picture>. Browsers download only the first format they support.',
        },
        {
            q: 'Is AVIF supported in Next.js?',
            a: 'Yes. Next.js (13+) automatically generates and serves AVIF via the next/image component. Configure it in next.config.js: formats: [\'image/avif\', \'image/webp\'].',
        },
        {
            q: 'What quality setting should I use for AVIF?',
            a: 'AVIF quality scales differently than JPEG. Quality 60–75 in AVIF is visually equivalent to JPEG quality 85–95 but produces much smaller files. Start at quality 70 and compare visually with the original.',
        },
        {
            q: 'Can Shrinkix compress or convert AVIF images?',
            a: 'Yes. Shrinkix compresses AVIF images and also converts JPEG, PNG, and WebP to AVIF. Upload any supported format and enable the AVIF conversion option in the upload zone.',
        },
    ],

    relatedLinks: [
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/avif-converter', label: 'AVIF Converter →' },
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-image-to-kb', label: 'Compress to 100 KB →' },
        { href: '/', label: 'All formats →' },
    ],

    relatedBlogPosts: [
        { slug: 'what-is-avif', title: 'What Is AVIF? The Next-Gen Image Format Explained', category: 'Formats', readTime: '5 min' },
        { slug: 'jpg-vs-webp', title: 'JPG vs WebP: Which Image Format Should You Use?', category: 'Formats', readTime: '5 min' },
    ],
};

export default function CompressAvif() {
    return <FormatLandingPage config={config} />;
}
