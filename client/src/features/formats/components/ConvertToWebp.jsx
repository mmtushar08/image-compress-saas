import FormatLandingPage from './FormatLandingPage';

const config = {
    formatName: 'WebP',
    title: 'Convert JPG to WebP Online — Free',
    metaDescription: 'Convert JPEG, PNG, or AVIF images to WebP online free. WebP is 25–35% smaller than JPEG. Instant conversion, no signup, files deleted after processing.',
    canonical: '/convert-to-webp',
    breadcrumb: 'Convert to WebP',
    heading: 'Convert JPG to WebP Online — Free',
    subheading: 'Turn JPEG, PNG, or AVIF images into WebP for 25–35% smaller files. Enable the "Convert to WebP" option below and upload your images.',
    defaultTargetFormats: ['webp'],

    stats: [
        { value: '25–35%', label: 'Smaller than JPEG' },
        { value: '26%', label: 'Smaller than PNG' },
        { value: 'Free', label: 'No account needed' },
        { value: 'Bulk', label: 'Convert multiple files' },
    ],

    definitionTitle: 'Why convert images to WebP?',
    definition: 'WebP is an image format developed by Google designed specifically for the web. Converting your JPEG images to WebP reduces file size by 25–35% at the same visual quality. Converting PNG to WebP saves 26% on average, while preserving transparency. These smaller files load faster, which improves your website\'s Core Web Vitals score — a direct Google ranking signal.',
    definitionExtra: 'Google PageSpeed Insights will recommend "Serve images in next-gen formats" if your site serves JPEG or PNG instead of WebP. This recommendation directly affects your PageSpeed score. Converting to WebP is one of the highest-impact, lowest-effort performance improvements available. Shrinkix converts your images to WebP in a single click — for free.',

    howToTitle: 'How to convert JPG to WebP online',
    steps: [
        {
            name: 'Enable WebP conversion',
            text: 'The upload zone above is pre-set to convert images to WebP. If not enabled, look for the "Convert to" dropdown in the upload zone and select WebP.',
        },
        {
            name: 'Upload your JPEG, PNG, or AVIF files',
            text: 'Drag and drop or click to select your images. Shrinkix accepts JPG, JPEG, PNG, and AVIF files. All uploaded images will be converted to WebP automatically.',
        },
        {
            name: 'Download your WebP files',
            text: 'Each converted WebP file appears below with a size comparison. Download individually or use "Download All" to get all WebP files as a ZIP.',
        },
    ],

    tipsTitle: 'How to implement WebP on your website',
    tips: [
        {
            title: 'Use the <picture> element for browser compatibility',
            text: 'Always provide a JPEG/PNG fallback: <picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="..."></picture>. Older browsers load the fallback automatically.',
        },
        {
            title: 'Check your PageSpeed Insights score after converting',
            text: 'Run PageSpeed Insights before and after converting to WebP. The "Serve images in next-gen formats" recommendation should disappear, and your performance score should improve.',
        },
        {
            title: 'WordPress: use a WebP plugin',
            text: 'Plugins like Smush, ShortPixel, or Imagify automatically serve WebP versions of your uploaded images to browsers that support it, without code changes.',
        },
        {
            title: 'Serve WebP from your CDN',
            text: 'Most CDNs (Cloudflare, AWS CloudFront, Cloudinary) can automatically convert and serve WebP to supporting browsers. Enable "Polish" on Cloudflare or "Auto format" on Cloudinary.',
        },
        {
            title: 'Keep your original JPEG/PNG',
            text: 'Always keep the original file. WebP is not universally supported in design tools, older email clients, or iOS sharing. Use WebP for web delivery; keep JPEG/PNG as your source of truth.',
        },
    ],

    faqHeading: 'JPEG to WebP conversion',
    faqs: [
        {
            q: 'Why should I convert JPG to WebP?',
            a: 'WebP images are 25–35% smaller than JPEG at the same visual quality. Smaller images load faster, improving your Core Web Vitals score (LCP). Google PageSpeed Insights flags JPEG images with "Serve images in next-gen formats" — switching to WebP fixes this warning and can improve your SEO ranking.',
        },
        {
            q: 'Does converting JPG to WebP reduce quality?',
            a: 'At quality 80–85, the converted WebP is visually identical to the original JPEG but 25–35% smaller. Shrinkix uses quality 82 by default, which matches the visual quality of JPEG 85. You can compare the original and converted images side by side before downloading.',
        },
        {
            q: 'Can I convert PNG to WebP and keep the transparent background?',
            a: 'Yes. WebP supports alpha channel transparency, exactly like PNG. Your PNG\'s transparent areas are fully preserved in the WebP version, and the file will be approximately 26% smaller.',
        },
        {
            q: 'Do all browsers support WebP?',
            a: 'All modern browsers support WebP: Chrome, Firefox, Safari 14+, Edge, Opera, and Samsung Internet — covering over 95% of global traffic. Use the <picture> element with a JPEG fallback to support the remaining older browsers.',
        },
        {
            q: 'Is WebP safe for SEO and Google image search?',
            a: 'Yes. Google fully supports WebP images in search. WebP images appear in Google Image Search just like JPEG and PNG. Because WebP improves page speed (a ranking factor), using WebP can positively affect your search rankings.',
        },
        {
            q: 'Can I use WebP images in email campaigns?',
            a: 'Not reliably. Outlook (all versions) does not support WebP. Gmail supports WebP in Chrome but not in the Gmail iOS app. For email marketing, use JPEG or PNG.',
        },
        {
            q: 'What is the difference between converting and compressing?',
            a: 'Converting changes the image format (e.g., JPEG → WebP). Compressing reduces the file size within the same format. Shrinkix does both: when you convert to WebP, it also applies compression to the output, giving you the smallest possible WebP file.',
        },
        {
            q: 'Can I convert multiple JPEGs to WebP at once?',
            a: 'Yes. Shrinkix supports bulk conversion. Upload up to 25 files on the free plan and all will be converted to WebP simultaneously. Use "Download All" to save them as a ZIP file.',
        },
    ],

    relatedLinks: [
        { href: '/compress-webp', label: 'Compress WebP →' },
        { href: '/compress-jpeg', label: 'Compress JPEG →' },
        { href: '/compress-png', label: 'Compress PNG →' },
        { href: '/compress-avif', label: 'Compress AVIF →' },
        { href: '/compress-image-to-kb', label: 'Compress to 100 KB →' },
        { href: '/', label: 'All formats →' },
    ],
};

export default function ConvertToWebp() {
    return <FormatLandingPage config={config} />;
}
