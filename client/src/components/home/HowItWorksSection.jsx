export default function HowItWorksSection() {
    const steps = [
        {
            number: "1",
            title: "Upload your images",
            description: "Add PNG, JPG, WebP, or AVIF files — single images or bulk uploads."
        },
        {
            number: "2",
            title: "Automatic conversion and compression",
            description: "Shrinkix optimizes each image for size and quality in seconds."
        },
        {
            number: "3",
            title: "Download optimized files",
            description: "Smaller images, same visual quality, ready for production."
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="section-container">
                <h2>Upload once. Shrinkix does the rest.</h2>
                <div className="steps-grid">
                    {steps.map((step) => (
                        <div key={step.number} className="step-card">
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
