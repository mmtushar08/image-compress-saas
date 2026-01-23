export default function PrivacySecurity() {
    return (
        <section className="privacy-section">
            <div className="section-container">
                <h2>Your images stay yours</h2>
                <p className="privacy-intro">
                    Privacy isn't optional — it's built into Shrinkix.
                </p>
                <div className="privacy-grid">
                    <div className="privacy-item">
                        <div className="privacy-icon">🔐</div>
                        <h3>Images are processed securely</h3>
                    </div>
                    <div className="privacy-item">
                        <div className="privacy-icon">🗑️</div>
                        <h3>Files are deleted automatically after compression</h3>
                    </div>
                    <div className="privacy-item">
                        <div className="privacy-icon">🚫</div>
                        <h3>No long-term storage</h3>
                    </div>
                    <div className="privacy-item">
                        <div className="privacy-icon">✅</div>
                        <h3>No reuse or resale of your data</h3>
                    </div>
                </div>
                <p className="privacy-tagline">
                    Shrinkix ensures every image leaves our servers once optimization is complete.
                </p>
            </div>
        </section>
    );
}
