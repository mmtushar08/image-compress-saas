import { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import StatsCards from './admin/StatsCards';
import PlanBreakdown from './admin/PlanBreakdown';
import UserTable from './admin/UserTable';
import UserDetailsModal from './admin/UserDetailsModal';
import '../../../styles/admin.css';

/**
 * Admin Panel Main Component
 * Manages admin authentication and coordinates child components
 */
export default function Admin() {
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);

    // Check if admin key is valid on mount
    useEffect(() => {
        if (adminKey) {
            verifyAdminKey(adminKey);
        }
    }, []);

    const verifyAdminKey = async (key) => {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'x-admin-key': key }
            });

            if (response.ok) {
                setIsAuthenticated(true);
                setAdminKey(key);
                localStorage.setItem('adminKey', key);
                setError('');
                fetchStats(key);
                fetchUsers(1, key);
            } else {
                setError('Invalid admin key');
                setIsAuthenticated(false);
                localStorage.removeItem('adminKey');
            }
        } catch (err) {
            setError('Failed to verify admin key');
        }
    };

    const handleLogin = (key) => {
        verifyAdminKey(key);
    };

    const handleLogout = () => {
        setAdminKey('');
        setIsAuthenticated(false);
        localStorage.removeItem('adminKey');
    };

    const fetchStats = async (key = adminKey) => {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'x-admin-key': key }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const fetchUsers = async (page = 1, key = adminKey) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 50,
                ...(searchTerm && { search: searchTerm }),
                ...(filterPlan && { plan: filterPlan })
            });

            const response = await fetch(`/api/admin/users?${params}`, {
                headers: { 'x-admin-key': key }
            });
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
                setCurrentPage(page);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} error={error} />;
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>📊 Admin Dashboard</h1>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </header>

            <StatsCards stats={stats} />
            <PlanBreakdown stats={stats} />

            <UserTable
                users={users}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterPlan={filterPlan}
                setFilterPlan={setFilterPlan}
                onSearch={handleSearch}
                onViewUser={setSelectedUser}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <UserDetailsModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </div>
    );
}
