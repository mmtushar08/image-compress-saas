/**
 * Plan Breakdown Component
 * Shows user distribution across different plans
 */
export default function PlanBreakdown({ stats }) {
    if (!stats || !stats.planBreakdown) return null;

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
        <div className="plan-breakdown">
            <h2>Users by Plan</h2>
            <div className="plan-grid">
                {stats.planBreakdown.map(item => (
                    <div key={item.plan} className="plan-item">
                        <span className="plan-name">{formatPlan(item.plan)}</span>
                        <span className="plan-count">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
