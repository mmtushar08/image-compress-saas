import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../styles/Developers.css';

const HowItWorks = () => {
    return (
        <div className="developers-page how-it-works">
            {/* Hero Section */}
            <section className="dev-hero">
                <div className="dev-container">
                    <h1 className="dev-title">Compress, resize and convert your images with Shrinkix's Developer API</h1>
                    <p className="dev-subtitle">
                        Using the Developer API to optimize your images for web use, ensuring faster loading times
                        and better performance. Packed with powerful features to handle your images.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="dev-container">
                    <div className="feature-grid">
                        {/* Smart Compression */}
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Smart Lossy Compression</h3>
                            <p>
                                Our advanced algorithms reduce file size by up to 80% while maintaining visual quality.
                                Using techniques similar to TinyPNG, we analyze each image and apply optimal compression
                                settings automatically.
                            </p>
                            <ul className="feature-list">
                                <li>Automatic quality optimization</li>
                                <li>Preserves visual fidelity</li>
                                <li>Up to 80% size reduction</li>
                                <li>Works with PNG, JPEG, and WebP</li>
                            </ul>
                        </div>

                        {/* Resize & Crop */}
                        <div className="feature-card">
                            <div className="feature-icon">✂️</div>
                            <h3>Intelligent Resizing</h3>
                            <p>
                                Resize images while maintaining aspect ratio or crop to exact dimensions. Our smart
                                algorithm detects areas of interest and keeps them centered in the final image.
                            </p>
                            <ul className="feature-list">
                                <li><strong>Fit:</strong> Scale within dimensions</li>
                                <li><strong>Cover:</strong> Fill dimensions, crop excess</li>
                                <li><strong>Scale:</strong> Proportional resize</li>
                                <li>Smart area of interest detection</li>
                            </ul>
                        </div>

                        {/* Format Conversion */}
                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3>Format Conversion</h3>
                            <p>
                                Convert between PNG, JPEG, and WebP formats seamlessly. Optimize for modern browsers
                                with WebP while maintaining fallbacks for older systems.
                            </p>
                            <ul className="feature-list">
                                <li>PNG ↔ JPEG ↔ WebP</li>
                                <li>Automatic format detection</li>
                                <li>Quality preservation</li>
                                <li>Metadata control</li>
                            </ul>
                        </div>

                        {/* API Features */}
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Developer-Friendly API</h3>
                            <p>
                                Simple REST API with support for multiple upload methods. Integrate in minutes with
                                our official SDKs or use raw HTTP requests.
                            </p>
                            <ul className="feature-list">
                                <li>Raw binary uploads</li>
                                <li>URL-based compression</li>
                                <li>Batch processing</li>
                                <li>Comprehensive documentation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Examples Section */}
            <section className="dev-section code-section">
                <div className="dev-container">
                    <h2>Quick Integration Examples</h2>

                    <div className="example-block">
                        <h3>Basic Compression</h3>
                        <div className="code-tabs">
                            <div className="code-block">
                                <h4>Node.js</h4>
                                <pre><code>{`const shrinkix = require("shrinkix");
shrinkix.key = "YOUR_API_KEY";

// Compress from file
const source = shrinkix.fromFile("input.jpg");
await source.toFile("output.jpg");

// Compress from URL
const urlSource = shrinkix.fromUrl("https://example.com/image.png");
await urlSource.toFile("compressed.png");`}</code></pre>
                            </div>

                            <div className="code-block">
                                <h4>Python</h4>
                                <pre><code>{`import shrinkix
shrinkix.key = "YOUR_API_KEY"

# Compress from file
source = shrinkix.from_file("input.jpg")
source.to_file("output.jpg")

# Compress from URL
url_source = shrinkix.from_url("https://example.com/image.png")
url_source.to_file("compressed.png")`}</code></pre>
                            </div>
                        </div>
                    </div>

                    <div className="example-block">
                        <h3>Resize & Convert</h3>
                        <div className="code-block">
                            <h4>Node.js</h4>
                            <pre><code>{`const shrinkix = require("shrinkix");
shrinkix.key = "YOUR_API_KEY";

const source = shrinkix.fromFile("input.jpg");

// Resize to fit within 800x600
const resized = source.resize({
  method: "fit",
  width: 800,
  height: 600
});

// Convert to WebP
await resized.toFile("output.webp");`}</code></pre>
                        </div>
                    </div>

                    <div className="example-block">
                        <h3>Raw HTTP Request</h3>
                        <div className="code-block">
                            <h4>cURL</h4>
                            <pre><code>{`# Basic compression
curl -X POST https://api.shrinkix.com/compress \\
  --user api:YOUR_API_KEY \\
  --data-binary @input.png \\
  -H "Accept: application/json"

# With resize parameters
curl -X POST https://api.shrinkix.com/compress \\
  --user api:YOUR_API_KEY \\
  --data-binary @input.png \\
  -H "Accept: application/json" \\
  -F "width=800" \\
  -F "height=600" \\
  -F "method=fit"`}</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="dev-container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>1B+</h3>
                            <p>Images Compressed</p>
                        </div>
                        <div className="stat-card">
                            <h3>80%</h3>
                            <p>Average Size Reduction</p>
                        </div>
                        <div className="stat-card">
                            <h3>100MB</h3>
                            <p>Max File Size</p>
                        </div>
                        <div className="stat-card">
                            <h3>99.9%</h3>
                            <p>Uptime SLA</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="dev-section faq-section">
                <div className="dev-container">
                    <h2>Technical FAQ</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>01. What image file types can I compress?</h4>
                            <p>
                                You can compress and convert your PNG, JPEG, and WebP images with the Developer API.
                                Animated formats are currently not supported but are on our roadmap.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>02. What is the maximum file size allowed for image compression?</h4>
                            <p>
                                To ensure highest service quality, the API has certain limitations. The maximum file
                                size permitted is 100MB for Enterprise plans (5MB for Free, 75MB for Pro), and images
                                should not exceed a maximum canvas size of 256MP (32000 pixels in width or height).
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>03. Can I integrate with automation platforms?</h4>
                            <p>
                                Yes! Our REST API can be integrated with platforms like Make.com, Zapier, and n8n.
                                You can automate image compression workflows with popular services like Dropbox,
                                Google Drive, and Shopify.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>04. Do you offer webhooks or callbacks?</h4>
                            <p>
                                Currently, all API operations are synchronous. Webhook support for async processing
                                is planned for Q2 2026. For batch operations, we recommend using our batch endpoint
                                which returns a ZIP file.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="dev-cta">
                <div className="dev-container">
                    <h2>Ready to optimize your images?</h2>
                    <p>Get your API key and start compressing in minutes</p>
                    <div className="cta-buttons">
                        <Link to="/developers" className="btn-primary">Get API Key</Link>
                        <Link to="/developers/pricing" className="btn-secondary">View Pricing</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
