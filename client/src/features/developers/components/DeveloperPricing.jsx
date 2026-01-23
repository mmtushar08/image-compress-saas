import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Developers.css';

const DeveloperPricing = () => {
    const [compressions, setCompressions] = useState(1000);

    const calculatePrice = (count) => {
        if (count <= 500) return 0;
        const billable = count - 500;
        const pricePerImage = 0.009;
        return (billable * pricePerImage).toFixed(2);
    };

    return (
        <div className="developers-page pricing-page">
            {/* Hero Section */}
            <section className="dev-hero">
                <div className="dev-container">
                    <h1 className="dev-title">Developer API pricing that scales with you</h1>
                    <p className="dev-subtitle">
                        Start with 500 free API credits every month. Need more? Choose from our flexible subscription
                        plans with monthly credit allowances (API Pro: 5,000 credits/month for $35, API Ultra: 15,000 credits/month for $90)
                        or purchase additional credits as needed. No hidden fees, transparent pricing.
                    </p>
                    <Link to="/developers" className="btn-primary btn-large">Get your API key</Link>
                </div>
            </section>

            {/* Pricing Overview */}
            <section className="calculator-section">
                <div className="dev-container">
                    <h2>How It Works</h2>
                    <div className="calculator-card">
                        <div className="pricing-note">
                            <p>💡 Every account gets 500 free API credits each month</p>
                            <p>📊 Subscription plans include monthly credit allowances that reset each month</p>
                            <p>💳 Purchase additional credit bundles anytime for extra capacity</p>
                            <p>🔄 Credits are consumed: Monthly allowance first, then purchased credits</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="tiers-section">
                <div className="dev-container">
                    <h2>Choose Your Plan</h2>
                    <div className="pricing-grid">
                        {/* Free Tier */}
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>Free</h3>
                                <div className="plan-price">
                                    <span className="price">$0</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 500 API credits/month</li>
                                <li>✅ PNG, JPEG, WebP, AVIF support</li>
                                <li>✅ Basic compression</li>
                                <li>✅ 5MB max file size</li>
                                <li>✅ 20 web compressions/month</li>
                                <li>✅ Email support</li>
                                <li>❌ Advanced features</li>
                            </ul>
                            <Link to="/developers" className="btn-outline">Get Started</Link>
                        </div>

                        {/* API Pro */}
                        <div className="pricing-card featured">
                            <div className="plan-badge">Most Popular</div>
                            <div className="plan-header">
                                <h3>API Pro</h3>
                                <div className="plan-price">
                                    <span className="price">$35</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 5,000 API credits/month</li>
                                <li>✅ All image formats (PNG, JPEG, WebP, AVIF)</li>
                                <li>✅ Resize & convert</li>
                                <li>✅ Batch processing</li>
                                <li>✅ 25MB max file size</li>
                                <li>✅ 20 web compressions/month</li>
                                <li>✅ Priority support</li>
                            </ul>
                            <Link to="/checkout/api?tier=api-pro" className="btn-primary">Get Started</Link>
                        </div>

                        {/* API Ultra */}
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>API Ultra</h3>
                                <div className="plan-price">
                                    <span className="price">$90</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 15,000 API credits/month</li>
                                <li>✅ All image formats</li>
                                <li>✅ Resize & convert</li>
                                <li>✅ Batch processing</li>
                                <li>✅ 50MB max file size</li>
                                <li>✅ 20 web compressions/month</li>
                                <li>✅ Priority support</li>
                            </ul>
                            <Link to="/checkout/api?tier=api-ultra" className="btn-primary">Get Started</Link>
                        </div>

                        {/* Enterprise */}
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>Enterprise</h3>
                                <div className="plan-price">
                                    <span className="price">Custom</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ Custom volume pricing</li>
                                <li>✅ Dedicated support</li>
                                <li>✅ 100MB max file size</li>
                                <li>✅ SLA guarantee</li>
                                <li>✅ Custom integrations</li>
                                <li>✅ Dedicated infrastructure</li>
                                <li>✅ Volume discounts</li>
                            </ul>
                            <a href="mailto:support@shrinkix.com" className="btn-outline">Contact Sales</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Credit Bundles */}
            <section className="tiers-section" style={{ paddingTop: '2rem' }}>
                <div className="dev-container">
                    <h2>Pay-As-You-Go Credit Bundles</h2>
                    <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', color: '#666' }}>
                        Need extra credits beyond your monthly allowance? Purchase credit bundles anytime.
                        Credits never expire and are consumed after your monthly allowance.
                    </p>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>1.5K Credits</h3>
                                <div className="plan-price">
                                    <span className="price">$14</span>
                                    <span className="period">one-time</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 1,500 API credits</li>
                                <li>✅ Never expires</li>
                                <li>✅ $0.0093/credit</li>
                            </ul>
                            <Link to="/checkout/credits?tier=credit-1.5k" className="btn-outline">Purchase</Link>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>3.5K Credits</h3>
                                <div className="plan-price">
                                    <span className="price">$28</span>
                                    <span className="period">one-time</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 3,500 API credits</li>
                                <li>✅ Never expires</li>
                                <li>✅ $0.008/credit</li>
                            </ul>
                            <Link to="/checkout/credits?tier=credit-3.5k" className="btn-outline">Purchase</Link>
                        </div>

                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>6.5K Credits</h3>
                                <div className="plan-price">
                                    <span className="price">$56</span>
                                    <span className="period">one-time</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 6,500 API credits</li>
                                <li>✅ Never expires</li>
                                <li>✅ $0.0086/credit</li>
                            </ul>
                            <Link to="/checkout/credits?tier=credit-6.5k" className="btn-outline">Purchase</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="comparison-section">
                <div className="dev-container">
                    <h2>Feature Comparison</h2>
                    <div className="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Free</th>
                                    <th>API Pro</th>
                                    <th>API Ultra</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Monthly API credits</td>
                                    <td>500</td>
                                    <td>5,000</td>
                                    <td>15,000</td>
                                </tr>
                                <tr>
                                    <td>Monthly price</td>
                                    <td>$0</td>
                                    <td>$35</td>
                                    <td>$90</td>
                                </tr>
                                <tr>
                                    <td>Additional credits</td>
                                    <td>Purchase bundles</td>
                                    <td>Purchase bundles</td>
                                    <td>Purchase bundles</td>
                                </tr>
                                <tr>
                                    <td>Max file size</td>
                                    <td>5MB</td>
                                    <td>25MB</td>
                                    <td>50MB</td>
                                </tr>
                                <tr>
                                    <td>Resize & crop</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Format conversion</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Batch processing</td>
                                    <td>❌</td>
                                    <td>✅</td>
                                    <td>✅</td>
                                </tr>
                                <tr>
                                    <td>Support</td>
                                    <td>Email</td>
                                    <td>Priority</td>
                                    <td>Dedicated</td>
                                </tr>
                                <tr>
                                    <td>SLA</td>
                                    <td>-</td>
                                    <td>99.9%</td>
                                    <td>99.99%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="dev-section faq-section">
                <div className="dev-container">
                    <h2>Pricing FAQ</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>01. What payment methods do you accept?</h4>
                            <p>
                                For the Developer API, we accept payments via credit card and PayPal. Enterprise
                                customers can also pay via invoice with NET30 terms.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>02. How does the Developer API pricing work?</h4>
                            <p>
                                Every account starts with 500 free API credits each month. If you need more, you can
                                subscribe to API Pro (5,000 credits/month for $19) or API Ultra (20,000 credits/month for $49).
                                Your monthly credit allowance resets at the start of each calendar month. You can also purchase
                                additional credit bundles anytime, which never expire and are consumed after your monthly allowance.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>03. What happens if I hit my monthly credit limit?</h4>
                            <p>
                                Once you reach your monthly credit allowance, the API will return an error message.
                                You can either wait for the next calendar month when your credits reset, upgrade to a
                                higher subscription tier, or purchase additional credit bundles to continue using the API immediately.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>04. What happens if I don't use all my monthly credits?</h4>
                            <p>
                                Unused monthly credits from your subscription do not roll over to the next month. At the start of
                                each calendar month, your monthly allowance resets. However, purchased credit bundles never expire
                                and remain in your account until used.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>05. How are credits consumed?</h4>
                            <p>
                                Credits are consumed in a specific order: first, your monthly subscription allowance is used.
                                Once your monthly allowance is exhausted, the system automatically uses your purchased credit bundles.
                                This ensures you always get the most value from your subscription before using pay-as-you-go credits.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>06. How will I be billed for my subscription?</h4>
                            <p>
                                Subscription plans (API Pro and API Ultra) are billed monthly at a fixed rate. You'll be charged
                                at the beginning of each billing cycle regardless of usage. Credit bundles are one-time purchases
                                charged immediately upon purchase. All payments are processed securely through Stripe.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>07. How do I cancel my subscription?</h4>
                            <p>
                                You can cancel your subscription at any time from your API dashboard. Once canceled,
                                you'll be downgraded to the free tier (500 credits/month) at the end of your current billing period.
                                Any purchased credit bundles will remain in your account and can still be used.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>08. Are there volume discounts for Enterprise?</h4>
                            <p>
                                Yes! Enterprise customers processing over 100,000 images per month can get custom
                                volume pricing. Contact our sales team at support@shrinkix.com to discuss your needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="dev-cta">
                <div className="dev-container">
                    <h2>Start optimizing your images today</h2>
                    <p>Get 500 free compressions every month, no credit card required</p>
                    <div className="cta-buttons">
                        <Link to="/developers" className="btn-primary">Get API Key</Link>
                        <Link to="/developers/how-it-works" className="btn-secondary">Learn More</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeveloperPricing;
