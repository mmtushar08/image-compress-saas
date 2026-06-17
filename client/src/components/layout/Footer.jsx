import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <span className="footer-col-heading">Product</span>
                    <Link to="/">Home</Link>
                    <Link to="/compress">Compress Images</Link>
                    <Link to="/convert">Convert Images</Link>
                    <Link to="/wordpress">WordPress Plugin</Link>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/about">About</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Tools</span>
                    <Link to="/compress-jpeg">Compress JPEG</Link>
                    <Link to="/compress-png">Compress PNG</Link>
                    <Link to="/compress-webp">Compress WebP</Link>
                    <Link to="/compress-avif">Compress AVIF</Link>
                    <Link to="/convert-to-webp">Convert to WebP</Link>
                    <Link to="/compress-image-to-kb">Compress to 100 KB</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Developers</span>
                    <Link to="/developers">Developer Hub</Link>
                    <Link to="/developers/pricing">API Pricing</Link>
                    <Link to="/developers/how-it-works">How It Works</Link>
                    <Link to="/api-docs">API Docs</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Legal</span>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Shrinkix. All rights reserved.</p>
            </div>
        </footer>
    );
}
