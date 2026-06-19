import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'image',
    title: 'Batch Image Compressor — Compress Multiple Images Free | Shrinkix',
    metaDescription: 'Compress multiple images at once free online. Batch compress JPG, PNG, WebP, AVIF simultaneously. No signup, files deleted after download. Faster than competitors.',
    canonical: '/batch-image-compressor',
    breadcrumb: 'Batch Image Compressor',
    heading: 'Batch Image Compressor — Compress Multiple Images at Once',
    subheading: 'Upload dozens of JPG, PNG, WebP, or AVIF files and compress them all simultaneously. No queue. No waiting. No signup required.',
    defaultTargetFormats: [],

    stats: [
        { value: 'All', label: 'Files processed in parallel' },
        { value: '4', label: 'Formats supported' },
        { value: '0', label: 'Files stored after download' },
        { value: 'Free', label: 'No account needed' },
    ],

    definitionTitle: 'What is batch image compression?',
    definition: 'Batch image compression means compressing multiple image files in a single operation — instead of uploading and downloading one image at a time. Shrinkix processes all your uploaded images simultaneously in parallel, regardless of how many files you drop in. The result: your entire image library, compressed and ready to download in the time it would take to compress a single file with most tools.',
    definitionExtra: 'Batch compression is essential for e-commerce teams managing product catalogues, designers preparing client deliverables, developers optimising assets before deployment, and content creators uploading images to blogs or social media. Shrinkix supports all four major web image formats — JPG, PNG, WebP, and AVIF — in a single batch operation.',

    howToTitle: 'How to batch compress images online',
    steps: [
        {
            name: 'Select all your images',
            text: 'Drag and drop your entire image folder onto the upload zone, or Ctrl+Click (Cmd+Click on Mac) to select multiple files. Shrinkix accepts JPG, PNG, WebP, and AVIF in any combination.',
        },
        {
            name: 'Parallel compression',
            text: 'Every file is compressed simultaneously — Shrinkix does not queue files one by one. You see results appearing in real time as each file finishes. Compression takes under 2 seconds per image.',
        },
        {
            name: 'Download individually or as ZIP',
            text: 'Download each compressed file with its individual button, or click Download All to receive a single ZIP archive containing all compressed images — ready to deploy.',
        },
    ],

    tipsTitle: 'Batch compression tips for professionals',
    tips: [
        { title: 'Mix formats in a single batch', text: 'Shrinkix handles JPG, PNG, WebP, and AVIF files in the same batch. You do not need separate uploads by format.' },
        { title: 'Enable format conversion for the whole batch', text: 'Turn on the format converter to convert your entire image batch to WebP or AVIF in one step — compress AND convert simultaneously.' },
        { title: 'Use the API for automated batch processing', text: 'Shrinkix offers a developer API. Integrate batch compression directly into your deployment pipeline, CMS, or e-commerce platform without manual uploads.' },
        { title: 'Web Pro handles larger files', text: 'Free plan: 5 MB per file, 20 compressions/month. Web Pro ($39/mo): 75 MB per file, unlimited compressions — ideal for high-resolution photography batches.' },
    ],

    faqHeading: 'batch image compression',
    faqs: [
        {
            q: 'How many images can I compress at once?',
            a: 'There is no hard limit on the number of files per upload session. Free plan users have 20 compressions per month total. Web Pro ($39/mo) offers unlimited compressions. Drop as many files as you need into the upload zone.',
        },
        {
            q: 'Are all files compressed at the same time?',
            a: 'Yes. Shrinkix processes all uploaded files in parallel — not sequentially. You see results appear in real time as each file finishes. There is no queue.',
        },
        {
            q: 'Which image formats can I batch compress?',
            a: 'Shrinkix supports JPG, PNG, WebP, and AVIF — and you can mix all four formats in a single batch upload.',
        },
        {
            q: 'Can I batch convert formats AND compress at the same time?',
            a: 'Yes. Enable the format conversion option in the upload zone before uploading. You can batch compress your images AND convert them all to WebP or AVIF in a single operation.',
        },
        {
            q: 'Do you store my batch images?',
            a: 'No. Each compressed file is tied to a one-time download token that expires after 1 hour. Files are permanently deleted after download or expiry. We never retain your images.',
        },
        {
            q: 'Can I automate batch compression for my website?',
            a: 'Yes. The Shrinkix API supports programmatic batch compression. You can integrate it into your build pipeline, WordPress, Shopify, or any CMS. See the developer documentation for API details.',
        },
        {
            q: 'What is the biggest file size for batch compression?',
            a: 'Free plan: up to 5 MB per file. Web Pro ($39/mo): up to 75 MB per file. Web Ultra ($59/mo): up to 150 MB per file — suitable for high-resolution RAW-quality images.',
        },
    ],

    relatedLinks: [
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/jpg-to-webp', label: 'JPG to WebP →' },
        { href: '/developers', label: 'Developer API →' },
    ],
};

export default function BatchImageCompressor() {
    return <FormatLandingPage config={config} />;
}
