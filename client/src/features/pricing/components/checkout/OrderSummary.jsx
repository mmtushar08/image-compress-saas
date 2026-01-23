export default function OrderSummary({ selectedPlan, quantity, total, billingCycle }) {
    if (!selectedPlan) return null;

    const isOneTime = selectedPlan.oneTime;

    return (
        <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
                <span>{selectedPlan.name}</span>
                <span>
                    {selectedPlan.id === 'api-payg' ? (
                        'Usage Based (Monthly)'
                    ) : (
                        isOneTime
                            ? `$${selectedPlan.price} x ${quantity}`
                            : `$${billingCycle === 'yearly' ? selectedPlan.priceYearly : selectedPlan.priceMonthly}/${billingCycle === 'yearly' ? 'yr' : 'mo'}`
                    )}
                </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
                <span>Total</span>
                <span>${total}</span>
            </div>
        </div>
    );
}
