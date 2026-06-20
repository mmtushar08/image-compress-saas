import { SEOHead, JsonLd } from '../../../components/SEOHead';
import { faqDevelopersSchema, breadcrumbSchema } from '../../../seo/schemas';
import DeveloperHero from './developers/DeveloperHero';
import StatsCounter from './developers/StatsCounter';
import CodeExamples from './CodeExamples';
import DeveloperFAQ from './developers/DeveloperFAQ';
import DeveloperCta from './developers/DeveloperCta';
import '../../../styles/Developers.css';

const FEATURES = [
    {
        icon: '⚡',
        title: 'Adaptive quality',
        desc: 'Compression quality is tuned to each image — larger files get more aggressive compression, small files stay sharp.',
    },
    {
        icon: '🔄',
        title: 'Format conversion',
        desc: 'Compress and convert in one request. JPEG → WebP, PNG → AVIF, or any combination. No extra steps.',
    },
    {
        icon: '📐',
        title: 'Resize on the fly',
        desc: 'Pass width and height parameters to resize while compressing. Aspect ratio is always preserved.',
    },
    {
        icon: '🔒',
        title: 'No image storage',
        desc: 'Images are processed in memory and immediately discarded. Nothing is persisted. GDPR and CCPA compliant.',
    },
    {
        icon: '📊',
        title: 'Usage tracking',
        desc: 'Every response includes X-Original-Size, X-Compressed-Size, and X-Saved-Percent headers.',
    },
    {
        icon: '🌐',
        title: 'Any language',
        desc: 'Standard HTTP multipart — works with Node.js, Python, PHP, Ruby, Go, Java, C#, or plain cURL.',
    },
];

export default function Developers() {
    return (
        <div className="developers-page">
            <SEOHead
                rawTitle="Image Compression API for Developers — Shrinkix"
                description="Automate image optimisation with the Shrinkix REST API. Compress JPEG, PNG, WebP, AVIF. No SDK required. 500 free compressions per month."
                canonical="/developers"
                ogImage="https://shrinkix.com/og/api.png"
            />
            <JsonLd schema={faqDevelopersSchema} />
            <JsonLd schema={breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Developers', path: '/developers' },
            ])} />

            <DeveloperHero />
            <StatsCounter />

            {/* Features grid */}
            <section className="dev-section alt">
                <div className="dev-section-inner">
                    <span className="dev-section-label">Features</span>
                    <h2 className="dev-section-title">Everything you need, nothing you don&apos;t</h2>
                    <p className="dev-section-subtitle">
                        A single endpoint handles every image optimisation task.
                        No SDK, no complex setup — just HTTP.
                    </p>
                    <div className="dev-features-grid">
                        {FEATURES.map(f => (
                            <div className="dev-feature-card" key={f.title}>
                                <div className="dev-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CodeExamples />
            <DeveloperFAQ />
            <DeveloperCta />
        </div>
    );
}
