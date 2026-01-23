import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, MoreVertical, Edit2, Ban, Check, X, Trash2 } from 'lucide-react';

export default function ApiTab({ user }) {
    const navigate = useNavigate();

    // Initialize keys with user's default key. In a real app, this would be a list from DB.
    const [keys, setKeys] = useState([
        {
            id: 'default',
            description: 'Default API Key',
            usage: user.usage,
            apiKey: user.apiKey,
            status: 'Active',
            isRenaming: false
        }
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [tempName, setTempName] = useState("");

    const handleAddKey = () => {
        // Simulation of adding a new key
        const newKey = {
            id: Date.now().toString(),
            description: `API Key ${keys.length + 1}`,
            usage: 0,
            apiKey: 'tr_' + Math.random().toString(36).substring(2, 18),
            status: 'Active',
            isRenaming: false
        };
        setKeys([...keys, newKey]);
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleAction = (id, action) => {
        setActiveDropdown(null);
        if (action === 'disable') {
            setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === 'Active' ? 'Disabled' : 'Active' } : k));
        } else if (action === 'rename') {
            setKeys(keys.map(k => {
                if (k.id === id) {
                    setTempName(k.description); // Init temp name
                    return { ...k, isRenaming: true };
                }
                return k;
            }));
        } else if (action === 'delete') {
            if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
                setKeys(keys.filter(k => k.id !== id));
            }
        }
    };

    const saveRename = (id) => {
        setKeys(keys.map(k => k.id === id ? { ...k, description: tempName, isRenaming: false } : k));
    };

    const cancelRename = (id) => {
        setKeys(keys.map(k => k.id === id ? { ...k, isRenaming: false } : k));
    };

    // Close dropdowns when clicking outside (simple implementation)
    // In production, use a click-outside hook or Headless UI

    return (
        <>
            <div className="dash-heading">
                <h1>API</h1>
                <div className="toggle-switch">
                    <div className="toggle-knob"></div>
                </div>
            </div>
            <p className="subtitle">Thanks for being an awesome member. Drop us a line at support@shrinkix.com if you have any questions!</p>

            <div className="status-card">
                <h2>Your API account is ready to use!</h2>
                <p>Your monthly API usage will be displayed here once you have made the first successful compression.</p>
                <p>Drop us a line at support@shrinkix.com if you have any questions.</p>
            </div>

            <h3 className="section-title">Available API keys</h3>
            <div className="keys-card" style={{ overflow: 'visible' }}> {/* Allow dropdown overflow */}
                <div className="keys-header">
                    <div>Description</div>
                    <div>Compressions</div>
                    <div>API Key</div>
                    <div>Status</div>
                    <div></div>
                </div>

                {keys.map((key) => (
                    <div className="keys-row" key={key.id} style={{ opacity: key.status === 'Disabled' ? 0.6 : 1 }}>
                        <div>
                            {key.isRenaming ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                                        autoFocus
                                    />
                                    <button onClick={() => saveRename(key.id)} style={{ padding: '4px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check size={14} /></button>
                                    <button onClick={() => cancelRename(key.id)} style={{ padding: '4px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X size={14} /></button>
                                </div>
                            ) : (
                                key.description
                            )}
                        </div>
                        <div>{key.usage}</div>
                        <div className="key-value" style={{ textDecoration: key.status === 'Disabled' ? 'line-through' : 'none' }}>
                            {key.apiKey}
                        </div>
                        <div className={key.status === 'Active' ? "status-active" : "status-disabled"} style={{ color: key.status === 'Active' ? '#48bb78' : '#a0aec0', fontWeight: 600 }}>
                            {key.status}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div onClick={() => toggleDropdown(key.id)} style={{ cursor: 'pointer', padding: '4px' }}>
                                <MoreVertical size={16} color="#cbd5e0" />
                            </div>

                            {activeDropdown === key.id && (
                                <div className="dropdown-menu shadow-lg" style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    width: '160px',
                                    zIndex: 50,
                                    padding: '4px 0',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}>
                                    <button
                                        onClick={() => handleAction(key.id, 'rename')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: '#4a5568' }}
                                        onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                                        onMouseLeave={(e) => e.target.style.background = 'none'}
                                    >
                                        <Edit2 size={14} /> Rename
                                    </button>
                                    <button
                                        onClick={() => handleAction(key.id, 'disable')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: key.status === 'Active' ? '#e53e3e' : '#48bb78' }}
                                        onMouseEnter={(e) => e.target.style.background = '#f7fafc'}
                                        onMouseLeave={(e) => e.target.style.background = 'none'}
                                    >
                                        <Ban size={14} /> {key.status === 'Active' ? 'Disable' : 'Enable'}
                                    </button>
                                    <div style={{ height: '1px', background: '#edf2f7', margin: '4px 0' }}></div>
                                    <button
                                        onClick={() => handleAction(key.id, 'delete')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: '#c53030' }}
                                        onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                                        onMouseLeave={(e) => e.target.style.background = 'none'}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="api-footer">
                    <span className="api-footer-text">Detailed information and code samples are available in the <a href="/developers" style={{ color: '#38b2ac', textDecoration: 'none' }}>API reference</a>.</span>
                    <button className="add-key-btn" onClick={handleAddKey}>Add API key</button>
                </div>
            </div>

            <div className="split-cards">
                <div className="action-card">
                    <h3>Prepaid credit bundles</h3>
                    <p>Work more flexibly with prepaid credits. Purchase a bundle upfront and use your credits at your own pace with no commitments.</p>
                    <p style={{ marginTop: 0 }}>You currently have <strong>{user.plan === 'free' ? '500' : user.credits}</strong> credits left.</p>
                    <button className="primary-btn" onClick={() => navigate('/checkout/credit?tier=credit-5k')}>Buy extra credits</button>
                </div>

                <div className="action-card">
                    <h3>Upgrade to pay-per-compression</h3>
                    <p>You are currently limited to <strong>{user.plan === 'free' ? '500 free compressions' : 'your plan limit'}</strong> per month.</p>
                    <button className="primary-btn" onClick={() => navigate('/developers/pricing')}>Upgrade to paid subscription</button>
                </div>
            </div>
        </>
    );
}
