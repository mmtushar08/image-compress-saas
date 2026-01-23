import { Crown, Check, X } from 'lucide-react';

export default function PricingCard({
    title,
    price,
    period,
    monthlyPrice,
    features,
    buttonText,
    buttonAction,
    isPrimary = false,
    isFeatured = false,
    isCurrent = false,
    accentColor = '#3c78d8'
}) {
    // Determine style based on props
    const borderStyle = isFeatured || isPrimary ? `2px solid ${accentColor}` : '2px solid #e5e5e5';

    return (
        <div className={`pricing-card ${isFeatured ? 'featured' : ''}`} style={{ border: borderStyle, position: 'relative' }}>
            {isFeatured && (
                <div className="popular-tag" style={{
                    background: accentColor,
                    color: 'white',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    POPULAR
                </div>
            )}

            <div className="card-header">
                {title === 'Web Ultra' ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <h3>{title}</h3>
                        <Crown size={20} color={accentColor} />
                    </div>
                ) : (
                    <h3>{title}</h3>
                )}

                <span className="price">${price}{period && <small>/{period}</small>}</span>
                {monthlyPrice && (
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                        or ${monthlyPrice} / month
                    </div>
                )}
            </div>

            <ul className="features">
                {features.map((feature, idx) => (
                    <li key={idx}>
                        {feature.included ? (
                            <Check size={16} color="green" />
                        ) : (
                            <X size={16} color="red" />
                        )}
                        <span dangerouslySetInnerHTML={{ __html: feature.text }} />
                    </li>
                ))}
            </ul>

            <button
                className={`plan-btn ${isPrimary ? 'primary' : 'current'}`}
                onClick={buttonAction}
                disabled={isCurrent}
                style={isPrimary ? { background: accentColor === '#8bc34a' ? '#8bc34a' : '#333', color: 'white' } : {}}
            >
                {buttonText}
            </button>
        </div>
    );
}
