import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useCheckout from '../../../hooks/useCheckout';
import CheckoutTabs from './checkout/CheckoutTabs';
import PlanSelector from './checkout/PlanSelector';
import OrderSummary from './checkout/OrderSummary';
import PaymentForm from './checkout/PaymentForm';
import '../../../styles/checkout.css';

const stripePromise = loadStripe('pk_test_51Pxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

function CheckoutContent() {
    const { state, actions } = useCheckout();
    const {
        activeTab, billingCycle, selectedPlanId, selectedPlan, quantity,
        showInvoice, invoiceData, formData, errors, loading, emailSent, products
    } = state;
    const {
        setActiveTab, setBillingCycle, setSelectedPlanId, setQuantity,
        setShowInvoice, setInvoiceData, setFormData, handleCheckout, calculateTotal
    } = actions;

    const total = calculateTotal();

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1>Complete your purchase</h1>
                </div>

                <div className="checkout-grid">
                    <div className="checkout-main">
                        <CheckoutTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        <div className="section-title">Select Plan</div>
                        <PlanSelector
                            activeTab={activeTab}
                            products={products}
                            selectedPlanId={selectedPlanId}
                            setSelectedPlanId={setSelectedPlanId}
                            billingCycle={billingCycle}
                            setBillingCycle={setBillingCycle}
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />

                        <div className="section-title" style={{ marginTop: '32px' }}>Payment Details</div>
                        <PaymentForm
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            loading={loading}
                            emailSent={emailSent}
                            handleCheckout={handleCheckout}
                            total={total}
                            showInvoice={showInvoice}
                            setShowInvoice={setShowInvoice}
                            invoiceData={invoiceData}
                            setInvoiceData={setInvoiceData}
                        />
                    </div>

                    <div className="checkout-right">
                        <OrderSummary
                            selectedPlan={selectedPlan}
                            quantity={quantity}
                            total={total}
                            billingCycle={billingCycle}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutContent />
        </Elements>
    );
}
