import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const WEB_LINKS = [
    { href: '/compress-jpg',           label: 'Compress JPG' },
    { href: '/compress-png',           label: 'Compress PNG' },
    { href: '/compress-webp',          label: 'Compress WebP' },
    { href: '/compress-avif',          label: 'Compress AVIF' },
    { href: '/jpg-to-webp',            label: 'JPG → WebP' },
    { href: '/png-to-webp',            label: 'PNG → WebP' },
    { href: '/avif-converter',         label: 'AVIF Converter' },
    { href: '/batch-image-compressor', label: 'Batch Compressor' },
    { href: '/pricing',                label: 'Web Pricing', divider: true },
];

const API_LINKS = [
    { href: '/developers',             label: 'Overview' },
    { href: '/docs',                   label: 'Documentation' },
    { href: '/developers/how-it-works',label: 'How It Works' },
    { href: '/developers/pricing',     label: 'API Pricing', divider: true },
    { href: '/login',                  label: 'Get API Key' },
];

function Dropdown({ label, links, isActive }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="nav-dropdown" ref={ref}>
            <button
                className={`nav-link nav-dropdown-btn ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                {label}
                <span className={`nav-chevron ${open ? 'open' : ''}`}>▾</span>
            </button>
            {open && (
                <div className="nav-dropdown-menu" role="menu">
                    {links.map((link, i) => (
                        <span key={i}>
                            {link.divider && <div className="nav-dropdown-divider" />}
                            <Link
                                to={link.href}
                                className="nav-dropdown-item"
                                role="menuitem"
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const location = useLocation();
    const path = location.pathname;
    const isLoggedIn = !!(localStorage.getItem('shrinkix_auth') || localStorage.getItem('trimixo_auth'));

    const isWebActive = [
        '/compress-jpg', '/compress-jpeg', '/compress-png', '/compress-webp', '/compress-avif',
        '/jpg-to-webp', '/png-to-webp', '/avif-converter', '/batch-image-compressor',
        '/convert-to-webp', '/compress-image-to-kb', '/compress', '/convert', '/pricing',
    ].some(p => path === p || path.startsWith(p));

    const isApiActive = path.startsWith('/developers') || path === '/docs' || path === '/api-docs';

    return (
        <header className="navbar">
            <Link to="/" className="brand">shrinkix</Link>
            <nav className="nav-menu">
                <Dropdown label="Web" links={WEB_LINKS} isActive={isWebActive} />
                <Dropdown label="API" links={API_LINKS} isActive={isApiActive} />
                <Link to="/blog" className={`nav-link ${path === '/blog' ? 'active' : ''}`}>
                    Blog
                </Link>
                {isLoggedIn ? (
                    <Link to="/dashboard" className="nav-btn">Dashboard</Link>
                ) : (
                    <Link to="/login" className="nav-btn">Sign In</Link>
                )}
            </nav>
        </header>
    );
}
