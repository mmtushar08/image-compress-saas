import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Crown, Minus, Plus, Image, RefreshCw, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/checkout.css';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51Pxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

export default function CheckoutWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    );
}

function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Support both 'plan' and 'tier' query params (Tinify uses 'tier')
    const initialPlan = searchParams.get('tier') || searchParams.get('plan') || 'pro';

    const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        companyName: '',
        taxId: '',
        address: '',
        city: '',
        zip: ''
    });
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });
    const [selectedPlan, setSelectedPlan] = useState((initialPlan === 'ultra' || initialPlan === 'business') ? 'ultra' : 'pro');
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: 'United States'
    });
    const [loading, setLoading] = useState(false);

    const plans = {
        pro: {
            name: 'Web Pro',
            sub: 'COMPRESS',
            desc: 'Unlimited image compression. Maximum file size is 75MB.',
            price: billingCycle === 'yearly' ? 39 : 5,
            period: billingCycle === 'yearly' ? 'year' : 'month'
        },
        ultra: {
            name: 'Web Ultra',
            sub: 'COMPRESS & CONVERT',
            desc: 'Unlimited image compression and conversion. Maximum file size is 150MB.',
            price: billingCycle === 'yearly' ? 59 : 9,
            period: billingCycle === 'yearly' ? 'year' : 'month'
        }
    };

    const totalPrice = plans[selectedPlan].price * quantity;

    const [emailSent, setEmailSent] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const auth = localStorage.getItem('trimixo_auth');
        if (auth) {
            try {
                const user = JSON.parse(auth);
                if (user.email) {
                    setFormData(prev => ({ ...prev, email: user.email }));
                }
            } catch (e) {
                // Ignore invalid json
            }
        }
    }, []);

    const stripe = useStripe();
    const elements = useElements();

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setLoading(true);

        try {
            // 1. Create Payment Intent on Backend
            // We pass the RAW plan name (e.g. 'pro' or 'web-ultra') so backend can lookup price
            const intentRes = await fetch('/api/payments/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan === 'pro' ? 'web-pro' : (selectedPlan === 'ultra' ? 'web-ultra' : 'free'),
                    billingCycle,
                    quantity
                })
            });

            const intentData = await intentRes.json();

            if (intentData.error) {
                alert(intentData.error);
                setLoading(false);
                return;
            }

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(intentData.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: formData.name,
                        email: formData.email,
                    },
                }
            });

            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                alert(result.error.message);
                setLoading(false);
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Register/Upgrade User
                    const registerRes = await fetch('/api/users/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: formData.email,
                            plan: selectedPlan === 'pro' ? 'web-pro' : (selectedPlan === 'ultra' ? 'web-ultra' : 'free'),
                            billingCycle,
                            invoiceData,
                            paymentIntentId: result.paymentIntent.id
                        })
                    });

                    const data = await registerRes.json();
                    if (data.success) {
                        setEmailSent(true);
                    } else {
                        alert(data.error || "Payment succeeded but registration failed. Please contact support.");
                    }
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong with the payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="checkout-page">
                <div className="checkout-container" style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '64px', height: '64px', background: '#eafaf1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Crown size={32} color="#27ae60" />
                        </div>
                        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>Payment Successful!</h1>
                        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
                            You've successfully subscribed to the <strong>{plans[selectedPlan].name}</strong> plan.
                            <br /><br />
                            We've sent a verification link to <strong>{formData.email}</strong>.
                            Please check your email to complete the activation and access your dashboard.
                        </p>
                        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <header className="checkout-header">
                    <h1>Sign up</h1>
                    <div className="trimixo-logo">
                        <div style={{ background: '#333', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>trimixo</span>
                            <div style={{ width: '24px', height: '14px', background: 'white', borderRadius: '10px' }}></div>
                        </div>
                    </div>
                </header>

                <div className="checkout-grid">
                    <div className="checkout-left">
                        <main className="checkout-main">

                            {/* Billing Cycle Toggle */}
                            <div className="billing-toggle-container">
                                <h2 className="section-title">Billing cycle</h2>
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
                                        Yearly <span className="save-badge">Save 17%</span>
                                    </button>
                                </div>
                            </div>

                            <h2 className="section-title">Subscription type</h2>

                            <div className="plan-cards">
                                <div
                                    className={`plan-card ${selectedPlan === 'pro' ? 'selected' : ''}`}
                                    onClick={() => setSelectedPlan('pro')}
                                >
                                    <div className="plan-badge">
                                        <div className="badge-icon"><Image size={14} /></div>
                                    </div>
                                    <Crown className="crown-icon" size={24} />
                                    <span className="plan-name">{plans.pro.name}</span>
                                    <span className="plan-type">{plans.pro.sub}</span>
                                    <p className="plan-desc">{plans.pro.desc}</p>
                                    <div className="card-price">${plans.pro.price}<small>/{plans.pro.period}</small></div>
                                </div>

                                <div
                                    className={`plan-card ${selectedPlan === 'ultra' ? 'selected' : ''}`}
                                    onClick={() => setSelectedPlan('ultra')}
                                >
                                    <div className="plan-badge">
                                        <div className="badge-icon"><Image size={14} /></div>
                                        <div className="badge-icon"><RefreshCw size={14} /></div>
                                    </div>
                                    <Crown className="crown-icon" size={24} />
                                    <span className="plan-name">{plans.ultra.name}</span>
                                    <span className="plan-type">{plans.ultra.sub}</span>
                                    <p className="plan-desc">{plans.ultra.desc}</p>
                                    <div className="card-price">${plans.ultra.price}<small>/{plans.ultra.period}</small></div>
                                </div>
                            </div>

                            <div className="quantity-bar">
                                <div className="price-info">
                                    ${plans[selectedPlan].price} per {plans[selectedPlan].name} user
                                    <span>{billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} subscription</span>
                                </div>
                                <div className="quantity-selector">
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="qty-value">{quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <h2 className="section-title">Personal information</h2>
                            <form id="checkout-form" className="checkout-form" onSubmit={handleCheckout}>
                                <div className="input-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Country</label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    >
                                        <option>United States</option>
                                        <option>United Kingdom</option>
                                        <option>Canada</option>
                                        <option>Germany</option>
                                        <option>France</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                            </form>
                        </main>

                        <div className="invoice-section">
                            <div
                                className="expandable-section"
                                onClick={() => setShowInvoice(!showInvoice)}
                                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <h2 className="section-title" style={{ margin: 0 }}>Add invoice details <span style={{ fontWeight: 400 }}>(optional)</span></h2>
                                {showInvoice ? <Minus size={20} color="#999" /> : <Plus size={20} color="#999" />}
                            </div>

                            {showInvoice && (
                                <div className="invoice-form fade-in">
                                    <div className="input-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="Acme Inc."
                                            value={invoiceData.companyName}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label>Tax ID / VAT</label>
                                            <input
                                                type="text"
                                                placeholder="US123456789"
                                                value={invoiceData.taxId}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, taxId: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-group" style={{ flex: 2 }}>
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                placeholder="123 Business St"
                                                value={invoiceData.address}
                                                onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="payment-section">
                            <h2 className="section-title">Payment method</h2>
                            <div className="payment-methods">
                                <div className="payment-method-card selected">
                                    <CreditCard className="method-icon" size={24} />
                                    <span className="method-name">Credit card</span>
                                </div>
                                <div className="payment-method-card faded">
                                    <div className="method-icon" style={{ display: 'flex', gap: '4px', fontWeight: 'bold' }}>
                                        <span style={{ color: '#003087' }}>Pay</span>
                                        <span style={{ color: '#009cde' }}>Pal</span>
                                    </div>
                                    <span className="method-name">PayPal (Coming Soon)</span>
                                </div>
                            </div>

                            <div className="card-details-form">
                                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
                                    <CardElement options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#9e2146',
                                            },
                                        },
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="checkout-sidebar">
                        <div className="order-summary">
                            <h2 className="section-title">Order summary</h2>
                            <div className="summary-details">
                                <div className="summary-item">
                                    <div className="item-name">{quantity}x {plans[selectedPlan].name} subscription</div>
                                    <div className="item-tax">Includes sales tax (if applicable)</div>
                                </div>
                                <div className="summary-total">${totalPrice}</div>
                            </div>

                            <p className="summary-terms">
                                By purchasing you agree to the <a href="#">terms of use</a>.
                            </p>

                            <button
                                type="submit"
                                form="checkout-form"
                                className="pay-button"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : `Pay $${totalPrice}`}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
