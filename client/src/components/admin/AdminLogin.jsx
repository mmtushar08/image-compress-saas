import { useState } from 'react';
import '../../styles/admin.css';

/**
 * Admin Login Component
 * Handles admin authentication with API key
 */
export default function AdminLogin({ onLogin, error }) {
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(adminKey);
    };

    return (
        <div className="admin-login">
            <div className="admin-login-card">
                <h1>🔐 Admin Panel</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin API Key</label>
                        <input
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder="Enter admin API key"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}
