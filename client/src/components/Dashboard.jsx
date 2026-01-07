import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, BarChart3, Clock, Zap, Copy, Check } from 'lucide-react';
import '../styles/dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('trimixo_auth'));
        if (!auth) {
            navigate('/signup');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${auth.apiKey}` }
                });
                if (!res.ok) {
                    localStorage.removeItem('trimixo_auth');
                    navigate('/signup');
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile");
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user) return <div className="loading">Loading dashboard...</div>;

    const usagePercent = user.plan === 'free'
        ? (user.usage % 20) / 20 * 100 // Visual representation for daily
        : (user.usage / user.credits) * 100;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome back!</h1>
                    <p>{user.email}</p>
                </div>
                <div className="plan-badge">{user.plan.toUpperCase()} PLAN</div>
            </header>

            <div className="dashboard-grid">
                {/* API Key Card */}
                <div className="dash-card key-card">
                    <div className="card-top">
                        <Key size={20} />
                        <h3>Your API Key</h3>
                    </div>
                    <div className="api-key-box">
                        <code>{user.apiKey}</code>
                        <button onClick={handleCopy} className="icon-btn">
                            {copied ? <Check size={18} color="#48c774" /> : <Copy size={18} />}
                        </button>
                    </div>
                    <p className="hint">Keep this key secret. Use it in the <code>Authorization</code> header as a Bearer token.</p>
                </div>

                {/* Usage Stats */}
                <div className="dash-card stats-card">
                    <div className="card-top">
                        <BarChart3 size={20} />
                        <h3>Usage Stats</h3>
                    </div>
                    <div className="stats-main">
                        <div className="stat-item">
                            <span className="label">Total Processed</span>
                            <span className="value">{user.usage} images</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Remaining Credits</span>
                            <span className="value">
                                {user.plan === 'free' ? 'Daily Refresh' : (user.credits - user.usage)}
                            </span>
                        </div>
                    </div>
                    <div className="progress-container">
                        <div className="progress-label">
                            <span>Plan Limit</span>
                            <span>{Math.round(usagePercent)}%</span>
                        </div>
                        <div className="progress-bar-small">
                            <div className="progress-fill" style={{ width: `${usagePercent}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="dash-card info-card">
                    <div className="card-top">
                        <Clock size={20} />
                        <h3>Account Info</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-row">
                            <span>Subscription</span>
                            <strong>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</strong>
                        </div>
                        <div className="info-row">
                            <span>Renews On</span>
                            <strong>{user.expiresAt ? new Date(user.expiresAt).toLocaleDateString() : 'N/A (Free)'}</strong>
                        </div>
                    </div>
                    <button className="upgrade-dash-btn" onClick={() => navigate('/pricing')}>
                        <Zap size={16} fill="currentColor" /> Upgrade Plan
                    </button>
                </div>
            </div>

            <div className="dashboard-footer">
                <button className="logout-btn" onClick={() => { localStorage.removeItem('trimixo_auth'); navigate('/'); }}>
                    Log out
                </button>
            </div>
        </div>
    );
}
