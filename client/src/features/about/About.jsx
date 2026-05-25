import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

export default function About() {
    return (
        <>
            <SEOHead
                title="About Shrinkix"
                description="Shrinkix is an image compression and conversion tool built for developers, designers, and teams who care about performance and privacy."
                canonical="/about"
            />
            <main className="about-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1>About Shrinkix</h1>
                <p className="lead" style={{ fontSize: '1.2rem', color: '#444', marginBottom: '2rem' }}>
                    Shrinkix is an image compression and conversion platform built for developers,
                    designers, and teams who care about website performance and user privacy.
                </p>

                <h2>What Shrinkix does</h2>
                <p>
                    Shrinkix compresses and converts images automatically the moment they are uploaded.
                    We support PNG, JPG, WebP, and AVIF formats — the four formats that matter for modern websites.
                    Our compression algorithms reduce file sizes by 60–80% with minimal visible quality loss,
                    helping websites load faster and score better on Core Web Vitals.
                </p>

                <h2>What is image compression?</h2>
                <p>
                    Image compression is the process of reducing an image file's size by encoding data
                    more efficiently. Lossy compression removes some image data to achieve smaller files,
                    while lossless compression reduces file size without any quality loss. Smaller images
                    load faster, consume less bandwidth, and improve both SEO rankings and user experience —
                    especially on mobile connections.
                </p>
                <p>
                    Images account for an average of 50–75% of a webpage's total file size. Every kilobyte
                    saved is a direct improvement in page load time.
                </p>

                <h2>Who uses Shrinkix</h2>
                <ul style={{ lineHeight: 2 }}>
                    <li><strong>Developers</strong> — automate image optimization through the REST API and SDKs for Node.js, Python, PHP, Ruby, Go, Java, and C#</li>
                    <li><strong>Designers</strong> — upload images and receive optimized files instantly, no technical setup required</li>
                    <li><strong>Marketing teams</strong> — improve page speed, SEO, and conversion rates without developer bottlenecks</li>
                    <li><strong>Startups & SaaS teams</strong> — ship production-ready image pipelines without building internal tooling</li>
                </ul>

                <h2>Privacy first</h2>
                <p>
                    Shrinkix is built with privacy as a default, not an afterthought.
                    Images are processed over a secure SSL connection and deleted from our servers
                    immediately after processing is complete. We do not store, reuse, resell, or retain
                    your files. The service is GDPR and CCPA compliant.
                </p>

                <h2>Key facts</h2>
                <ul style={{ lineHeight: 2 }}>
                    <li>50,000+ developers using the API</li>
                    <li>1 billion+ images compressed</li>
                    <li>Supported formats: PNG, JPG, WebP, AVIF</li>
                    <li>Free tier: 500 API compressions/month — no credit card required</li>
                    <li>API Pro: 5,000 compressions/month for $35</li>
                    <li>API Ultra: 15,000 compressions/month for $90</li>
                    <li>Max file size: up to 150MB (Ultra plan)</li>
                    <li>Files deleted immediately after processing</li>
                    <li>GDPR and CCPA compliant</li>
                </ul>

                <h2>Contact</h2>
                <p>
                    For support: <a href="mailto:support@shrinkix.com">support@shrinkix.com</a><br />
                    For feedback: <a href="mailto:feedback@shrinkix.com">feedback@shrinkix.com</a>
                </p>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary">Try Shrinkix free</Link>
                    <Link to="/developers" className="btn btn-secondary">View API docs</Link>
                </div>
            </main>
        </>
    );
}
