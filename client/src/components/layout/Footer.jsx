import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <span className="footer-col-heading">Product</span>
                    <Link to="/">Home</Link>
                    <Link to="/blog">Blog</Link>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/wordpress">WordPress Plugin</Link>
                    <Link to="/about">About</Link>
                    <Link to="/login">Sign Up Free</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Compress</span>
                    <Link to="/compress-jpg">Compress JPG</Link>
                    <Link to="/compress-png">Compress PNG</Link>
                    <Link to="/compress-webp">Compress WebP</Link>
                    <Link to="/compress-avif">Compress AVIF</Link>
                    <Link to="/compress-image-to-kb">Compress to 100 KB</Link>
                    <Link to="/batch-image-compressor">Batch Compressor</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Convert</span>
                    <Link to="/jpg-to-webp">JPG to WebP</Link>
                    <Link to="/png-to-webp">PNG to WebP</Link>
                    <Link to="/avif-converter">AVIF Converter</Link>
                    <Link to="/convert-to-webp">Convert to WebP</Link>
                    <Link to="/compress">All Formats</Link>
                </div>
                <div className="footer-col">
                    <span className="footer-col-heading">Developers</span>
                    <Link to="/developers">Developer Hub</Link>
                    <Link to="/api-docs">API Docs</Link>
                    <Link to="/developers/pricing">API Pricing</Link>
                    <Link to="/developers/how-it-works">How It Works</Link>
                    <span className="footer-col-heading" style={{ marginTop: '1.25rem' }}>Legal</span>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Shrinkix. All rights reserved.</p>
                <p className="footer-tagline">Sharp compression. Zero storage. Built for the web.</p>
            </div>
        </footer>
    );
}
