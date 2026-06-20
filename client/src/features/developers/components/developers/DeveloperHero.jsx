import { Link } from 'react-router-dom';

export default function DeveloperHero() {
    return (
        <section className="dev-hero">
            <div className="dev-hero-inner">
                <div className="dev-hero-text">
                    <span className="dev-hero-label">REST API</span>
                    <h1 className="dev-hero-title">
                        Automate image compression<br />
                        at any scale
                    </h1>
                    <p className="dev-hero-subtitle">
                        One POST request compresses any JPEG, PNG, WebP, or AVIF.
                        60–80% smaller files, no visible quality loss, under 2 seconds.
                    </p>
                    <ul className="dev-hero-features">
                        <li>No SDK required — standard HTTP multipart</li>
                        <li>Node.js, Python, PHP, Ruby, Go, Java, C#</li>
                        <li>500 free compressions per month, no card needed</li>
                        <li>Scales to 50,000 compressions per month</li>
                    </ul>
                    <div className="dev-hero-actions">
                        <Link to="/signup" className="dev-btn-primary">Get your free API key</Link>
                        <Link to="/api-docs" className="dev-btn-secondary">View API reference →</Link>
                    </div>
                </div>
                <div className="dev-hero-code">
                    <div className="dev-terminal">
                        <div className="dev-terminal-bar">
                            <span className="dot red" />
                            <span className="dot yellow" />
                            <span className="dot green" />
                            <span className="dev-terminal-title">compress.js</span>
                        </div>
                        <pre className="dev-terminal-code">{`const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const form = new FormData();
form.append('image', fs.createReadStream('photo.jpg'));

const res = await axios.post(
  'https://api.shrinkix.com/compress',
  form,
  {
    headers: {
      'X-API-Key': process.env.SHRINKIX_KEY,
      ...form.getHeaders()
    },
    responseType: 'arraybuffer',
  }
);

fs.writeFileSync('compressed.jpg', res.data);

// ✓ 49,925 bytes → 13,084 bytes  (73.8% saved)`}</pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
