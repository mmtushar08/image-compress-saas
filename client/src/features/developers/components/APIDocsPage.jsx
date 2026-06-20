import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../../components/SEOHead';
import { techArticleSchema, breadcrumbSchema } from '../../../seo/schemas';
import '../../../styles/api-docs.css';

const NAV_GROUPS = [
    {
        label: 'Getting Started',
        items: [
            { id: 'introduction', label: 'Introduction' },
            { id: 'installation', label: 'Installation' },
            { id: 'authentication', label: 'Authentication' },
        ],
    },
    {
        label: 'Endpoints',
        items: [
            { id: 'compressing', label: 'Compress images' },
            { id: 'converting', label: 'Convert images' },
            { id: 'metadata', label: 'Preserve metadata' },
        ],
    },
    {
        label: 'Usage',
        items: [
            { id: 'compression-count', label: 'Check quota' },
            { id: 'errors', label: 'Error handling' },
        ],
    },
    {
        label: 'Support',
        items: [{ id: 'help', label: 'Need help?' }],
    },
];

export default function APIDocsPage() {
    const [activeSection, setActiveSection] = useState('introduction');

    useEffect(() => {
        const sections = document.querySelectorAll('section[data-docs-id]');
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) setActiveSection(e.target.dataset.docsId);
                });
            },
            { rootMargin: '-10% 0px -75% 0px' }
        );
        sections.forEach(s => io.observe(s));
        return () => io.disconnect();
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 85, behavior: 'smooth' });
        }
        setActiveSection(id);
    };

    return (
        <div className="api-docs-page">
            <SEOHead
                rawTitle="API Reference — Shrinkix Image Compression API"
                description="Complete HTTP API reference for Shrinkix. Compress and convert JPEG, PNG, WebP, AVIF images. Code examples in Node.js, Python, PHP, Ruby, Go, Java, C#."
                canonical="/api-docs"
            />
            <JsonLd schema={techArticleSchema} />
            <JsonLd schema={breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Developers', path: '/developers' },
                { name: 'API Reference', path: '/api-docs' },
            ])} />

            {/* ── Sidebar ── */}
            <nav className="api-docs-nav">
                <div className="api-docs-nav-brand">
                    <Link to="/developers" className="api-docs-nav-back">← Developers</Link>
                </div>
                <div className="api-docs-nav-header">API Reference</div>
                {NAV_GROUPS.map(group => (
                    <div className="api-docs-nav-group" key={group.label}>
                        <p className="api-docs-nav-group-label">{group.label}</p>
                        <ul className="api-docs-nav-list">
                            {group.items.map(item => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={activeSection === item.id ? 'active' : ''}
                                        onClick={e => { e.preventDefault(); scrollTo(item.id); }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div className="api-docs-nav-footer">
                    <Link to="/dashboard/api">API Dashboard</Link>
                    <Link to="/pricing">Upgrade plan</Link>
                </div>
            </nav>

            {/* ── Main content ── */}
            <main className="api-docs-content">

                {/* Introduction / header */}
                <div className="api-docs-header" id="introduction" data-docs-id="introduction">
                    <div className="api-docs-header-prose">
                        <span className="api-docs-label">REST API · v1</span>
                        <h1>Shrinkix API Reference</h1>
                        <p>
                            Integrate lossless image compression into any application with a single POST request.
                            Upload JPEG, PNG, WebP, or AVIF — receive a compressed file in the response body.
                            No SDK required.
                        </p>
                        <div className="api-docs-meta-row">
                            <span className="api-meta-chip">Base URL</span>
                            <code className="api-meta-url">https://api.shrinkix.com</code>
                        </div>
                    </div>
                    <div className="api-docs-header-code">
                        <CodePanel
                            title="Quick start"
                            examples={{
                                'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -o compressed.jpg`,
                                'Node.js': `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

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
fs.writeFileSync('compressed.jpg', res.data);`,
                                'Python': `import requests

with open('photo.jpg', 'rb') as f:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        headers={'X-API-Key': 'YOUR_API_KEY'},
    )

with open('compressed.jpg', 'wb') as f:
    f.write(res.content)`,
                            }}
                        />
                    </div>
                </div>

                {/* Installation */}
                <Section id="installation">
                    <Prose>
                        <h2>Installation</h2>
                        <p>
                            No dedicated SDK is required — Shrinkix is a standard HTTP multipart API.
                            Use any HTTP client library for your language.
                        </p>
                        <div className="install-grid">
                            {[
                                { lang: 'Node.js', cmd: 'npm install axios form-data' },
                                { lang: 'Python',  cmd: 'pip install requests' },
                                { lang: 'PHP',     cmd: '# Built-in cURL (no install)' },
                                { lang: 'Ruby',    cmd: 'gem install multipart-post' },
                                { lang: 'Go',      cmd: '# stdlib net/http (built-in)' },
                                { lang: 'Java',    cmd: '# stdlib java.net.http (Java 11+)' },
                            ].map(({ lang, cmd }) => (
                                <div className="install-card" key={lang}>
                                    <div className="install-card-lang">{lang}</div>
                                    <code className="install-card-cmd">{cmd}</code>
                                </div>
                            ))}
                        </div>
                        <p>Then follow the examples below — all endpoints work identically across languages.</p>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="Install packages"
                            examples={{
                                'npm':  'npm install axios form-data',
                                'yarn': 'yarn add axios form-data',
                                'pip':  'pip install requests',
                                'gem':  'gem install multipart-post',
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Authentication */}
                <Section id="authentication">
                    <Prose>
                        <h2>Authentication</h2>
                        <p>
                            Pass your API key in the <code>X-API-Key</code> header with every request.
                            Get your key from the <Link to="/dashboard/api">API Dashboard</Link> after
                            signing up for any paid plan.
                        </p>
                        <div className="inline-code-block">X-API-Key: YOUR_API_KEY</div>
                        <div className="alert alert-warning">
                            <strong>Security</strong>
                            Never expose your API key in client-side code or public repositories.
                            Always make API calls from your server-side backend.
                        </div>

                        <h3>Rate limits by plan</h3>
                        <table className="params-table">
                            <thead>
                                <tr>
                                    <th>Plan</th>
                                    <th>Monthly limit</th>
                                    <th>Req / sec</th>
                                    <th>Max file</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Free</td><td>500</td><td>0.5</td><td>5 MB</td></tr>
                                <tr><td>API Pro</td><td>5,000</td><td>2</td><td>10 MB</td></tr>
                                <tr><td>API Ultra</td><td>20,000</td><td>5</td><td>25 MB</td></tr>
                                <tr><td>Business</td><td>50,000</td><td>10</td><td>50 MB</td></tr>
                            </tbody>
                        </table>

                        <h3>Rate limit response headers</h3>
                        <table className="params-table">
                            <thead>
                                <tr><th>Header</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><code>X-RateLimit-Limit</code></td><td>Monthly quota</td></tr>
                                <tr><td><code>X-RateLimit-Remaining</code></td><td>Compressions left this month</td></tr>
                                <tr><td><code>X-RateLimit-Reset</code></td><td>Unix timestamp of next reset</td></tr>
                            </tbody>
                        </table>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="Authenticated request"
                            examples={{
                                'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -o compressed.jpg`,
                                'Node.js': `const axios = require('axios');
const FormData = require('form-data');
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
);`,
                                'Python': `import requests, os

with open('photo.jpg', 'rb') as f:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        headers={
          'X-API-Key': os.environ['SHRINKIX_KEY']
        },
    )`,
                            }}
                        />
                        <CodePanel
                            title="429 — quota exceeded"
                            examples={{
                                'JSON': `{
  "error": "QUOTA_EXCEEDED",
  "message": "Monthly limit reached. Resets 2026-07-01.",
  "status": 429
}`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Compress */}
                <Section id="compressing">
                    <Prose>
                        <h2>Compress images</h2>
                        <p>
                            Upload any JPEG, PNG, WebP, or AVIF image. Shrinkix automatically detects
                            the format and applies adaptive quality compression (60–80% smaller, no visible loss).
                        </p>

                        <div className="endpoint-badge">
                            <span className="method-badge post">POST</span>
                            <span>/compress</span>
                        </div>

                        <h3>Request parameters (multipart/form-data)</h3>
                        <table className="params-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Type</th>
                                    <th>Required</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>image</code></td>
                                    <td>File</td>
                                    <td><span className="badge-required">Required</span></td>
                                    <td>Image file to compress (JPEG, PNG, WebP, AVIF)</td>
                                </tr>
                                <tr>
                                    <td><code>quality</code></td>
                                    <td>Integer 1–100</td>
                                    <td><span className="badge-optional">Optional</span></td>
                                    <td>Output quality. Default: adaptive based on file size</td>
                                </tr>
                                <tr>
                                    <td><code>width</code></td>
                                    <td>Integer</td>
                                    <td><span className="badge-optional">Optional</span></td>
                                    <td>Resize to width (pixels), preserves aspect ratio</td>
                                </tr>
                                <tr>
                                    <td><code>height</code></td>
                                    <td>Integer</td>
                                    <td><span className="badge-optional">Optional</span></td>
                                    <td>Resize to height (pixels), preserves aspect ratio</td>
                                </tr>
                                <tr>
                                    <td><code>format</code></td>
                                    <td>String</td>
                                    <td><span className="badge-optional">Optional</span></td>
                                    <td>Convert output format: <code>jpg</code> <code>png</code> <code>webp</code> <code>avif</code></td>
                                </tr>
                                <tr>
                                    <td><code>preserveMetadata</code></td>
                                    <td>Boolean</td>
                                    <td><span className="badge-optional">Optional</span></td>
                                    <td>Keep EXIF/GPS data. Default: <code>false</code></td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Response</h3>
                        <p>The response body is the compressed image binary. Metadata is in the headers:</p>
                        <table className="params-table">
                            <thead>
                                <tr><th>Header</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><code>X-Original-Size</code></td><td>Input file size in bytes</td></tr>
                                <tr><td><code>X-Compressed-Size</code></td><td>Output file size in bytes</td></tr>
                                <tr><td><code>X-Saved-Percent</code></td><td>Percentage size reduction</td></tr>
                                <tr><td><code>Content-Type</code></td><td>Output MIME type</td></tr>
                            </tbody>
                        </table>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="POST /compress"
                            examples={{
                                'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "quality=80" \\
  -o compressed.jpg -v

# Response headers:
# HTTP/1.1 200 OK
# X-Original-Size: 49925
# X-Compressed-Size: 13084
# X-Saved-Percent: 73.79
# Content-Type: image/jpeg`,
                                'Node.js': `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('image', fs.createReadStream('photo.jpg'));
form.append('quality', '80');

const res = await axios.post(
  'https://api.shrinkix.com/compress',
  form,
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
      ...form.getHeaders()
    },
    responseType: 'arraybuffer',
  }
);

fs.writeFileSync('compressed.jpg', res.data);

console.log('Original:', res.headers['x-original-size'], 'bytes');
console.log('Compressed:', res.headers['x-compressed-size'], 'bytes');
console.log('Saved:', res.headers['x-saved-percent'] + '%');
// Saved: 73.79%`,
                                'Python': `import requests

with open('photo.jpg', 'rb') as f:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'quality': 80},
        headers={'X-API-Key': 'YOUR_API_KEY'},
    )

with open('compressed.jpg', 'wb') as f:
    f.write(res.content)

print('Saved:', res.headers['X-Saved-Percent'] + '%')`,
                                'PHP': `<?php
$ch = curl_init('https://api.shrinkix.com/compress');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['X-API-Key: YOUR_API_KEY'],
    CURLOPT_POSTFIELDS     => ['image' => new CURLFile('photo.jpg')],
    CURLOPT_RETURNTRANSFER => true,
]);
$body = curl_exec($ch);
curl_close($ch);

file_put_contents('compressed.jpg', $body);`,
                                'Ruby': `require 'net/http'

uri = URI('https://api.shrinkix.com/compress')
req = Net::HTTP::Post.new(uri)
req['X-API-Key'] = 'YOUR_API_KEY'
req.set_form(
  [['image', File.open('photo.jpg')]],
  'multipart/form-data'
)

res = Net::HTTP.start(
  uri.host, uri.port, use_ssl: true
) { |h| h.request(req) }

File.write('compressed.jpg', res.body)
puts "Saved #{res['X-Saved-Percent']}%"`,
                                'Go': `package main

import (
    "bytes"; "fmt"; "io"
    "mime/multipart"; "net/http"; "os"
)

func main() {
    f, _ := os.Open("photo.jpg")
    defer f.Close()

    buf := &bytes.Buffer{}
    w := multipart.NewWriter(buf)
    p, _ := w.CreateFormFile("image", "photo.jpg")
    io.Copy(p, f)
    w.Close()

    req, _ := http.NewRequest(
        "POST",
        "https://api.shrinkix.com/compress",
        buf,
    )
    req.Header.Set("X-API-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", w.FormDataContentType())

    resp, _ := (&http.Client{}).Do(req)
    defer resp.Body.Close()

    out, _ := os.Create("compressed.jpg")
    io.Copy(out, resp.Body)
    fmt.Println("Saved:",
        resp.Header.Get("X-Saved-Percent")+"%")
}`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Convert */}
                <Section id="converting">
                    <Prose>
                        <h2>Convert images</h2>
                        <p>
                            Pass the <code>format</code> parameter to convert between formats in the same request.
                            WebP is 25–35% smaller than JPEG at equivalent quality and is supported by all
                            modern browsers.
                        </p>

                        <div className="endpoint-badge">
                            <span className="method-badge post">POST</span>
                            <span>/compress</span>
                        </div>

                        <h3>Supported conversions</h3>
                        <table className="params-table">
                            <thead>
                                <tr><th>Target format</th><th><code>format</code> value</th><th>Notes</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>JPEG</td><td><code>jpg</code></td><td>Best for photographs</td></tr>
                                <tr><td>PNG</td><td><code>png</code></td><td>Lossless, supports transparency</td></tr>
                                <tr><td>WebP</td><td><code>webp</code></td><td>25–35% smaller than JPEG</td></tr>
                                <tr><td>AVIF</td><td><code>avif</code></td><td>Best compression (Pro+ plans)</td></tr>
                            </tbody>
                        </table>

                        <div className="alert alert-tip">
                            <strong>Tip</strong>
                            Convert PNG screenshots to WebP for the web — you'll typically get 50–70% smaller
                            files with no visible quality difference.
                        </div>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="Convert PNG → WebP"
                            examples={{
                                'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.png" \\
  -F "format=webp" \\
  -o photo.webp

# Response headers:
# Content-Type: image/webp
# X-Original-Size: 125840
# X-Compressed-Size: 42150
# X-Saved-Percent: 66.51`,
                                'Node.js': `const form = new FormData();
form.append('image', fs.createReadStream('photo.png'));
form.append('format', 'webp');

const res = await axios.post(
  'https://api.shrinkix.com/compress',
  form,
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
      ...form.getHeaders()
    },
    responseType: 'arraybuffer',
  }
);
fs.writeFileSync('photo.webp', res.data);
console.log('Format:', res.headers['content-type']);
// image/webp`,
                                'Python': `with open('photo.png', 'rb') as f:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'format': 'webp'},
        headers={'X-API-Key': 'YOUR_API_KEY'},
    )

with open('photo.webp', 'wb') as f:
    f.write(res.content)

print('Saved:', res.headers['X-Saved-Percent'] + '%')
# Saved: 66.51%`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Metadata */}
                <Section id="metadata">
                    <Prose>
                        <h2>Preserve metadata</h2>
                        <p>
                            By default Shrinkix strips all metadata (EXIF, IPTC, XMP) to minimise file size.
                            Pass <code>preserveMetadata=true</code> to retain it.
                        </p>

                        <div className="endpoint-badge">
                            <span className="method-badge post">POST</span>
                            <span>/compress</span>
                        </div>

                        <h3>What is retained</h3>
                        <ul>
                            <li>EXIF — camera settings, date and time</li>
                            <li>GPS coordinates</li>
                            <li>Camera make and model</li>
                            <li>Copyright and author info</li>
                            <li>ICC colour profile</li>
                        </ul>

                        <div className="alert alert-info">
                            <strong>Note</strong>
                            Preserving metadata adds roughly 2–5 KB to the output file.
                            Strip it when serving images on the web.
                        </div>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="Preserve EXIF"
                            examples={{
                                'cURL': `curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "preserveMetadata=true" \\
  -o compressed.jpg

# Extra response header:
# X-Metadata-Preserved: true`,
                                'Node.js': `const form = new FormData();
form.append('image', fs.createReadStream('photo.jpg'));
form.append('preserveMetadata', 'true');

const res = await axios.post(
  'https://api.shrinkix.com/compress',
  form,
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
      ...form.getHeaders()
    },
    responseType: 'arraybuffer',
  }
);
fs.writeFileSync('compressed.jpg', res.data);

console.log(
  'Metadata:',
  res.headers['x-metadata-preserved']
);
// true`,
                                'Python': `with open('photo.jpg', 'rb') as f:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'preserveMetadata': 'true'},
        headers={'X-API-Key': 'YOUR_API_KEY'},
    )

print(res.headers.get('X-Metadata-Preserved'))
# true`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Check quota */}
                <Section id="compression-count">
                    <Prose>
                        <h2>Check quota</h2>
                        <p>
                            Check your current usage and remaining compressions for the billing cycle
                            before starting a batch job.
                        </p>

                        <div className="endpoint-badge">
                            <span className="method-badge get">GET</span>
                            <span>/check-limit</span>
                        </div>

                        <h3>Response fields</h3>
                        <table className="params-table">
                            <thead>
                                <tr><th>Field</th><th>Type</th><th>Description</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><code>remaining</code></td><td>Integer</td><td>Compressions left this month</td></tr>
                                <tr><td><code>total</code></td><td>Integer</td><td>Monthly quota for your plan</td></tr>
                                <tr><td><code>usage</code></td><td>Integer</td><td>Compressions used this month</td></tr>
                                <tr><td><code>plan</code></td><td>String</td><td>Your current plan ID</td></tr>
                                <tr><td><code>maxFileSize</code></td><td>Integer</td><td>Max upload size in bytes</td></tr>
                            </tbody>
                        </table>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="GET /check-limit"
                            examples={{
                                'cURL': `curl https://api.shrinkix.com/check-limit \\
  -H "X-API-Key: YOUR_API_KEY"`,
                                'Node.js': `const res = await axios.get(
  'https://api.shrinkix.com/check-limit',
  { headers: { 'X-API-Key': 'YOUR_API_KEY' } }
);
console.log(res.data);`,
                                'Python': `res = requests.get(
    'https://api.shrinkix.com/check-limit',
    headers={'X-API-Key': 'YOUR_API_KEY'},
)
print(res.json())`,
                            }}
                        />
                        <CodePanel
                            title="Response"
                            examples={{
                                'JSON': `{
  "remaining": 4850,
  "total": 5000,
  "usage": 150,
  "plan": "api-pro",
  "maxFileSize": 10485760
}`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Errors */}
                <Section id="errors">
                    <Prose>
                        <h2>Error handling</h2>
                        <p>
                            The API uses standard HTTP status codes. Error responses include a JSON body
                            with <code>error</code>, <code>message</code>, and <code>status</code> fields.
                        </p>

                        <h3>HTTP status codes</h3>
                        <table className="params-table">
                            <thead>
                                <tr><th>Status</th><th>Meaning</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="status-badge status-200">200</span></td>
                                    <td>Success — compressed image in body</td>
                                </tr>
                                <tr>
                                    <td><span className="status-badge status-400">400</span></td>
                                    <td>Bad request — unsupported format or invalid parameters</td>
                                </tr>
                                <tr>
                                    <td><span className="status-badge status-401">401</span></td>
                                    <td>Unauthorized — missing or invalid API key</td>
                                </tr>
                                <tr>
                                    <td><span className="status-badge status-400">413</span></td>
                                    <td>File too large for your plan</td>
                                </tr>
                                <tr>
                                    <td><span className="status-badge status-429">429</span></td>
                                    <td>Rate limit or monthly quota exceeded</td>
                                </tr>
                                <tr>
                                    <td><span className="status-badge status-500">500</span></td>
                                    <td>Server error — retry after a short delay</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Error codes</h3>
                        <table className="params-table">
                            <thead>
                                <tr><th>Code</th><th>Status</th><th>Recommended action</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><code>INVALID_API_KEY</code></td><td>401</td><td>Check your API Dashboard</td></tr>
                                <tr><td><code>QUOTA_EXCEEDED</code></td><td>429</td><td><Link to="/pricing">Upgrade plan</Link> or wait for reset</td></tr>
                                <tr><td><code>RATE_LIMIT_EXCEEDED</code></td><td>429</td><td>Add exponential backoff</td></tr>
                                <tr><td><code>FILE_TOO_LARGE</code></td><td>413</td><td>Reduce file size or upgrade plan</td></tr>
                                <tr><td><code>UNSUPPORTED_FORMAT</code></td><td>400</td><td>Use JPEG, PNG, WebP, or AVIF</td></tr>
                                <tr><td><code>CORRUPTED_IMAGE</code></td><td>400</td><td>Verify the file is a valid image</td></tr>
                                <tr><td><code>SERVER_ERROR</code></td><td>500</td><td>Retry with exponential backoff</td></tr>
                            </tbody>
                        </table>
                    </Prose>
                    <CodeSide>
                        <CodePanel
                            title="Error response body"
                            examples={{
                                'JSON': `{
  "error": "INVALID_API_KEY",
  "message": "Provide a valid X-API-Key header.",
  "status": 401
}`,
                            }}
                        />
                        <CodePanel
                            title="Handle errors"
                            examples={{
                                'Node.js': `try {
  const res = await axios.post(
    'https://api.shrinkix.com/compress',
    form,
    {
      headers: {
        'X-API-Key': key,
        ...form.getHeaders()
      },
      responseType: 'arraybuffer',
    }
  );
  fs.writeFileSync('out.jpg', res.data);

} catch (err) {
  const { status, data } = err.response ?? {};

  if (status === 401) {
    console.error('Invalid API key');
  } else if (status === 429) {
    const reset = err.response.headers['retry-after'];
    console.error(\`Quota exceeded. Retry after \${reset}s\`);
  } else if (status === 413) {
    console.error('File too large for your plan');
  } else if (status === 500) {
    // Retry with exponential backoff
    await new Promise(r => setTimeout(r, 5000));
  }
}`,
                                'Python': `try:
    res = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': open('photo.jpg', 'rb')},
        headers={'X-API-Key': key},
    )
    res.raise_for_status()
    open('out.jpg', 'wb').write(res.content)

except requests.HTTPError as e:
    code = e.response.status_code
    if code == 401:
        print('Invalid API key')
    elif code == 429:
        retry = e.response.headers.get('Retry-After', 60)
        print(f'Quota exceeded. Retry after {retry}s')
    elif code == 413:
        print('File too large for plan')
    elif code == 500:
        import time; time.sleep(5)  # then retry`,
                            }}
                        />
                    </CodeSide>
                </Section>

                {/* Help */}
                <Section id="help" fullWidth>
                    <Prose>
                        <h2>Need help?</h2>
                        <p>
                            Questions, bugs, or feedback — we&apos;re here to help.
                            Typical email response time is under 24 hours.
                        </p>
                        <div className="help-grid">
                            <div className="help-card">
                                <h4>Email support</h4>
                                <p>Get help from our team with API integration or account issues.</p>
                                <a href="mailto:support@shrinkix.com" className="btn-sm">
                                    support@shrinkix.com
                                </a>
                            </div>
                            <div className="help-card">
                                <h4>API Dashboard</h4>
                                <p>Manage your API keys, view usage, and rotate secrets.</p>
                                <Link to="/dashboard/api" className="btn-sm">Open Dashboard</Link>
                            </div>
                            <div className="help-card">
                                <h4>Upgrade plan</h4>
                                <p>Need higher limits or larger file sizes? View API plans.</p>
                                <Link to="/pricing" className="btn-sm">View plans</Link>
                            </div>
                        </div>
                    </Prose>
                </Section>

            </main>
        </div>
    );
}

/* ── Layout helpers ── */
function Section({ id, children, fullWidth }) {
    return (
        <section
            id={id}
            data-docs-id={id}
            className={`api-section${fullWidth ? ' full-width' : ''}`}
        >
            {children}
        </section>
    );
}

function Prose({ children }) {
    return <div className="api-section-prose">{children}</div>;
}

function CodeSide({ children }) {
    return <div className="api-section-code">{children}</div>;
}

/* ── Code panel component ── */
function CodePanel({ title, examples }) {
    const langs = Object.keys(examples);
    const [active, setActive] = useState(langs[0]);
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(examples[active]).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-panel">
            {title && <div className="code-panel-title">{title}</div>}
            <div className="code-panel-header">
                {langs.map(lang => (
                    <button
                        key={lang}
                        className={`code-panel-tab${active === lang ? ' active' : ''}`}
                        onClick={() => setActive(lang)}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            <div className="code-panel-body">
                <button
                    className={`code-panel-copy${copied ? ' copied' : ''}`}
                    onClick={copy}
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
                <pre><code>{examples[active]}</code></pre>
            </div>
        </div>
    );
}
