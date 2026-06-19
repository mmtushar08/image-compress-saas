import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'JPEG',
    title: 'Compress JPEG Images Online — Free',
    metaDescription: 'Free online JPEG compressor. Reduce JPG file size by 60–80% without visible quality loss. Bulk compression, no signup, files deleted after processing.',
    canonical: '/compress-jpeg',
    breadcrumb: 'Compress JPEG',
    heading: 'Compress JPEG Images Online — Free',
    subheading: 'Reduce JPG file size by 60–80% instantly. No signup required. Files are never stored on our servers.',
    defaultTargetFormats: [],

    stats: [
        { value: '60–80%', label: 'Average size reduction' },
        { value: '< 2s', label: 'Compression speed' },
        { value: '5 MB', label: 'Max file size (free)' },
        { value: '20/mo', label: 'Free plan compressions' },
    ],

    definitionTitle: 'What is JPEG compression?',
    definition: 'JPEG (Joint Photographic Experts Group) is the most widely used image format for photographs and complex images on the web. JPEG uses lossy compression, meaning it discards some image data to achieve smaller file sizes. At quality settings between 75 and 85, the human eye cannot distinguish a compressed JPEG from the original — yet the file is 60–80% smaller. This makes JPEG compression one of the most impactful optimisations you can make for website performance.',
    definitionExtra: 'Large JPEG files are one of the leading causes of slow page load times. Google\'s Core Web Vitals measure how fast images load (LCP — Largest Contentful Paint), and oversized JPEGs directly hurt your score. Compressing your JPEGs with Shrinkix reduces bandwidth usage, improves load times, and can meaningfully improve your Google ranking.',

    howToTitle: 'How to compress JPEG images online',
    steps: [
        {
            name: 'Upload your JPEG files',
            text: 'Click the upload zone above or drag and drop your JPG or JPEG files. Shrinkix accepts multiple files at once. Free plan users get 20 compressions per month, up to 5 MB each.',
        },
        {
            name: 'Automatic compression',
            text: 'Shrinkix instantly compresses each JPEG using advanced lossy compression at optimal quality (75–85). You\'ll see the original size, compressed size, and percentage saved for each file.',
        },
        {
            name: 'Download compressed files',
            text: 'Click the download button next to each result, or hit "Download All" to get a ZIP archive of all compressed JPEGs in one click.',
        },
    ],

    tipsTitle: 'JPEG compression tips for web developers',
    tips: [
        { title: 'Use quality 75–85 for photographs', text: 'This range is visually identical to 100% quality but produces files 60–80% smaller. Quality above 90 wastes bandwidth with no visible improvement.' },
        { title: 'JPEG vs PNG: choose the right format', text: 'Use JPEG for photographs, product shots, and complex images. Use PNG for logos, icons, and images with transparency. Converting PNG photos to JPEG can save 50–70%.' },
        { title: 'Serve WebP instead of JPEG where possible', text: 'WebP is 25–35% smaller than JPEG at the same quality. Use the <picture> element with WebP as primary source and JPEG as fallback for older browsers.' },
        { title: 'Compress before uploading to CMS', text: 'WordPress, Shopify, and other CMS platforms re-encode images on upload, but starting with a compressed JPEG gives you smaller final files and faster admin panels.' },
        { title: 'Check progressive JPEG for large images', text: 'Progressive JPEGs load blurry-to-sharp, giving users a faster perceived load time on slow connections. Shrinkix outputs progressive JPEGs by default.' },
    ],

    faqHeading: 'JPEG compression',
    faqs: [
        {
            q: 'How much can I compress a JPEG without losing quality?',
            a: 'At a quality setting of 75–85, JPEG compression reduces file size by 60–80% with no visible quality loss. The human eye cannot distinguish a JPEG at quality 80 from the original in normal viewing conditions. Quality below 70 starts to show compression artifacts (blocky edges and color banding).',
        },
        {
            q: 'Does compressing a JPEG damage the image permanently?',
            a: 'Yes — JPEG is a lossy format, so once compressed, some data is permanently discarded. However, at quality 75–85, the visual difference is imperceptible. Always keep the original file before compressing. Never re-compress a JPEG multiple times, as each round multiplies the quality loss.',
        },
        {
            q: 'What is the best JPEG quality setting for websites?',
            a: 'For web use, quality 75–85 is the sweet spot. This produces files that are visually identical to the original but 60–80% smaller. For photographs where detail matters (portfolio sites, product photography), use quality 85. For blog images and thumbnails, quality 75 is sufficient.',
        },
        {
            q: 'Can I compress JPEG without Photoshop?',
            a: 'Yes. Shrinkix is a free online JPEG compressor — no Photoshop, no software download, no account required. Upload your JPEG, and it\'s compressed and ready to download in seconds.',
        },
        {
            q: 'Can I compress multiple JPEGs at once?',
            a: 'Yes. Shrinkix supports bulk JPEG compression. Drag and drop multiple files at once. Free plan users get 20 compressions per month (up to 5 MB per file). Web Pro ($39/mo) offers unlimited compressions up to 75 MB per file. Use "Download All" to get all compressed JPEGs as a ZIP.',
        },
        {
            q: 'Does compressing JPEG images improve SEO?',
            a: 'Yes, directly. Google\'s Core Web Vitals include LCP (Largest Contentful Paint), which measures how fast your main image loads. Oversized JPEGs are one of the most common causes of poor LCP scores. Smaller JPEGs load faster, improving LCP, and with it, your Google ranking.',
        },
        {
            q: 'Should I use JPEG or WebP for my website?',
            a: 'For maximum performance, use WebP with a JPEG fallback. WebP is 25–35% smaller than JPEG at the same quality, and all modern browsers support it. Shrinkix can convert your JPEGs to WebP. Use the <picture> element: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg"></picture>.',
        },
        {
            q: 'What is the maximum JPEG file size Shrinkix can compress?',
            a: 'Free users can compress JPEG files up to 5 MB per file, with 20 compressions per month. Web Pro ($39/mo) handles files up to 75 MB with unlimited compressions. Web Ultra ($59/mo) handles up to 150 MB per file.',
        },
    ],

    relatedLinks: [
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/convert-to-webp', label: 'Convert to WebP →' },
        { href: '/compress-image-to-kb', label: 'Compress to 100 KB →' },
        { href: '/', label: 'All formats →' },
    ],
};

export default function CompressJpeg() {
    return <FormatLandingPage config={config} />;
}
