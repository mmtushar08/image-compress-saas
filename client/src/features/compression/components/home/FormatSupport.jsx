import { Link } from 'react-router-dom';

const FORMATS = [
    {
        ext: "PNG",
        href: "/compress-png",
        description: "Lossless PNG compression. Perfect for logos, illustrations & screenshots with transparency."
    },
    {
        ext: "JPG",
        href: "/compress-jpg",
        description: "Lossy JPEG compression with adaptive quality. Ideal for photos & hero images."
    },
    {
        ext: "WebP",
        href: "/jpg-to-webp",
        description: "Convert JPG or PNG to WebP. Up to 34% smaller than JPEG at equivalent visual quality."
    },
    {
        ext: "AVIF",
        href: "/avif-converter",
        description: "Next-gen format with the best compression. Supported by all modern browsers."
    }
];

export default function FormatSupport() {
    return (
        <section className="format-support-section">
            <div className="section-container">
                <h2>Every format. One tool.</h2>
                <p className="section-subtitle">Compress or convert between PNG, JPG, WebP, and AVIF — no plugins needed.</p>
                <div className="format-grid">
                    {FORMATS.map((f) => (
                        <Link key={f.ext} to={f.href} className="format-tile">
                            <span className="format-ext">{f.ext}</span>
                            <p>{f.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
