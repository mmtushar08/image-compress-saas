import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TOOLS = [
    { href: '/compress-jpeg', label: 'Compress JPEG' },
    { href: '/compress-png', label: 'Compress PNG' },
    { href: '/compress-webp', label: 'Compress WebP' },
    { href: '/compress-avif', label: 'Compress AVIF' },
    { href: '/convert-to-webp', label: 'Convert to WebP' },
    { href: '/compress-image-to-kb', label: 'Compress to 100 KB' },
];

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    const isLoggedIn = !!(localStorage.getItem('shrinkix_auth') || localStorage.getItem('trimixo_auth'));
    const [toolsOpen, setToolsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isToolsActive = TOOLS.some(t => path === t.href);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setToolsOpen(false);
    }, [path]);

    return (
        <header className="navbar">
            <Link to="/" className="brand">
                Shrinkix
            </Link>
            <nav className="nav-menu">
                <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
                    Home
                </Link>

                <div className="nav-dropdown" ref={dropdownRef}>
                    <button
                        className={`nav-link nav-dropdown-toggle ${isToolsActive ? 'active' : ''}`}
                        onClick={() => setToolsOpen(o => !o)}
                        aria-expanded={toolsOpen}
                        aria-haspopup="true"
                    >
                        Tools <span className={`nav-chevron ${toolsOpen ? 'open' : ''}`}>▾</span>
                    </button>
                    {toolsOpen && (
                        <div className="nav-dropdown-menu" role="menu">
                            {TOOLS.map(tool => (
                                <Link
                                    key={tool.href}
                                    to={tool.href}
                                    className={`nav-dropdown-item ${path === tool.href ? 'active' : ''}`}
                                    role="menuitem"
                                >
                                    {tool.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

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
