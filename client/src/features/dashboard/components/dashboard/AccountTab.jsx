import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import '../../../../styles/dashboard.css';

export default function AccountTab({ user }) {
    const [formData, setFormData] = useState({
        company: '',
        address: '',
        billingEmail: '',
        isVatRequired: false,
        vatNumber: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({ // eslint-disable-line react-hooks/set-state-in-effect
                company: user.company || '',
                address: user.address || '',
                billingEmail: user.billingEmail || user.email || '',
                isVatRequired: !!user.vatNumber,
                vatNumber: user.vatNumber || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send a PATCH request to update user profile
        console.log("Saving account details:", formData);
        alert("Account details saved! (Simulation)");
    };

    return (
        <div className="account-tab-container" style={{ maxWidth: '600px' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Account Details</h2>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#4a5568' }}>Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g. Acme Corp"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#4a5568' }}>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Full business address"
                        rows="3"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#4a5568' }}>Billing Email</label>
                    <input
                        type="email"
                        name="billingEmail"
                        value={formData.billingEmail}
                        onChange={handleChange}
                        className="form-input"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4a5568', fontWeight: 500 }}>
                        <input
                            type="checkbox"
                            name="isVatRequired"
                            checked={formData.isVatRequired}
                            onChange={handleChange}
                            style={{ width: '16px', height: '16px' }}
                        />
                        US VAT number or any other is required
                    </label>
                </div>

                {formData.isVatRequired && (
                    <div className="form-group" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#4a5568' }}>VAT Number</label>
                        <input
                            type="text"
                            name="vatNumber"
                            value={formData.vatNumber}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g. US123456789"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="primary-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={18} /> Save Details
                    </button>
                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #edf2f7' }}>
                        <h3 style={{ fontSize: '1.1rem', color: '#2d3748', marginBottom: '10px' }}>Invoice Details</h3>
                        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                            Your invoice details will be automatically generated based on the information provided above.
                            Download your latest invoices from the <a href="/dashboard/invoices" style={{ color: '#3182ce' }}>Invoices</a> section.
                        </p>
                    </div>
                </div>
            </form>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
