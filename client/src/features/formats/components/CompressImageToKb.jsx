import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'image',
    title: 'Compress Image to 100 KB — Free Online',
    metaDescription: 'Compress any image to under 100 KB, 200 KB, or 1 MB online. Free image size reducer for email, government forms, social media, and web. No signup.',
    canonical: '/compress-image-to-kb',
    breadcrumb: 'Compress to 100 KB',
    heading: 'Compress Image File Size Online — Free',
    subheading: 'Reduce image size to under 100 KB, 200 KB, or 1 MB. Works for email attachments, government forms, social media uploads, and web performance.',
    defaultTargetFormats: [],

    stats: [
        { value: '60–80%', label: 'Typical size reduction' },
        { value: 'PNG, JPG', label: 'WebP, AVIF supported' },
        { value: 'Free', label: 'No account needed' },
        { value: '25 files', label: 'Bulk compression' },
    ],

    definitionTitle: 'Why do file size limits matter for images?',
    definition: 'Many platforms impose strict image file size limits: government portals typically require documents under 200 KB, email services have attachment limits of 10–25 MB, WhatsApp compresses images above 16 MB, and social platforms like Instagram recommend images under 1 MB for fastest upload. Oversized images are also the leading cause of slow websites — Google\'s Lighthouse tool flags images over 100 KB as "opportunities to reduce page load time."',
    definitionExtra: 'Shrinkix compresses images by removing redundant data and optimising encoding without visibly reducing quality. For most web photos, Shrinkix achieves 60–80% compression automatically. A 1 MB JPEG typically compresses to 150–300 KB. A 500 KB PNG typically compresses to 100–200 KB. For the smallest possible file, convert to WebP — it is 25–35% smaller than JPEG at the same quality.',

    howToTitle: 'How to compress an image to a smaller file size',
    steps: [
        {
            name: 'Upload your image',
            text: 'Click the upload zone above or drag and drop any JPEG, PNG, WebP, or AVIF image. Free users can upload files up to 5 MB each.',
        },
        {
            name: 'Automatic size reduction',
            text: 'Shrinkix compresses your image using the optimal algorithm for the format. You\'ll see the original file size, the new file size, and the percentage saved. Most images compress by 60–80%.',
        },
        {
            name: 'Download and check the size',
            text: 'Download the compressed image and check the file size. If you need it smaller, try converting to WebP (smaller format) or JPEG (smaller than PNG for photographs).',
        },
    ],

    tipsTitle: 'Tips for hitting specific file size targets',
    tips: [
        {
            title: 'Need under 100 KB? Convert to WebP or JPEG',
            text: 'For photographs, convert to JPEG at quality 75–80. For graphics, compress the PNG. For the smallest file, convert to WebP. Most web images under 800×600px can reach under 100 KB.',
        },
        {
            title: 'Need under 200 KB for a government form?',
            text: 'Government portals typically accept JPEG or PNG under 200 KB. Compress your image with Shrinkix — a typical ID scan or document photo easily compresses to under 100 KB.',
        },
        {
            title: 'Image dimensions matter as much as format',
            text: 'A 4000×3000px JPEG from a smartphone camera is 4–8 MB. Resize it to 800×600px before compressing — the file will be 95% smaller regardless of format.',
        },
        {
            title: 'Profile photos: aim for under 200 KB',
            text: 'LinkedIn, Twitter/X, and most social platforms resize profile photos on upload. However, uploading a smaller file speeds up the upload and avoids double-compression artifacts.',
        },
        {
            title: 'WhatsApp and Telegram image sharing',
            text: 'WhatsApp compresses images automatically on send. To share at original quality, use "Send as Document" instead of "Send as Photo" — this bypasses WhatsApp\'s recompression.',
        },
    ],

    faqHeading: 'image size compression',
    faqs: [
        {
            q: 'How do I compress an image to under 100 KB?',
            a: 'Upload your image to Shrinkix. For photographs, Shrinkix will typically reduce a 1 MB JPEG to 100–300 KB automatically. To get under 100 KB: (1) make sure the image dimensions are appropriate (under 1000×1000px for most uses), (2) use JPEG format for photographs, (3) convert to WebP for the smallest possible file.',
        },
        {
            q: 'What is the maximum image file size for email?',
            a: 'Gmail, Outlook, and Yahoo Mail allow attachments up to 25 MB. However, many corporate email servers reject emails over 10 MB. Best practice is to keep email image attachments under 1 MB. Inline images (embedded in HTML email) should be under 200 KB.',
        },
        {
            q: 'How do I reduce image size for a government website upload?',
            a: 'Most government portals accept JPEG or PNG under 200 KB or 500 KB. Upload your image to Shrinkix — a scanned document or ID photo typically compresses from 2–5 MB down to under 200 KB with no visible quality loss.',
        },
        {
            q: 'Does Shrinkix let me set an exact target file size?',
            a: 'Shrinkix uses intelligent compression rather than a fixed size target — it compresses as small as possible while preserving quality. For most images, the result will be under your target. If you need a smaller result, try converting to WebP or JPEG.',
        },
        {
            q: 'What is the maximum file size for Instagram?',
            a: 'Instagram accepts images up to 8 MB. However, Instagram re-compresses images on upload, so starting with a well-compressed JPEG or WebP (under 1 MB) gives you better final quality than uploading a huge original that Instagram degrades.',
        },
        {
            q: 'Does reducing file size reduce image dimensions?',
            a: 'No. Shrinkix reduces file size through compression — it does not change the width or height of your image. A 1920×1080px image stays 1920×1080px; only the number of bytes changes.',
        },
        {
            q: 'What is the best image format for small file sizes?',
            a: 'For the smallest file size: (1) AVIF is the most efficient but has limited browser support, (2) WebP is 25–35% smaller than JPEG and widely supported, (3) JPEG is best for photographs, (4) PNG is largest but necessary for transparency and sharp edges.',
        },
        {
            q: 'How do I compress an image for WhatsApp?',
            a: 'WhatsApp automatically compresses images sent as photos. To share at original quality, send as a document. If you want to reduce size before sending, use Shrinkix to compress the JPEG — aim for under 500 KB for fast delivery.',
        },
    ],

    relatedLinks: [
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/batch-image-compressor', label: 'Batch Compressor →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/', label: 'All formats →' },
    ],

    relatedBlogPosts: [
        { slug: 'how-to-compress-images-for-web', title: 'How to Compress Images for Web (Without Losing Quality)', category: 'Guide', readTime: '6 min' },
        { slug: 'jpg-vs-webp', title: 'JPG vs WebP: Which Image Format Should You Use?', category: 'Formats', readTime: '5 min' },
    ],
};

export default function CompressImageToKb() {
    return <FormatLandingPage config={config} />;
}
