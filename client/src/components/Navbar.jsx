import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <header className="navbar">
            <Link to="/" className="brand">
                <span className="logo-icon">🐼</span> SmartCompress
            </Link>
            <nav className="nav-menu">
                <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to="/pricing" className={`nav-link ${path === '/pricing' ? 'active' : ''}`}>
                    Pricing
                </Link>
            </nav>
        </header>
    );
}
