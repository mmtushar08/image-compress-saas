export default function FeaturesSection() {
    const features = [
        {
            icon: "⚡",
            title: "Convert images automatically",
            description: "Optimization starts as soon as images are uploaded. No extra steps."
        },
        {
            icon: "📦",
            title: "Smaller files, same quality",
            description: "Advanced compression reduces file size without visible loss."
        },
        {
            icon: "🎨",
            title: "Modern image formats",
            description: "Support for PNG, JPG, WebP, and AVIF."
        },
        {
            icon: "🚀",
            title: "Bulk image optimization",
            description: "Optimize multiple images at once without slowing down."
        },
        {
            icon: "🔌",
            title: "API-ready",
            description: "Integrate Shrinkix directly into your app, CMS, or build pipeline."
        },
        {
            icon: "⏱️",
            title: "Lightning fast",
            description: "Process images in seconds, not minutes."
        }
    ];

    return (
        <section className="features-section">
            <div className="section-container">
                <h2>Everything you need to optimize images — nothing you don't</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
