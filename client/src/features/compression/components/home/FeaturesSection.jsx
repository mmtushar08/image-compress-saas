export default function FeaturesSection() {
    const features = [
        {
            icon: "⚙️",
            title: "Intelligent Optimization",
            description: "Advanced algorithms deliver maximum compression with optimal quality preservation."
        },
        {
            icon: "🖼️",
            title: "Multi-Format Support",
            description: "Compress JPEG, PNG, WebP & AVIF — all in one place."
        },
        {
            icon: "🛡️",
            title: "Secure & Reliable",
            description: "Your images are processed securely and deleted immediately after compression."
        }
    ];

    return (
        <section className="features-section" id="features">
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
