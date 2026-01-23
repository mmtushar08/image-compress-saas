import { Link } from 'react-router-dom';

export default function DeveloperCta() {
    return (
        <section className="dev-cta">
            <div className="dev-container">
                <h2>Ready to get started?</h2>
                <p>Join thousands of developers optimizing images with Shrinkix</p>
                <div className="cta-buttons">
                    <Link to="/developers/how-it-works" className="btn-secondary">Learn How It Works</Link>
                    <Link to="/developers/pricing" className="btn-primary">View Pricing</Link>
                </div>
            </div>
        </section>
    );
}
