export default function Pricing() {
    return (
        <section className="pricing-section">
            <div className="pricing-header">
                <h2>Simple, Transparent Pricing</h2>
                <p>Choose the plan that fits your needs.</p>
            </div>

            <div className="pricing-cards">
                {/* Starter Plan */}
                <div className="pricing-card">
                    <div className="card-header">
                        <h3>Starter</h3>
                        <span className="price">Free</span>
                    </div>
                    <ul className="features">
                        <li>✅ Up to 10 MB per file</li>
                        <li>✅ Max 20 images per day</li>
                        <li>✅ Web Interface Only</li>
                        <li>✅ Standard Compression</li>
                    </ul>
                    <button className="plan-btn current">Current Plan</button>
                </div>

                {/* Pro Plan */}
                <div className="pricing-card featured">
                    <div className="popular-tag">Most Popular</div>
                    <div className="card-header">
                        <h3>Pro</h3>
                        <span className="price">$5<small>/mo</small></span>
                    </div>
                    <ul className="features">
                        <li>✅ Up to 25 MB per file</li>
                        <li>✅ Unlimited batch size</li>
                        <li>✅ Priority Compression</li>
                        <li>✅ API Access (500 credits)</li>
                    </ul>
                    <button className="plan-btn primary">Upgrade to Pro</button>
                </div>

                {/* Ultra Plan */}
                <div className="pricing-card">
                    <div className="card-header">
                        <h3>Ultra</h3>
                        <span className="price">$15<small>/mo</small></span>
                    </div>
                    <ul class="features">
                        <li>✅ Up to 100 MB per file</li>
                        <li>✅ Unlimited Everything</li>
                        <li>✅ Ultra-Fast Processing</li>
                        <li>✅ Review & Analytics</li>
                    </ul>
                    <button className="plan-btn">Contact Us</button>
                </div>
            </div>
        </section>
    );
}
