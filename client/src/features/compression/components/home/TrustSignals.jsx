export default function TrustSignals() {
    const signals = [
        {
            icon: "🔒",
            title: "Privacy First",
            description: "Files are deleted instantly after compression. We never store, share, or retain your images."
        },
        {
            icon: "⚡",
            title: "Under 2 Seconds",
            description: "Powered by Sharp and MozJPEG — industry-leading engines that compress at native speed."
        },
        {
            icon: "🎯",
            title: "Adaptive Quality",
            description: "Our engine auto-selects the optimal quality level based on your file size and content."
        }
    ];

    return (
        <section className="trust-signals-section">
            <div className="section-container">
                <div className="trust-signals-grid">
                    {signals.map((s, i) => (
                        <div key={i} className="trust-signal-card">
                            <div className="trust-signal-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
