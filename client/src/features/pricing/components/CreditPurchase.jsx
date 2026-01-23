import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Zap, TrendingUp, Package } from 'lucide-react';
import '../../../styles/creditPurchase.css';

const CREDIT_PACKAGES = [
    {
        id: 'credit-1.5k',
        name: '1.5K Credits',
        credits: 1500,
        price: 14,
        description: 'Perfect for occasional bursts',
        popular: false
    },
    {
        id: 'credit-3.5k',
        name: '3.5K Credits',
        credits: 3500,
        price: 28,
        description: 'Best value for growing teams',
        popular: true,
        savings: 12.5 // % savings vs small
    },
    {
        id: 'credit-6.5k',
        name: '6.5K Credits',
        credits: 6500,
        price: 56,
        description: 'Maximum capacity for scale',
        popular: false,
        savings: 6.25 // % savings vs growth
    }
];

export default function CreditPurchase() {
    const [selectedPackage, setSelectedPackage] = useState('credit-3.5k');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePurchase = () => {
        // Redirect to unified checkout with selected package
        navigate(`/checkout/credits?plan=${selectedPackage}`);
    };

    const pkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);

    return (
        <div className="credit-purchase-container">
            <div className="credit-purchase-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>Buy Credit Add-Ons</h1>
                <p className="subtitle">Boost your API quota for the current billing cycle</p>
            </div>

            <div className="credit-info-banner">
                <div className="info-item">
                    <Zap size={20} />
                    <span>Current cycle only</span>
                </div>
                <div className="info-item">
                    <Package size={20} />
                    <span>No rollover</span>
                </div>
                <div className="info-item">
                    <TrendingUp size={20} />
                    <span>Instant activation</span>
                </div>
            </div>

            <div className="packages-grid">
                {CREDIT_PACKAGES.map((pack) => (
                    <div
                        key={pack.id}
                        className={`package-card ${selectedPackage === pack.id ? 'selected' : ''} ${pack.popular ? 'popular' : ''}`}
                        onClick={() => setSelectedPackage(pack.id)}
                    >
                        {pack.popular && <div className="popular-badge">Most Popular</div>}

                        <h3>{pack.name}</h3>
                        <div className="package-credits">
                            +{pack.credits.toLocaleString()}
                            <span className="credits-label">images</span>
                        </div>

                        <div className="package-price">
                            <span className="currency">$</span>
                            <span className="amount">{pack.price}</span>
                            <span className="period">one-time</span>
                        </div>

                        {pack.savings && (
                            <div className="savings-badge">
                                Save {pack.savings}%
                            </div>
                        )}

                        <p className="package-description">{pack.description}</p>

                        <div className="package-details">
                            <div className="detail-item">
                                <span>Per image:</span>
                                <strong>${(pack.price / pack.credits).toFixed(3)}</strong>
                            </div>
                            <div className="detail-item">
                                <span>Expires:</span>
                                <strong>End of cycle</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="purchase-summary">
                <div className="summary-content">
                    <div className="summary-left">
                        <h3>Purchase Summary</h3>
                        <p className="summary-package">{pkg.name}</p>
                        <p className="summary-credits">+{pkg.credits.toLocaleString()} images</p>
                    </div>
                    <div className="summary-right">
                        <div className="summary-price">
                            <span className="price-label">Total</span>
                            <span className="price-amount">${pkg.price}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button
                    className="purchase-btn"
                    onClick={handlePurchase}
                    disabled={loading}
                >
                    <CreditCard size={20} />
                    {loading ? 'Processing...' : 'Continue to Payment'}
                </button>

                <p className="purchase-note">
                    Credits will be added to your account immediately after payment.
                    They apply only to the current billing cycle and do not roll over.
                </p>
            </div>
        </div>
    );
}
