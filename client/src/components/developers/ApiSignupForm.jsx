import { useState } from 'react';

export default function ApiSignupForm() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, plan: 'free' })
            });
            const data = await response.json();
            if (data.success) {
                setMessage('✅ Check your email for your API key!');
                setFormData({ name: '', email: '' });
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch {
            setMessage('❌ Failed to register. Please try again.');
        }
    };

    return (
        <div className="api-signup-card">
            <h3>Get your API key</h3>
            <form onSubmit={handleSubmit} className="api-form">
                <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <button type="submit" className="btn-primary">Get API Key</button>
            </form>
            {message && <p className="form-message">{message}</p>}
        </div>
    );
}
