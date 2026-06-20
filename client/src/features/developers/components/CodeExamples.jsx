import { Link } from 'react-router-dom';

export default function CodeExamples() {
    return (
        <section className="dev-section alt">
            <div className="dev-section-inner">
                <span className="dev-section-label">Quick start</span>
                <h2 className="dev-section-title">Start compressing in minutes</h2>
                <p className="dev-section-subtitle">
                    No SDK needed — just an HTTP client and your API key.
                    The same endpoint handles compression, conversion, and resizing.
                </p>

                <div className="dev-quickstart">
                    <div className="dev-steps">
                        <div className="dev-step">
                            <div className="dev-step-num">1</div>
                            <div className="dev-step-content">
                                <h3>Sign up and get your API key</h3>
                                <p>
                                    <Link to="/signup">Create a free account</Link> — no credit card needed.
                                    Your API key appears in the{' '}
                                    <Link to="/dashboard/api">API Dashboard</Link> immediately.
                                </p>
                            </div>
                        </div>
                        <div className="dev-step">
                            <div className="dev-step-num">2</div>
                            <div className="dev-step-content">
                                <h3>Install an HTTP client</h3>
                                <p>
                                    For Node.js: <code style={{ background: 'var(--bg-color)', padding: '1px 6px', borderRadius: 4, fontSize: '0.85em', border: '1px solid var(--border-color)' }}>npm install axios form-data</code>.
                                    Python, PHP, Ruby, Go, and Java ship with HTTP clients built-in.
                                </p>
                            </div>
                        </div>
                        <div className="dev-step">
                            <div className="dev-step-num">3</div>
                            <div className="dev-step-content">
                                <h3>Send your first request</h3>
                                <p>
                                    POST your image to <code style={{ background: 'var(--bg-color)', padding: '1px 6px', borderRadius: 4, fontSize: '0.85em', border: '1px solid var(--border-color)' }}>api.shrinkix.com/compress</code>{' '}
                                    with the <code style={{ background: 'var(--bg-color)', padding: '1px 6px', borderRadius: 4, fontSize: '0.85em', border: '1px solid var(--border-color)' }}>X-API-Key</code> header.
                                    The compressed image is returned in the response body.
                                </p>
                            </div>
                        </div>
                        <div className="dev-step">
                            <div className="dev-step-num">4</div>
                            <div className="dev-step-content">
                                <h3>Read the full API reference</h3>
                                <p>
                                    Convert formats, resize, preserve EXIF metadata, and handle errors —
                                    all documented in the{' '}
                                    <Link to="/api-docs">API Reference</Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dev-code-block">
                        <div className="dev-code-block-header">
                            <span className="dot red" />
                            <span className="dot yellow" />
                            <span className="dot green" />
                            <span className="dev-code-block-filename">compress.py</span>
                        </div>
                        <pre>{`import requests

# Your API key from the dashboard
API_KEY = 'YOUR_API_KEY'

# Open and compress the image
with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        headers={'X-API-Key': API_KEY},
    )

# Save the compressed image
with open('compressed.jpg', 'wb') as f:
    f.write(response.content)

# Print results
original = response.headers['X-Original-Size']
compressed = response.headers['X-Compressed-Size']
saved = response.headers['X-Saved-Percent']

print(f'Original:   {original} bytes')
print(f'Compressed: {compressed} bytes')
print(f'Saved:      {saved}%')

# Output:
# Original:   49925 bytes
# Compressed: 13084 bytes
# Saved:      73.79%`}</pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
