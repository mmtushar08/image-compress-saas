import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'WebP',
    title: 'Compress WebP Images Online — Free',
    metaDescription: 'Free WebP compressor online. Reduce WebP file size while keeping sharp quality. Also convert JPEG and PNG to WebP for 25–35% smaller files.',
    canonical: '/compress-webp',
    breadcrumb: 'Compress WebP',
    heading: 'Compress WebP Images Online — Free',
    subheading: 'Reduce WebP file size instantly. Or convert JPEG and PNG to WebP for maximum compression. No signup, files never stored.',
    defaultTargetFormats: [],

    stats: [
        { value: '25–35%', label: 'Smaller than JPEG' },
        { value: '26%', label: 'Smaller than PNG' },
        { value: '95%+', label: 'Global browser support' },
        { value: 'Bulk', label: 'Multiple files at once' },
    ],

    definitionTitle: 'What is WebP and why should you use it?',
    definition: 'WebP is a modern image format developed by Google, released in 2010 and now supported by all major browsers — Chrome, Firefox, Safari 14+, and Edge. It provides both lossy and lossless compression in a single format and supports transparency (alpha channel), making it a replacement for both JPEG and PNG. At the same visual quality, WebP files are 25–35% smaller than JPEG and 26% smaller than PNG.',
    definitionExtra: 'Google has confirmed that page speed is a ranking factor, and WebP images are one of the most effective ways to improve Core Web Vitals scores. Switching from JPEG to WebP can improve LCP (Largest Contentful Paint) by 200–500ms on image-heavy pages. Shrinkix compresses existing WebP files further, or converts your JPEG/PNG images to WebP in a single click.',

    howToTitle: 'How to compress WebP images online',
    steps: [
        {
            name: 'Upload your images',
            text: 'Click the upload zone or drag and drop your WebP, JPEG, or PNG files. To convert to WebP, enable the "Convert to WebP" toggle in the upload zone.',
        },
        {
            name: 'Compression and conversion',
            text: 'Shrinkix compresses the WebP using optimal quality settings, or converts JPEG/PNG to WebP at quality 82 — visually identical to JPEG quality 85 but 25–35% smaller.',
        },
        {
            name: 'Download your WebP files',
            text: 'Download each file individually or use "Download All" to save all optimised WebP images as a ZIP archive.',
        },
    ],

    tipsTitle: 'How to use WebP on your website',
    tips: [
        {
            title: 'Use the <picture> element for backwards compatibility',
            text: 'Serve WebP to modern browsers and JPEG/PNG as fallback: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="..."></picture>',
        },
        {
            title: 'WebP supports both photos and graphics',
            text: 'Unlike JPEG (photos only) or PNG (graphics with transparency), WebP handles both. Use WebP as your single format for all image types on the web.',
        },
        {
            title: 'WebP for email: use with caution',
            text: 'Email clients have inconsistent WebP support — Outlook does not support WebP. Use JPEG or PNG for email images.',
        },
        {
            title: 'Next.js and WebP: automatic with next/image',
            text: 'If you use Next.js, the built-in next/image component automatically serves WebP to supported browsers. You don\'t need to manually convert.',
        },
        {
            title: 'Check WebP support before serving',
            text: 'Use the Accept header on the server: if the browser sends "Accept: image/webp", serve WebP. Otherwise serve JPEG/PNG.',
        },
    ],

    faqHeading: 'WebP compression',
    faqs: [
        {
            q: 'Is WebP better than JPEG?',
            a: 'For web use, yes. WebP is 25–35% smaller than JPEG at the same visual quality. It also supports transparency (unlike JPEG), both lossy and lossless compression, and animated images (unlike JPEG). The main downside is that older software (Photoshop pre-2022, Outlook) doesn\'t support WebP.',
        },
        {
            q: 'Does every browser support WebP?',
            a: 'Yes, as of 2023. Chrome, Firefox, Safari 14+, Edge, Opera, and Samsung Internet all support WebP. WebP now covers over 95% of global browser usage. Use the <picture> element with a JPEG/PNG fallback for the remaining 5%.',
        },
        {
            q: 'Can WebP have a transparent background?',
            a: 'Yes. WebP supports alpha channel transparency, just like PNG. A transparent WebP is typically 26% smaller than an equivalent transparent PNG. This makes WebP ideal for logos and icons on the web.',
        },
        {
            q: 'What quality should I use for WebP?',
            a: 'Quality 75–85 is the standard range for lossy WebP. Quality 80 is visually equivalent to JPEG quality 85 but 25–35% smaller. For lossless WebP (graphics, logos), use lossless compression — it\'s always smaller than equivalent PNG.',
        },
        {
            q: 'How do I add WebP images in HTML?',
            a: 'Use the <picture> element: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="description"></picture>. Modern browsers load the WebP source; older browsers fall back to the JPEG.',
        },
        {
            q: 'Can I use WebP for the og:image meta tag?',
            a: 'Some platforms (Facebook, Twitter/X, LinkedIn) support WebP for social preview images, but support is inconsistent. For og:image, use JPEG or PNG to ensure compatibility with all social platforms.',
        },
        {
            q: 'Is WebP good for SEO?',
            a: 'Yes. Google can index and rank WebP images. Because WebP files are smaller, pages load faster, improving Core Web Vitals (LCP). Google uses page speed as a ranking signal, so serving WebP directly contributes to better rankings.',
        },
        {
            q: 'What is the difference between WebP and AVIF?',
            a: 'AVIF is a newer format (2020) that achieves ~20% smaller files than WebP at the same quality. However, AVIF has slightly lower browser support (no IE, limited Safari before 16) and much slower encoding. WebP is the practical choice for most sites today; AVIF is worth adding as a second source in the <picture> element.',
        },
    ],

    relatedLinks: [
        { href: '/convert-to-webp', label: 'Convert to WebP →' },
        { href: '/compress-jpg', label: 'Compress JPG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/compress-image-to-kb', label: 'Compress to 100 KB →' },
        { href: '/', label: 'All formats →' },
    ],

    relatedBlogPosts: [
        { slug: 'jpg-vs-webp', title: 'JPG vs WebP: Which Image Format Should You Use?', category: 'Formats', readTime: '5 min' },
        { slug: 'what-is-avif', title: 'What Is AVIF? The Next-Gen Image Format Explained', category: 'Formats', readTime: '5 min' },
    ],
};

export default function CompressWebp() {
    return <FormatLandingPage config={config} />;
}
