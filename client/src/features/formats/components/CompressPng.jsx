import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'PNG',
    title: 'Compress PNG Images Online — Free',
    metaDescription: 'Free PNG compressor online. Reduce PNG file size by 40–70% while preserving transparency. Lossless and lossy compression. No signup required.',
    canonical: '/compress-png',
    breadcrumb: 'Compress PNG',
    heading: 'Compress PNG Images Online — Free',
    subheading: 'Reduce PNG file size by 40–70% while keeping sharp edges and transparency. Drag-and-drop, instant results.',
    defaultTargetFormats: [],

    stats: [
        { value: '40–70%', label: 'Average size reduction' },
        { value: '100%', label: 'Transparency preserved' },
        { value: '5 MB', label: 'Max file size (free)' },
        { value: 'Bulk', label: 'Up to 25 files at once' },
    ],

    definitionTitle: 'What is PNG compression?',
    definition: 'PNG (Portable Network Graphics) is a lossless image format designed to replace GIF. It supports full transparency (alpha channel), 24-bit colour, and sharp edges, making it the format of choice for logos, icons, UI screenshots, and graphics with text. Because PNG stores every pixel without discarding data, PNG files are significantly larger than JPEG files for the same image.',
    definitionExtra: 'PNG compression works by removing redundant metadata, optimising the internal filter settings, and — with lossy quantisation — reducing the colour palette while remaining visually identical. Lossless PNG optimisation typically reduces file size by 20–40%. Lossy PNG quantisation (which Shrinkix uses by default) can reduce PNG file size by 40–70% with no visible difference on screen.',

    howToTitle: 'How to compress PNG images online — step by step',
    steps: [
        {
            name: 'Upload your PNG files',
            text: 'Click the upload zone or drag and drop your PNG files. Shrinkix accepts PNG files up to 5 MB each on the free plan, up to 25 files at once.',
        },
        {
            name: 'Automatic PNG compression',
            text: 'Shrinkix applies lossy PNG quantisation to reduce the colour palette from millions of colours to an optimised set, reducing file size by 40–70% with no visible quality loss. Transparency is always preserved.',
        },
        {
            name: 'Download your optimised PNGs',
            text: 'Click the download button on each result, or use "Download All" to save all compressed PNGs as a ZIP file.',
        },
    ],

    tipsTitle: 'PNG optimisation tips',
    tips: [
        { title: 'Use PNG for transparency and sharp edges', text: 'PNG is the right format for logos, icons, UI elements, and screenshots. JPEG is better for photographs — converting photos to PNG only makes them larger.' },
        { title: 'Consider converting to WebP', text: 'WebP handles transparency just like PNG but produces files 26% smaller. For web use, converting your PNG to WebP saves significant bandwidth.' },
        { title: 'Remove unnecessary metadata', text: 'PNG files often contain embedded colour profiles, author data, and timestamps. Shrinkix strips all non-essential metadata, reducing file size without affecting the image.' },
        { title: 'Reduce colour depth for simple graphics', text: 'Icons and simple logos often only use 16–32 colours. Reducing colour depth from 24-bit to 8-bit (256 colours) can cut PNG file size by 50% with no visible difference.' },
        { title: 'Never use PNG for photographs', text: 'Photographs compressed as PNG are 3–10× larger than the same image as JPEG or WebP. Always save photographic content as JPEG or WebP.' },
    ],

    faqHeading: 'PNG compression',
    faqs: [
        {
            q: 'Can I compress a PNG without losing transparency?',
            a: 'Yes. Shrinkix preserves the alpha channel (transparency) in all compressed PNG files. The transparency mask is retained exactly — only redundant colour data is reduced.',
        },
        {
            q: 'What is the difference between lossless and lossy PNG compression?',
            a: 'Lossless PNG optimisation removes metadata and optimises encoding without changing any pixel values — typically 20–40% reduction. Lossy PNG compression (quantisation) reduces the colour palette to fewer colours — achieving 40–70% reduction with no visible difference in most images.',
        },
        {
            q: 'How much smaller can a PNG get after compression?',
            a: 'For logos, icons, and UI graphics: 40–70% reduction with no visible quality loss. For photographic PNGs: consider converting to JPEG or WebP instead — those formats will be 50–80% smaller for the same visual quality.',
        },
        {
            q: 'Should I use PNG or JPEG for my website?',
            a: 'Use PNG for logos, icons, UI screenshots, and any image requiring transparency. Use JPEG for photographs and complex images. Using PNG for photographs makes your site unnecessarily slow — a photograph saved as PNG is typically 3–10× larger than the same image as JPEG.',
        },
        {
            q: 'Can I compress a PNG to under 100 KB?',
            a: 'For most web graphics (logos, icons, UI elements), yes. Simple icons under 100×100px typically compress to under 10 KB. Larger, complex graphics may still be 100–500 KB after compression. For these, consider converting to WebP for even smaller files.',
        },
        {
            q: 'Does compressing a PNG reduce image quality?',
            a: 'With lossy PNG quantisation (Shrinkix\'s default), the colour palette is slightly reduced but the visual result is indistinguishable for most images at normal viewing sizes. Sharp edges and text remain crisp. Transparency is always preserved exactly.',
        },
        {
            q: 'What is the maximum PNG file size I can compress?',
            a: 'Free users can compress PNG files up to 5 MB per file. Pro users can handle files up to 75 MB. For bulk compression of large assets (design exports, icon sets), the Pro plan supports 150 MB per file.',
        },
        {
            q: 'Is it better to use WebP instead of PNG?',
            a: 'For web use, yes — WebP is 26% smaller than PNG at equivalent quality, and supports transparency. All modern browsers (Chrome, Firefox, Safari 14+, Edge) support WebP. Use Shrinkix to convert PNG to WebP in one click.',
        },
    ],

    relatedLinks: [
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/png-to-webp', label: 'PNG to WebP →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/compress-image-to-kb', label: 'Compress to 100 KB →' },
        { href: '/', label: 'All formats →' },
    ],

    relatedBlogPosts: [
        { slug: 'how-to-compress-images-for-web', title: 'How to Compress Images for Web (Without Losing Quality)', category: 'Guide', readTime: '6 min' },
        { slug: 'jpg-vs-webp', title: 'JPG vs WebP: Which Image Format Should You Use?', category: 'Formats', readTime: '5 min' },
    ],
};

export default function CompressPng() {
    return <FormatLandingPage config={config} />;
}
