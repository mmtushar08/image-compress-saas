export default function StatsCounter() {
    return (
        <div className="dev-stats">
            <div className="dev-stats-inner">
                <div className="dev-stat">
                    <span className="dev-stat-number">60–80%</span>
                    <span className="dev-stat-label">Average size reduction</span>
                </div>
                <div className="dev-stat">
                    <span className="dev-stat-number">&lt; 2s</span>
                    <span className="dev-stat-label">Processing time</span>
                </div>
                <div className="dev-stat">
                    <span className="dev-stat-number">4</span>
                    <span className="dev-stat-label">Formats supported</span>
                </div>
                <div className="dev-stat">
                    <span className="dev-stat-number">99.9%</span>
                    <span className="dev-stat-label">API uptime</span>
                </div>
            </div>
        </div>
    );
}
