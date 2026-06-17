import { Link } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../../components/SEOHead';

const faqs = [
    {
        q: 'Is the WordPress plugin free?',
        a: 'Yes. The Shrinkix WordPress plugin is free. You need a free Shrinkix API key to activate it.',
    },
    {
        q: 'Does the plugin work with WooCommerce?',
        a: 'Yes. The plugin hooks into the WordPress media upload system and works with WooCommerce product images automatically.',
    },
    {
        q: 'Will the plugin replace my original images?',
        a: 'The plugin replaces the uploaded file with the compressed version. We recommend keeping your originals in a separate backup.',
    },
    {
        q: 'Which image formats does the plugin support?',
        a: 'The plugin supports JPEG, PNG, WebP, and AVIF. You can choose to convert all images to WebP or AVIF automatically.',
    },
    {
        q: 'What happens if the API is unavailable?',
        a: 'If the Shrinkix API is unreachable, the plugin saves the original unoptimized image. Your uploads are never lost.',
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
        { '@type': 'ListItem', position: 2, name: 'WordPress Plugin', item: 'https://shrinkix.com/wordpress' },
    ],
};

export default function WordPress() {
    return (
        <main>
            <SEOHead
                rawTitle="WordPress Image Optimization Plugin — Shrinkix"
                description="Auto-compress and convert images on upload with the free Shrinkix WordPress plugin. Supports WebP, AVIF, PNG, and JPEG. Works with any theme."
                canonical="/wordpress"
                ogImage="https://shrinkix.com/og/wordpress.png"
            />
            <JsonLd schema={faqSchema} />
            <JsonLd schema={breadcrumbSchema} />

            {/* Hero */}
            <section
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(10,22,40,0.72) 0%, rgba(26,16,53,0.65) 100%), url('/hero-bg.png')`
                }}
            >
                <div className="container">
                    <div className="format-hero-content">
                        <h1 className="format-h1">Automatic image optimization for WordPress</h1>
                        <p className="format-subheading">The free Shrinkix WordPress plugin automatically compresses and converts images when you upload them to the Media Library — no manual steps required.</p>
                        <Link to="/developers" className="format-btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
                            Get Your Free API Key →
                        </Link>
                    </div>
                </div>
            </section>

            {/* What the plugin does */}
            <section className="format-section">
                <div className="container">
                    <h2>What the plugin does</h2>
                    <p>On every upload, the plugin sends your image to the Shrinkix API, compresses it, optionally converts it to WebP or AVIF, and saves the optimized version back to your server. Original files are never stored on our servers beyond the processing window.</p>

                    <h2>Requirements</h2>
                    <ul>
                        <li>WordPress 5.8 or higher</li>
                        <li>PHP 7.4+</li>
                        <li>A free or paid Shrinkix API key (<Link to="/developers">get one on the Developers page</Link>)</li>
                    </ul>

                    <h2>How to install</h2>
                    <ol>
                        <li>Download the plugin from the WordPress Plugin Directory</li>
                        <li>In your WordPress admin, go to <strong>Plugins → Add New → Upload Plugin</strong></li>
                        <li>Activate the plugin and enter your Shrinkix API key under <strong>Settings → Shrinkix</strong></li>
                        <li>Upload any image — it will be automatically optimized</li>
                    </ol>
                </div>
            </section>

            {/* FAQ */}
            <section className="format-section">
                <div className="container">
                    <h2>Frequently asked questions about the WordPress plugin</h2>
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
                    <h2>Ready to optimize your WordPress images?</h2>
                    <p>Get a free API key and start compressing in minutes.</p>
                    <Link to="/developers" className="format-btn-primary">
                        Get Your Free API Key →
                    </Link>
                </div>
            </section>

            {/* Related tools */}
            <section className="format-section">
                <div className="container">
                    <h2>Other free image tools</h2>
                    <div className="format-related-links">
                        <Link to="/compress" className="format-related-link">Compress Images</Link>
                        <Link to="/convert" className="format-related-link">Convert to WebP / AVIF</Link>
                        <Link to="/compress-jpeg" className="format-related-link">Compress JPEG</Link>
                        <Link to="/compress-png" className="format-related-link">Compress PNG</Link>
                        <Link to="/developers" className="format-related-link">Developer API</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
