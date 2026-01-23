import { useNavigate } from 'react-router-dom';
import { Monitor, Crown } from 'lucide-react';

export default function OverviewTab({ user }) {
    const navigate = useNavigate();

    // API Usage Logic
    let apiPlanName = 'Custom';
    if (user.plan === 'free') apiPlanName = 'Free Plan';
    else if (user.plan?.startsWith('api-')) apiPlanName = user.plan === 'api-ultra' ? 'API Ultra' : 'API Pro';
    else if (user.plan?.startsWith('web-')) apiPlanName = 'Free Plan (Web Bundle)';

    // Limits
    const apiLimit = user.apiCredits || 500;
    const apiUsage = user.usage || 0;
    const additionalCredits = user.credits || 0;

    // Progress bar calculation (based on monthly limit)
    const apiProgress = Math.min((apiUsage / apiLimit) * 100, 100);

    // Web Usage Logic
    // If user has a web plan, it's typically Unlimited. If free, maybe limited.
    // For now, assuming a similar structure if one existed, but defaulting to Unlimited for paid web plans.
    const isWebPaid = user.plan?.startsWith('web-');
    const webPlanName = isWebPaid ? (user.plan === 'web-ultra' ? 'Web Ultra' : 'Web Pro') : 'Free Web';
    const webLimit = isWebPaid ? 'Unlimited' : 50; // Example limit for free web
    const webUsage = user.webUsage || 0;
    const webProgress = webLimit === 'Unlimited' ? 100 : Math.min((webUsage / webLimit) * 100, 100);

    return (
        <div style={{ maxWidth: '900px' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Product Overview</h2>

            <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* API Card */}
                <div className="product-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #edf2f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '10px', background: '#ebf8ff', borderRadius: '50%', color: '#3182ce' }}>
                                <Monitor size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>API Subscription</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#718096' }}>{apiPlanName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/api')}
                            style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#3182ce', background: '#ebf8ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Manage
                        </button>
                    </div>

                    <div className="usage-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#4a5568' }}>
                            <span>Monthly Usage</span>
                            <span>{apiUsage} / {apiLimit} images</span>
                        </div>
                        <div className="progress-bar-bg" style={{ width: '100%', height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${apiProgress}%`,
                                    height: '100%',
                                    background: apiProgress > 90 ? '#e53e3e' : '#3182ce',
                                    borderRadius: '4px',
                                    transition: 'width 0.5s ease-in-out'
                                }}
                            ></div>
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#718096' }}>
                            Current billing cycle ends in 12 days.
                        </p>
                        {additionalCredits > 0 && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#2b6cb0', fontWeight: 600 }}>
                                <span>Extra Credits</span>
                                <span>{additionalCredits.toLocaleString()} available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Web Card */}
                <div className="product-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #edf2f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '10px', background: '#f0fff4', borderRadius: '50%', color: '#38b2ac' }}>
                                <Crown size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>Web Subscription</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#718096' }}>{webPlanName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/web')}
                            style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#2c7a7b', background: '#e6fffa', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Manage
                        </button>
                    </div>

                    <div className="usage-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#4a5568' }}>
                            <span>Monthly Usage</span>
                            <span>{webLimit === 'Unlimited' ? `${webUsage} images (Unlimited)` : `${webUsage} / ${webLimit} images`}</span>
                        </div>
                        <div className="progress-bar-bg" style={{ width: '100%', height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${webProgress}%`,
                                    height: '100%',
                                    background: webLimit === 'Unlimited' ? '#48bb78' : (webProgress > 90 ? '#e53e3e' : '#38b2ac'),
                                    borderRadius: '4px',
                                    transition: 'width 0.5s ease-in-out'
                                }}
                            ></div>
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#718096' }}>
                            {webLimit === 'Unlimited' ? 'Your plan has no compression limits.' : 'Upgrade to Web Pro for unlimited compressions.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
