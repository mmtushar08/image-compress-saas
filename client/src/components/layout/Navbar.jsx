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
                <Link to="/compress" className={`nav-link ${path === '/compress' ? 'active' : ''}`}>
                    Compress
                </Link>
                <Link to="/convert" className={`nav-link ${path === '/convert' ? 'active' : ''}`}>
                    Convert
                </Link>
                <Link to="/developers" className={`nav-link ${path.startsWith('/developers') ? 'active' : ''}`}>
                    API/Developers
                </Link>
                <Link to="/wordpress" className={`nav-link ${path === '/wordpress' ? 'active' : ''}`}>
                    WordPress
                </Link>
                <Link to="/pricing" className={`nav-link ${path === '/pricing' ? 'active' : ''}`}>
                    Pricing
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
