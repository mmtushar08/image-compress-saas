import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../../components/SEOHead';
import HeroSection from '../../compression/components/home/HeroSection';
import UploadZone from '../../compression/components/home/UploadZone';
import DownloadAllButton from '../../compression/components/home/DownloadAllButton';
import ResultsList from '../../compression/components/home/ResultsList';
import { useImageCompression } from '../../../hooks/useImageCompression';
import { useDownloadAll } from '../../../hooks/useDownloadAll';
import { formatFileSize } from '../../../utils/fileUtils';

const faqs = [
    {
        q: 'Is the image converter free?',
        a: 'Yes. Converting images to WebP or AVIF on Shrinkix is free with no sign-up required.',
    },
    {
        q: 'Can I convert JPG to WebP?',
        a: 'Yes. Upload any JPG, PNG, or GIF and select WebP as the output format. The converted file is ready to download in seconds.',
    },
    {
        q: 'What is the difference between WebP and AVIF?',
        a: 'WebP has broader browser support and is the safe default. AVIF offers 10–50% better compression than WebP but is best paired with a fallback for older browsers.',
    },
    {
        q: 'Does converting to WebP reduce quality?',
        a: 'Shrinkix converts at high quality settings by default. The resulting WebP file is visually identical to the original at a smaller file size.',
    },
    {
        q: 'Can I batch convert multiple images?',
        a: 'Yes. Drop multiple files at once and Shrinkix converts them all in a single session.',
    },
];

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shrinkix.com/' },
        { '@type': 'ListItem', position: 2, name: 'Convert Images', item: 'https://shrinkix.com/convert' },
    ],
};

export default function Convert() {
    const [targetFormats, setTargetFormats] = useState(['webp']);
    const { items, limitInfo, handleFiles, formatWarnings } = useImageCompression(targetFormats);
    const { isProcessing, handleDownloadAll, showDownloadAll } = useDownloadAll(items);

    return (
        <main id="upload">
            <SEOHead
                rawTitle="Convert Images to WebP & AVIF Online Free — Shrinkix"
                description="Convert JPG, PNG and GIF to WebP or AVIF in seconds. Smaller files, better performance. Free, private, no sign-up."
                canonical="/convert"
                ogImage="https://shrinkix.com/og/convert.png"
            />
            <JsonLd schema={faqSchema} />
            <JsonLd schema={breadcrumbSchema} />

            <HeroSection>
                <div className="format-hero-content">
                    <h1 className="format-h1">Convert images to WebP and AVIF automatically</h1>
                    <p className="format-subheading">WebP images are 25–35% smaller than JPEG at the same quality. AVIF goes even further, cutting sizes by up to 50%. Just upload and download.</p>
                </div>
                <UploadZone
                    onFilesSelected={handleFiles}
                    limitInfo={limitInfo}
                    targetFormats={targetFormats}
                    setTargetFormats={setTargetFormats}
                    formatWarnings={formatWarnings}
                />
            </HeroSection>

            <DownloadAllButton showDownloadAll={showDownloadAll} onDownloadAll={handleDownloadAll} isProcessing={isProcessing} />
            <ResultsList items={items} formatFileSize={formatFileSize} />
            <DownloadAllButton showDownloadAll={showDownloadAll} onDownloadAll={handleDownloadAll} isProcessing={isProcessing} />

            {/* Body copy */}
            <section className="format-section">
                <div className="container">
                    <h2>WebP vs AVIF — which should you use?</h2>
                    <p>WebP has near-universal browser support and is the safe default for most sites. AVIF delivers better compression but is newer; use it alongside a JPEG or WebP fallback.</p>

                    <h2>How conversion works</h2>
                    <p>Drop your image, choose WebP or AVIF as the output format, and download the converted file. No quality loss controls needed — Shrinkix picks optimal settings automatically.</p>

                    <h2>Your files are private</h2>
                    <p>Shrinkix processes images in memory and deletes them immediately after your download. We never store, index, or share your files.</p>
                </div>
            </section>

            {/* FAQ */}
            <section className="format-section">
                <div className="container">
                    <h2>Frequently asked questions about image conversion</h2>
                    <div className="format-faq-list">
                        {faqs.map((faq, i) => (
                            <details key={i} className="format-faq-item">
                                <summary>{faq.q}</summary>
                                <p>{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="format-cta">
                <div className="container">
                    <h2>Ready to convert your images?</h2>
                    <p>Free forever. No account needed. Files deleted immediately after processing.</p>
                    <button
                        className="format-btn-primary"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Convert Images Now ↑
                    </button>
                </div>
            </section>

            {/* Related tools */}
            <section className="format-section">
                <div className="container">
                    <h2>Other free image tools</h2>
                    <div className="format-related-links">
                        <Link to="/convert-to-webp" className="format-related-link">Convert to WebP</Link>
                        <Link to="/compress" className="format-related-link">Compress Images</Link>
                        <Link to="/compress-jpeg" className="format-related-link">Compress JPEG</Link>
                        <Link to="/compress-png" className="format-related-link">Compress PNG</Link>
                        <Link to="/compress-webp" className="format-related-link">Compress WebP</Link>
                        <Link to="/compress-image-to-kb" className="format-related-link">Compress to 100 KB</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
