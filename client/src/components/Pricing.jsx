import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Check, X } from 'lucide-react';
import '../styles/checkout.css'; // Re-use some styles or add new ones

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <section className="pricing-section">
            <div className="pricing-header">
                <h2>Simple, Transparent Pricing</h2>
                <p>Choose the web plan that fits your needs.</p>
            </div>

            <div className="pricing-cards" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Free Plan */}
                <div className="pricing-card">
                    <div className="card-header">
                        <h3>Free</h3>
                        <span className="price">$0</span>
                    </div>
                    <ul className="features">
                        <li><Check size={16} color="green" /> Up to 5 MB per file</li>
                        <li><Check size={16} color="green" /> Max 20 images per day</li>
                        <li><Check size={16} color="green" /> Web Interface Only</li>
                        <li><X size={16} color="red" /> No Priority Support</li>
                    </ul>
                    <button className="plan-btn current" disabled>Current Plan</button>
                </div>

                {/* Web Pro Plan */}
                <div className="pricing-card featured" style={{ border: '2px solid #3c78d8', position: 'relative' }}>
                    <div className="popular-tag" style={{ background: '#3c78d8', color: 'white', position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>POPULAR</div>
                    <div className="card-header">
                        <h3>Web Pro</h3>
                        <span className="price">$39<small>/year</small></span>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>or $5 / month</div>
                    </div>
                    <ul className="features">
                        <li><Check size={16} color="green" /> <strong>Unlimited</strong> images</li>
                        <li><Check size={16} color="green" /> <strong>75 MB</strong> file size limit</li>
                        <li><Check size={16} color="green" /> Web Interface Only</li>
                        <li><Check size={16} color="green" /> Priority Support</li>
                    </ul>
                    <button className="plan-btn primary" onClick={() => navigate('/checkout?tier=pro')} style={{ background: '#333', color: 'white' }}>Upgrade to Pro</button>
                </div>

                {/* Web Ultra Plan */}
                <div className="pricing-card" style={{ border: '2px solid #8bc34a' }}>
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <h3>Web Ultra</h3>
                            <Crown size={20} color="#8bc34a" />
                        </div>
                        <span className="price">$59<small>/year</small></span>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>or $9 / month</div>
                    </div>
                    <ul className="features">
                        <li><Check size={16} color="green" /> <strong>Unlimited</strong> images</li>
                        <li><Check size={16} color="green" /> <strong>150 MB</strong> file size limit</li>
                        <li><Check size={16} color="green" /> Web Interface Only</li>
                        <li><Check size={16} color="green" /> Highest Priority</li>
                    </ul>
                    <button className="plan-btn primary" onClick={() => navigate('/checkout?tier=ultra')} style={{ background: '#8bc34a', color: 'white' }}>Upgrade to Ultra</button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
                <p>Looking for API access? <a href="/developers" style={{ color: '#3c78d8', textDecoration: 'none' }}>Check out our Developer API plans</a></p>
            </div>
        </section>
    );
}
