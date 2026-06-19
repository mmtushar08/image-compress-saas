import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'JPG',
    title: 'Compress JPG Images Online — Free | Shrinkix',
    metaDescription: 'Compress JPG files by 60–80% online, free. No signup. MozJPEG engine. Files deleted after download. Batch compress multiple JPGs at once.',
    canonical: '/compress-jpg',
    breadcrumb: 'Compress JPG',
    heading: 'Compress JPG Images — Free, Fast, Private',
    subheading: 'Shrink JPG file sizes by 60–80% with no visible quality loss. Drag, drop, download. Files are deleted immediately after processing.',
    defaultTargetFormats: [],

    stats: [
        { value: '60–80%', label: 'Average size reduction' },
        { value: '< 2s', label: 'Compression speed' },
        { value: '0', label: 'Files stored on servers' },
        { value: '20/mo', label: 'Free plan compressions' },
    ],

    definitionTitle: 'What is JPG compression?',
    definition: 'JPG (also written JPEG) is the most common format for photos and complex images on the web. JPG uses lossy compression — it removes data the human eye cannot detect, producing dramatically smaller files. At quality 75–85, a compressed JPG is visually identical to the original but 60–80% smaller. This is one of the highest-impact optimisations you can make for web performance.',
    definitionExtra: "Google's Core Web Vitals algorithm measures LCP (Largest Contentful Paint) — how fast your main image loads. Oversized JPG files are one of the top causes of poor LCP scores. Compressing your JPGs with Shrinkix reduces bandwidth, speeds up page loads, and can directly improve your Google ranking.",

    howToTitle: 'How to compress JPG images online',
    steps: [
        {
            name: 'Upload your JPG files',
            text: 'Drag and drop your JPG or JPEG files onto the upload zone, or click to browse. Shrinkix processes up to 20 files simultaneously on the free plan.',
        },
        {
            name: 'Automatic compression',
            text: 'Shrinkix uses MozJPEG — the same engine used by Facebook and Mozilla — to compress each JPG at the optimal quality setting (75–85). You see original size, compressed size, and savings for every file.',
        },
        {
            name: 'Download your compressed JPGs',
            text: 'Click download next to each result, or hit Download All for a ZIP archive. Your original files are never modified — we always delete compressed files after 1 hour.',
        },
    ],

    tipsTitle: 'JPG compression tips',
    tips: [
        { title: 'Quality 75–85 is the sweet spot', text: 'This range produces files that are visually identical to 100% quality but 60–80% smaller. Going above quality 90 wastes bandwidth with no perceptible benefit.' },
        { title: 'Switch to WebP for even smaller files', text: 'WebP is 25–35% smaller than JPG at the same quality, with 97%+ browser support in 2025. Convert your JPGs to WebP with Shrinkix for maximum performance.' },
        { title: 'Never re-compress a JPG', text: 'Each round of JPG compression multiplies quality loss. Compress from the original once, then distribute the compressed version.' },
        { title: 'Compress before uploading to your CMS', text: 'WordPress, Shopify, and Wix re-encode images on upload. Start with a compressed JPG to ensure the smallest possible final output.' },
    ],

    faqHeading: 'JPG compression',
    faqs: [
        {
            q: 'Is my JPG file safe? Do you store it?',
            a: 'No. Your files are never stored on our servers. Each compressed file is tied to a one-time download token that expires after 1 hour. After you download, the file is permanently deleted.',
        },
        {
            q: 'How much can I compress a JPG without losing quality?',
            a: 'At quality 75–85, JPEG compression reduces file size by 60–80% with no visible quality loss. The human eye cannot distinguish a JPG at quality 80 from the original under normal viewing conditions.',
        },
        {
            q: 'Can I compress multiple JPG files at once?',
            a: 'Yes. Shrinkix supports batch JPG compression. Drag and drop multiple files and they are all processed simultaneously. Free plan users get 20 compressions per month. Web Pro ($39/mo) offers unlimited compressions up to 75 MB per file.',
        },
        {
            q: 'JPG vs JPEG — what is the difference?',
            a: '.jpg and .jpeg are the same format — JPEG. The name difference is historical: early Windows only allowed 3-character file extensions, so .jpeg became .jpg. They are identical in every technical way.',
        },
        {
            q: 'Should I use JPG or WebP for my website?',
            a: 'WebP for maximum performance. WebP is 25–35% smaller than JPG at the same quality, with 97%+ browser support in 2025. Use the HTML picture element to serve WebP with a JPG fallback for older browsers. Shrinkix converts JPG to WebP in one click.',
        },
        {
            q: 'Does Shrinkix remove EXIF metadata from JPGs?',
            a: 'By default, Shrinkix strips metadata to produce the smallest possible file. If you need to preserve GPS, copyright, or camera data, enable the metadata preservation option before compression.',
        },
        {
            q: 'What is the maximum JPG file size for the free plan?',
            a: 'Free users can compress JPG files up to 5 MB per file, with 20 compressions per month. Web Pro ($39/mo) handles files up to 75 MB with unlimited monthly compressions. Web Ultra ($59/mo) handles up to 150 MB.',
        },
    ],

    relatedLinks: [
        { href: '/compress-jpeg', label: 'Compress JPEG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/jpg-to-webp', label: 'JPG to WebP →' },
        { href: '/convert-to-webp', label: 'Convert to WebP →' },
        { href: '/batch-image-compressor', label: 'Batch Compress →' },
        { href: '/', label: 'All tools →' },
    ],
};

export default function CompressJpg() {
    return <FormatLandingPage config={config} />;
}
