import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';

export default function WebTab({ user }) {
    const navigate = useNavigate();

    return (
        <div className="status-card" style={{ textAlign: 'left', minHeight: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', background: '#e6fffa', borderRadius: '50%' }}>
                    <Crown size={32} color="#38b2ac" />
                </div>
                <h2 style={{ margin: 0 }}>Web Subscription</h2>
            </div>

            <div style={{ background: '#f7fafc', padding: '24px', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '8px' }}>Current Plan</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2d3748', marginBottom: '24px' }}>
                    {user.plan === 'web-ultra' ? 'Web Ultra' : 'Web Pro'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>Daily Compressions</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>Unlimited</div>
                    </div>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>Max File Size</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2d3748' }}>
                            {user.plan === 'web-ultra' ? '150 MB' : '75 MB'}
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>Status</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#48bb78' }}>Active</div>
                    </div>
                </div>

                <button className="primary-btn" style={{ width: 'auto' }} onClick={() => navigate('/pricing')}>
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
}
