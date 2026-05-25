import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/">Home</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/developers">Developers</Link>
                <Link to="/api-docs">API Docs</Link>
                <Link to="/about">About</Link>
                <Link to="/privacy">Privacy</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
            <p>&copy; 2025 Shrinkix. All rights reserved.</p>
        </footer>
    );
}
