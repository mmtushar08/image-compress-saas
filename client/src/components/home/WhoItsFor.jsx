export default function WhoItsFor() {
    const personas = [
        {
            icon: "👨‍💻",
            title: "Developers",
            description: "Automate image optimization with a clean, reliable API."
        },
        {
            icon: "🎨",
            title: "Designers",
            description: "Upload images and get optimized files instantly — no technical setup."
        },
        {
            icon: "📊",
            title: "Marketing teams",
            description: "Improve page speed, SEO, and conversions without relying on developers."
        },
        {
            icon: "🚀",
            title: "Startups & SaaS teams",
            description: "Ship performance without building your own image pipeline."
        }
    ];

    return (
        <section className="who-its-for-section">
            <div className="section-container">
                <h2>Built for modern teams</h2>
                <div className="personas-grid">
                    {personas.map((persona, index) => (
                        <div key={index} className="persona-card">
                            <div className="persona-icon">{persona.icon}</div>
                            <h3>{persona.title}</h3>
                            <p>{persona.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
