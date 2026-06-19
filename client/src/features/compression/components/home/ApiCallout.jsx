import { Link } from 'react-router-dom';

export default function ApiCallout() {
    return (
        <section className="api-callout-section">
            <div className="section-container">
                <div className="api-callout-inner">
                    <div className="api-callout-text">
                        <h2>Building something? Use our API.</h2>
                        <p>
                            Automate image compression at scale. Send an image, get back a smaller one.
                            No dashboards, no storage, no friction.
                        </p>
                        <ul className="api-callout-list">
                            <li>REST API with simple JSON responses</li>
                            <li>Supports PNG, JPG, WebP &amp; AVIF</li>
                            <li>Files deleted immediately after delivery</li>
                            <li>Pay-per-credit — no monthly surprises</li>
                        </ul>
                        <div className="api-callout-actions">
                            <Link to="/developers" className="btn btn-primary">View API Docs</Link>
                            <Link to="/developers/pricing" className="btn btn-ghost">See API Pricing</Link>
                        </div>
                    </div>
                    <div className="api-callout-code">
                        <div className="code-block">
                            <div className="code-header">
                                <span className="code-dot red" />
                                <span className="code-dot yellow" />
                                <span className="code-dot green" />
                                <span className="code-lang">Node.js</span>
                            </div>
                            <pre><code>{`const form = new FormData();
form.append('file', fs.createReadStream('photo.jpg'));

const res = await fetch('https://api.shrinkix.com/v1/compress', {
  method: 'POST',
  headers: { 'X-API-Key': 'YOUR_KEY' },
  body: form,
});

const { url, savings } = await res.json();
// savings: "68% smaller"`}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
