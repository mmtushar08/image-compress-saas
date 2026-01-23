import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, BarChart3, Clock, Zap, Copy, Check, TrendingUp, Calendar } from 'lucide-react';
import '../../../styles/dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [usageStats, setUsageStats] = useState(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('shrinkix_auth') || localStorage.getItem('trimixo_auth'));
        if (!auth) {
            navigate('/signup');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/users/profile', {
                    headers: auth.apiKey ? { 'Authorization': `Bearer ${auth.apiKey}` } : {}
                    // credentials defaults to 'same-origin', effectively using the cookie
                });
                if (!res.ok) {
                    localStorage.removeItem('shrinkix_auth');
                    navigate('/signup');
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch {
                console.error("Failed to fetch profile");
            }
        };

        const fetchUsageStats = async () => {
            try {
                const res = await fetch('/api/usage/stats', {
                    headers: auth.apiKey ? { 'Authorization': `Bearer ${auth.apiKey}` } : {}
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsageStats(data);
                }
            } catch {
                console.error("Failed to fetch usage stats");
            }
        };

        fetchProfile();
        fetchUsageStats();
    }, [navigate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user) return <div className="loading">Loading dashboard...</div>;

    // Use new usage stats if available, fallback to old data
    const usage = usageStats?.usage || { used: user.usage, remaining: user.credits - user.usage, total: user.credits, percentage: 0 };
    const plan = usageStats?.plan || { name: user.plan, base_limit: user.credits };
    const addons = usageStats?.addons || { current_credits: 0, purchase_history: [] };
    const cycle = usageStats?.cycle || {};

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome back!</h1>
                    <p>{user.email}</p>
                </div>
                <div className="plan-badge">{(plan.name || user.plan).toUpperCase()} PLAN</div>
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
                            <span className="label">Used This Month</span>
                            <span className="value">{usage.used.toLocaleString()} images</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Remaining Credits</span>
                            <span className="value highlight">{usage.remaining.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Total Available</span>
                            <span className="value">{usage.total.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="progress-container">
                        <div className="progress-label">
                            <span>Plan Limit</span>
                            <span>{usage.percentage}%</span>
                        </div>
                        <div className="progress-bar-small">
                            <div className="progress-fill" style={{ width: `${Math.min(usage.percentage, 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Add-On Credits (if any) */}
                {addons.current_credits > 0 && (
                    <div className="dash-card addon-card">
                        <div className="card-top">
                            <TrendingUp size={20} />
                            <h3>Credit Add-Ons</h3>
                        </div>
                        <div className="stats-main">
                            <div className="stat-item">
                                <span className="label">Bonus Credits</span>
                                <span className="value highlight">+{addons.current_credits.toLocaleString()}</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">Purchases</span>
                                <span className="value">{addons.purchase_history.length}</span>
                            </div>
                        </div>
                        {addons.purchase_history.length > 0 && (
                            <div className="addon-history">
                                <p className="hint">Last purchase: {addons.purchase_history[addons.purchase_history.length - 1].type.replace('-', ' ')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Account Details */}
                <div className="dash-card info-card">
                    <div className="card-top">
                        <Calendar size={20} />
                        <h3>Account Info</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-row">
                            <span>Subscription</span>
                            <strong>{plan.name || user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</strong>
                        </div>
                        <div className="info-row">
                            <span>Base Limit</span>
                            <strong>{plan.base_limit?.toLocaleString() || user.credits.toLocaleString()} images/mo</strong>
                        </div>
                        {cycle.days_until_reset && (
                            <div className="info-row">
                                <span>Resets In</span>
                                <strong>{cycle.days_until_reset} days</strong>
                            </div>
                        )}
                        <div className="info-row">
                            <span>Max File Size</span>
                            <strong>{plan.max_file_size_mb || '5'} MB</strong>
                        </div>
                    </div>
                    <button className="upgrade-dash-btn buy-credits-btn" onClick={() => navigate('/buy-credits')}>
                        <TrendingUp size={16} /> Buy Credit Add-Ons
                    </button>
                    <button className="upgrade-dash-btn" onClick={() => navigate('/pricing')}>
                        <Zap size={16} fill="currentColor" /> Upgrade Plan
                    </button>
                </div>
            </div>

            <div className="dashboard-footer">
                <button className="logout-btn" onClick={() => { localStorage.removeItem('shrinkix_auth'); navigate('/'); }}>
                    Log out
                </button>
            </div>
        </div>
    );
}
