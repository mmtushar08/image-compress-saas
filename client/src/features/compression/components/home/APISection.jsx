export default function APISection() {
    return (
        <section className="api-section">
            <div className="section-container">
                <div className="api-content">
                    <div className="api-text">
                        <h2>Image optimization via API</h2>
                        <p>
                            Shrinkix provides a fast, simple API for automatic image compression and conversion at scale.
                        </p>
                        <ul className="api-benefits">
                            <li>No dashboards to manage.</li>
                            <li>No files stored.</li>
                            <li>Just optimized images delivered instantly.</li>
                        </ul>
                        <a href="/api-docs" className="btn btn-primary">View API documentation</a>
                    </div>
                    <div className="api-code">
                        <div className="code-block">
                            <div className="code-header">
                                <span className="code-lang">Node.js</span>
                            </div>
                            <pre><code>{`const shrinkix = require('shrinkix');

shrinkix.key = 'YOUR_API_KEY';

const source = shrinkix.fromFile('input.jpg');
source.toFile('output.jpg');`}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
