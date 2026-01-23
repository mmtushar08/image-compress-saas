import { Minus, Plus } from 'lucide-react';

export default function PlanSelector({
    activeTab,
    products,
    selectedPlanId,
    setSelectedPlanId,
    billingCycle,
    setBillingCycle,
    quantity,
    setQuantity
}) {
    const isOneTime = activeTab === 'credits';

    return (
        <div className="plan-selection-area">
            {!isOneTime && (
                <div className="billing-toggle">
                    <button
                        className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Yearly <span className="save-badge">SAVE 20%</span>
                    </button>
                </div>
            )}

            <div className="plans-grid">
                {products[activeTab].map(plan => (
                    <div
                        key={plan.id}
                        className={`plan-option ${selectedPlanId === plan.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPlanId(plan.id)}
                    >
                        <div className="plan-info">
                            <span className="plan-name">{plan.name}</span>
                            <span className="plan-sub">{plan.sub}</span>
                            <p className="plan-desc">{plan.desc}</p>
                        </div>
                        <div className="plan-price">
                            {isOneTime
                                ? `$${plan.price}`
                                : `$${billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly}`
                            }
                            {!isOneTime && <span className="period">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {isOneTime && (
                <div className="quantity-selector">
                    <label>Quantity</label>
                    <div className="qty-controls">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} type="button">
                            <Minus size={16} />
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} type="button">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
