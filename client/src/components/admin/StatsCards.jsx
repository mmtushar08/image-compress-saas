import { Users, Activity, TrendingUp, DollarSign } from 'lucide-react';

/**
 * Statistics Cards Component
 * Displays key metrics in card format
 */
export default function StatsCards({ stats }) {
    if (!stats) return null;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon"><Users size={24} /></div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon"><Activity size={24} /></div>
                <div className="stat-content">
                    <div className="stat-value">{stats.activeUsers}</div>
                    <div className="stat-label">Active Users (30d)</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon"><TrendingUp size={24} /></div>
                <div className="stat-content">
                    <div className="stat-value">{stats.recentSignups}</div>
                    <div className="stat-label">New Signups (7d)</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon"><DollarSign size={24} /></div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalCompressions.toLocaleString()}</div>
                    <div className="stat-label">Total Compressions</div>
                </div>
            </div>
        </div>
    );
}
