import { Link } from 'react-router-dom';

export default function DeveloperCta() {
    return (
        <section className="dev-cta">
            <div className="dev-cta-inner">
                <h2>Ready to get started?</h2>
                <p>
                    Sign up for free, grab your API key, and send your first request in under five minutes.
                    No credit card required.
                </p>
                <div className="dev-cta-actions">
                    <Link to="/signup" className="dev-btn-primary">Get free API key</Link>
                    <Link to="/api-docs" className="dev-btn-secondary">Read the docs →</Link>
                </div>
            </div>
        </section>
    );
}
