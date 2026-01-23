import { CardElement } from '@stripe/react-stripe-js';
import { CreditCard, Image, RefreshCw, CheckCircle } from 'lucide-react';

export default function PaymentForm({
    formData,
    setFormData,
    errors,
    loading,
    emailSent,
    handleCheckout,
    total,
    showInvoice,
    setShowInvoice,
    invoiceData,
    setInvoiceData
}) {
    if (emailSent) {
        return (
            <div className="success-screen">
                <CheckCircle size={64} color="#4caf50" />
                <h2>Payment Successful!</h2>
                <p>Thank you for your purchase. A receipt has been sent to your email.</p>
                <div className="next-actions">
                    <button className="btn-primary" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleCheckout} className="payment-form">
            <div className="form-section">
                <h4>Contact Information</h4>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? 'error' : ''}
                        placeholder="John Doe"
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? 'error' : ''}
                        placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
            </div>

            <div className="form-section">
                <h4>Payment Details</h4>
                <div className="stripe-card-container">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                        },
                    }} />
                </div>
                <div className="secure-badge">
                    <CreditCard size={14} />
                    Secure payment powered by Stripe
                </div>
            </div>

            <div className="invoice-toggle">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={showInvoice}
                        onChange={e => setShowInvoice(e.target.checked)}
                    />
                    I need an invoice
                </label>
            </div>

            {showInvoice && (
                <div className="invoice-details form-section">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input value={invoiceData.companyName} onChange={e => setInvoiceData({ ...invoiceData, companyName: e.target.value })} />
                    </div>
                </div>
            )}

            <button type="submit" className="pay-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={20} /> : `Pay $${total}`}
            </button>
        </form>
    );
}
