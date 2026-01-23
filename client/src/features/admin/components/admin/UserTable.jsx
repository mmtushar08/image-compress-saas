/**
 * User Table Component
 * Displays paginated list of users with search and filter
 */
export default function UserTable({
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterPlan,
    setFilterPlan,
    onSearch,
    onViewUser,
    currentPage,
    totalPages,
    onPageChange
}) {
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
        <>
            {/* Search and Filter */}
            <div className="user-controls">
                <form onSubmit={onSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={filterPlan}
                        onChange={(e) => {
                            setFilterPlan(e.target.value);
                            onPageChange(1);
                        }}
                    >
                        <option value="">All Plans</option>
                        <option value="free">Free</option>
                        <option value="web-pro">Web Pro</option>
                        <option value="web-ultra">Web Ultra</option>
                        <option value="api-pro">API Pro</option>
                        <option value="api-ultra">API Ultra</option>
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Usage</th>
                            <th>Credits</th>
                            <th>Created</th>
                            <th>Last Used</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No users found</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td><span className={`plan-badge plan-${user.plan}`}>{formatPlan(user.plan)}</span></td>
                                    <td>{user.usage || 0}</td>
                                    <td>{user.credits || 0}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>{formatDate(user.lastUsedDate)}</td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => onViewUser(user)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
}
