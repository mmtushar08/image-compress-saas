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

export default function FormatLandingPage({ config }) {
    const [targetFormats, setTargetFormats] = useState(config.defaultTargetFormats || []);

    const { items, limitInfo, handleFiles, formatWarnings } = useImageCompression(targetFormats);
    const { isProcessing, handleDownloadAll, showDownloadAll } = useDownloadAll(items);

    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: config.howToTitle,
        description: config.metaDescription,
        step: config.steps.map((step, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: step.name,
            text: step.text,
        })),
        tool: [{ '@type': 'HowToTool', name: 'Shrinkix — Free Image Compressor' }],
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqs.map(faq => ({
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
            { '@type': 'ListItem', position: 2, name: config.breadcrumb, item: `https://shrinkix.com${config.canonical}` },
        ],
    };

    return (
        <main id="upload">
            <SEOHead
                title={config.title}
                description={config.metaDescription}
                canonical={config.canonical}
            />
            <JsonLd schema={howToSchema} />
            <JsonLd schema={faqSchema} />
            <JsonLd schema={breadcrumbSchema} />

            {/* Hero with background image — same brand image as homepage */}
            <HeroSection>
                <div className="format-hero-content">
                    <h1 className="format-h1">{config.heading}</h1>
                    <p className="format-subheading">{config.subheading}</p>
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

            {/* Stats strip */}
            <section className="format-stats-strip">
                <div className="container">
                    {config.stats.map((stat, i) => (
                        <div key={i} className="format-stat">
                            <span className="format-stat-value">{stat.value}</span>
                            <span className="format-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Definition */}
            <section className="format-section">
                <div className="container">
                    <h2>{config.definitionTitle}</h2>
                    <p>{config.definition}</p>
                    {config.definitionExtra && <p>{config.definitionExtra}</p>}
                </div>
            </section>

            {/* How-to steps */}
            <section className="format-section format-howto-section">
                <div className="container">
                    <h2>{config.howToTitle}</h2>
                    <ol className="format-steps">
                        {config.steps.map((step, i) => (
                            <li key={i} className="format-step">
                                <span className="format-step-num">{i + 1}</span>
                                <div>
                                    <h3>{step.name}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Tips */}
            {config.tips && (
                <section className="format-section">
                    <div className="container">
                        <h2>{config.tipsTitle}</h2>
                        <ul className="format-tips-list">
                            {config.tips.map((tip, i) => (
                                <li key={i}><strong>{tip.title}:</strong> {tip.text}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* FAQ */}
            <section className="format-section">
                <div className="container">
                    <h2>Frequently asked questions about {config.faqHeading}</h2>
                    <div className="format-faq-list">
                        {config.faqs.map((faq, i) => (
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
                    <h2>Ready to compress your {config.formatName} images?</h2>
                    <p>Free forever. No account needed. Files deleted immediately after processing.</p>
                    <button
                        className="format-btn-primary"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Compress {config.formatName} Now ↑
                    </button>
                </div>
            </section>

            {/* Related blog posts */}
            {config.relatedBlogPosts?.length > 0 && (
                <section className="format-section format-blog-section">
                    <div className="container">
                        <h2>From the Shrinkix blog</h2>
                        <div className="format-blog-links">
                            {config.relatedBlogPosts.map((post, i) => (
                                <Link key={i} to={`/blog/${post.slug}`} className="format-blog-card">
                                    <span className="format-blog-category">{post.category}</span>
                                    <span className="format-blog-title">{post.title}</span>
                                    <span className="format-blog-read">{post.readTime} →</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Related tools */}
            <section className="format-section">
                <div className="container">
                    <h2>Other free image compression tools</h2>
                    <div className="format-related-links">
                        {config.relatedLinks.map((link, i) => (
                            <Link key={i} to={link.href} className="format-related-link">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
