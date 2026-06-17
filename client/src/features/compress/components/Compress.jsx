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
        q: 'Is image compression free?',
        a: 'Yes. The Shrinkix web compressor is completely free with no daily limits for standard use. API access and extended limits require a paid plan.',
    },
    {
        q: 'Will compression reduce image quality?',
        a: 'Shrinkix uses smart lossy compression that removes data your eye cannot detect. The result looks identical to the original at up to 80% smaller file size.',
    },
    {
        q: 'What formats can I compress?',
        a: 'You can compress PNG, JPEG, WebP, and AVIF images. Shrinkix automatically picks the best settings for each format.',
    },
    {
        q: 'How many images can I compress at once?',
        a: 'Free users can compress up to 20 images per session. Pro plan removes this limit.',
    },
    {
        q: 'Are my images stored after compression?',
        a: 'No. Images are processed in memory and permanently deleted within 60 seconds. We never retain or share your files.',
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
        { '@type': 'ListItem', position: 2, name: 'Compress Images', item: 'https://shrinkix.com/compress' },
    ],
};

export default function Compress() {
    const [targetFormats, setTargetFormats] = useState([]);
    const { items, limitInfo, handleFiles, formatWarnings } = useImageCompression(targetFormats);
    const { isProcessing, handleDownloadAll, showDownloadAll } = useDownloadAll(items);

    return (
        <main id="upload">
            <SEOHead
                rawTitle="Compress Images Online Free — Shrinkix"
                description="Reduce PNG, JPG, WebP and AVIF file sizes without losing quality. Fast, free, and private. No sign-up required."
                canonical="/compress"
                ogImage="https://shrinkix.com/og/compress.png"
            />
            <JsonLd schema={faqSchema} />
            <JsonLd schema={breadcrumbSchema} />

            <HeroSection>
                <div className="format-hero-content">
                    <h1 className="format-h1">Compress images online without losing quality</h1>
                    <p className="format-subheading">Shrinkix removes invisible data from PNG, JPG, WebP and AVIF images, cutting file sizes by 30–80% with zero visible change.</p>
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
                    <p>No sign-up, no software install. Your files are deleted within 60 seconds of processing.</p>

                    <h2>Why image compression matters</h2>
                    <p>Large image files slow your website, drain mobile data, and hurt your Core Web Vitals score. Compressing images before you publish is the single highest-impact performance improvement most sites can make.</p>

                    <h2>Supported image formats</h2>
                    <ul>
                        <li>PNG (lossless &amp; lossy)</li>
                        <li>JPEG / JPG</li>
                        <li>WebP</li>
                        <li>AVIF</li>
                    </ul>

                    <h2>Your files are private</h2>
                    <p>Shrinkix processes images in memory and deletes them immediately after your download. We never store, index, or share your files.</p>
                </div>
            </section>

            {/* FAQ */}
            <section className="format-section">
                <div className="container">
                    <h2>Frequently asked questions about image compression</h2>
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
                    <h2>Ready to compress your images?</h2>
                    <p>Free forever. No account needed. Files deleted immediately after processing.</p>
                    <button
                        className="format-btn-primary"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Compress Images Now ↑
                    </button>
                </div>
            </section>

            {/* Related tools */}
            <section className="format-section">
                <div className="container">
                    <h2>Other free image tools</h2>
                    <div className="format-related-links">
                        <Link to="/compress-jpeg" className="format-related-link">Compress JPEG</Link>
                        <Link to="/compress-png" className="format-related-link">Compress PNG</Link>
                        <Link to="/compress-webp" className="format-related-link">Compress WebP</Link>
                        <Link to="/compress-avif" className="format-related-link">Compress AVIF</Link>
                        <Link to="/convert" className="format-related-link">Convert to WebP / AVIF</Link>
                        <Link to="/compress-image-to-kb" className="format-related-link">Compress to 100 KB</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
