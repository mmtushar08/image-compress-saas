import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    const isLoggedIn = !!(localStorage.getItem('shrinkix_auth') || localStorage.getItem('trimixo_auth'));

    return (
        <header className="navbar">
            <Link to="/" className="brand">
                Shrinkix
            </Link>
            <nav className="nav-menu">
                <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to="/pricing" className={`nav-link ${path === '/pricing' ? 'active' : ''}`}>
                    Pricing
                </Link>
                <Link to="/developers" className={`nav-link ${path.startsWith('/developers') ? 'active' : ''}`}>
                    Developers
                </Link>
                {isLoggedIn ? (
                    <Link to="/dashboard" className="nav-btn">
                        Dashboard
                    </Link>
                ) : (
                    <Link to="/login" className="nav-btn">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}
