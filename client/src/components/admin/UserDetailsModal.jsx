/**
 * User Details Modal Component
 * Displays detailed information for a selected user
 */
export default function UserDetailsModal({ user, onClose }) {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPlan = (plan) => {
        const planNames = {
            'free': 'Free',
            'web-pro': 'Web Pro',
            'web-ultra': 'Web Ultra',
            'api-pro': 'API Pro',
            'api-ultra': 'API Ultra'
        };
        return planNames[plan] || plan;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>User Details</h2>
                <div className="user-details">
                    <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">API Key:</span>
                        <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                            {user.apiKey}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Plan:</span>
                        <span className="detail-value">{formatPlan(user.plan)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Usage:</span>
                        <span className="detail-value">{user.usage || 0}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Credits:</span>
                        <span className="detail-value">{user.credits || 0}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">API Credits:</span>
                        <span className="detail-value">{user.apiCredits || 0}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">{formatDate(user.lastUsedDate)}</span>
                    </div>
                </div>
                <button onClick={onClose} className="btn-close">Close</button>
            </div>
        </div>
    );
}
