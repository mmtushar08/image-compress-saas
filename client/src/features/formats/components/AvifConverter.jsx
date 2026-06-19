import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'AVIF',
    title: 'AVIF Converter — Convert Images to AVIF Online Free | Shrinkix',
    metaDescription: 'Convert JPG, PNG, or WebP to AVIF online free. AVIF is 50% smaller than JPEG and 20-50% smaller than WebP. No signup, files deleted immediately.',
    canonical: '/avif-converter',
    breadcrumb: 'AVIF Converter',
    heading: 'AVIF Converter — Convert Images to the Smallest Web Format',
    subheading: 'AVIF is 50% smaller than JPEG and up to 50% smaller than WebP at the same quality. Convert your images to AVIF free — no signup required.',
    defaultTargetFormats: ['avif'],

    stats: [
        { value: '50%', label: 'Smaller than JPEG' },
        { value: '20–50%', label: 'Smaller than WebP' },
        { value: '93%+', label: 'Browser support (2025)' },
        { value: 'Free', label: 'No account needed' },
    ],

    definitionTitle: 'What is AVIF and why convert to it?',
    definition: 'AVIF (AV1 Image File Format) is the most efficient mainstream image format available in 2025. Based on the AV1 video codec, AVIF achieves outstanding compression: files are typically 50% smaller than JPEG and 20–50% smaller than WebP at the same perceived visual quality. AVIF supports both lossy and lossless compression, transparency (alpha channel), HDR (wide colour gamut), and animation. It was developed by the Alliance for Open Media — the same consortium behind AV1 video.',
    definitionExtra: 'Browser support for AVIF reached 93–95% globally in 2025 (Chrome 85+, Firefox 93+, Safari 16+, Edge 121+). For production use, serve AVIF as the primary source with WebP and JPEG fallbacks using the HTML picture element. Shrinkix converts JPG, PNG, and WebP to AVIF — and handles the compression in one step.',

    howToTitle: 'How to convert images to AVIF online',
    steps: [
        {
            name: 'Upload your images',
            text: 'Drop JPG, PNG, or WebP files onto the upload zone above. AVIF conversion is pre-selected. You can convert multiple files in a single batch.',
        },
        {
            name: 'AVIF conversion and compression',
            text: 'Shrinkix converts each image to AVIF using effort level 6 — balancing maximum compression with reasonable speed. You see the original size and the AVIF output size for each file.',
        },
        {
            name: 'Download your AVIF files',
            text: 'Download individual AVIF files or use Download All for a ZIP archive. All files are deleted from our servers within 1 hour of processing.',
        },
    ],

    tipsTitle: 'AVIF deployment tips',
    tips: [
        { title: 'Always use fallbacks in production', text: "Use the HTML picture element: <picture><source srcset='image.avif' type='image/avif'><source srcset='image.webp' type='image/webp'><img src='image.jpg'></picture>. This ensures all users see your image regardless of browser." },
        { title: 'AVIF vs WebP: choose based on audience', text: 'If your users are on modern browsers (Chrome, Safari, Firefox), AVIF gives the best compression. For wider compatibility, WebP is the safer choice. For maximum coverage, serve both with fallbacks.' },
        { title: 'AVIF is ideal for hero images', text: 'Large, above-the-fold images benefit most from AVIF compression. A hero image that was 300 KB as JPG might be 120 KB as AVIF — a 60% reduction that dramatically improves LCP.' },
        { title: 'Test with Google PageSpeed Insights', text: "After deploying AVIF images, run PageSpeed Insights. You should see the 'Serve images in next-gen formats' recommendation disappear and your LCP score improve." },
    ],

    faqHeading: 'AVIF image conversion',
    faqs: [
        {
            q: 'Is AVIF better than WebP?',
            a: 'AVIF achieves 20–50% better compression than WebP at the same quality, making it the most efficient mainstream format. However, WebP has slightly broader browser support (97%+ vs 93–95%). For best results, serve AVIF with WebP and JPEG fallbacks using the HTML picture element.',
        },
        {
            q: 'Which browsers support AVIF?',
            a: 'AVIF is supported in Chrome 85+, Firefox 93+, Safari 16+, and Edge 121+. As of 2025, this covers approximately 93–95% of global web traffic. Use the picture element with fallbacks to support remaining browsers.',
        },
        {
            q: 'Does AVIF support transparency?',
            a: 'Yes. AVIF supports alpha channels (transparency) just like PNG and WebP. You can convert transparent PNG files to AVIF without any loss of transparency.',
        },
        {
            q: 'Are my files safe? Do you store them?',
            a: 'No. Files are processed and immediately queued for deletion. Each download link is a one-time token valid for 1 hour. After download or expiry, files are permanently removed. We never store, analyse, or share your images.',
        },
        {
            q: 'Can I convert multiple files to AVIF at once?',
            a: 'Yes. Upload multiple JPG, PNG, or WebP files and Shrinkix converts them all to AVIF simultaneously. Free plan: 20 conversions per month. Web Pro ($39/mo): unlimited, up to 75 MB per file.',
        },
        {
            q: 'Is AVIF compression slow?',
            a: 'AVIF encoding is more computationally intensive than JPEG or WebP. On large images, encoding can take a few seconds longer. Shrinkix balances compression level and speed for near-instant results on typical web images.',
        },
        {
            q: 'Should I replace all my JPEGs with AVIF?',
            a: 'For web images, yes — where browser support allows. Use the picture element pattern: AVIF first, WebP second, JPEG fallback. This delivers maximum compression for modern browsers and guaranteed compatibility for all users.',
        },
    ],

    relatedLinks: [
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/jpg-to-webp', label: 'JPG to WebP →' },
        { href: '/png-to-webp', label: 'PNG to WebP →' },
        { href: '/convert-to-webp', label: 'All formats to WebP →' },
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/', label: 'All tools →' },
    ],
};

export default function AvifConverter() {
    return <FormatLandingPage config={config} />;
}
