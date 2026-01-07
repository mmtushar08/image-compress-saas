import { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Code, Shield, Image as ImageIcon, AlertTriangle, ChevronRight, Menu, Zap, Box, Layers, Globe, Save } from 'lucide-react';
import '../styles/api-docs.css';

export default function ApiDocs() {
    const [activeLang, setActiveLang] = useState('curl');
    const [activeSection, setActiveSection] = useState('auth');

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const examples = {
        auth: {
            curl: `curl https://api.trimixo.com/api/compress \\
     --user api:YOUR_API_KEY \\
     --data-binary @image.png`,
            node: `const trimixo = require("trimixo-api");
trimixo.key = "YOUR_API_KEY";

const source = trimixo.fromFile("unoptimized.png");
source.toFile("optimized.png");`,
            python: `import trimixo
trimixo.key = "YOUR_API_KEY"

source = trimixo.from_file("unoptimized.png")
source.to_file("optimized.png")`,
            php: `\\Trimixo\\setKey("YOUR_API_KEY");

$source = \\Trimixo\\fromFile("unoptimized.png");
$source->toFile("optimized.png");`
        },
        compress: {
            curl: `curl https://api.trimixo.com/api/compress \\
     --user api:YOUR_API_KEY \\
     --data-binary @unoptimized.jpg \\
     --dump-header /dev/stdout`,
            node: `const source = trimixo.fromFile("unoptimized.jpg");
source.toFile("optimized.jpg");`,
            python: `source = trimixo.from_file("unoptimized.jpg")
source.to_file("optimized.jpg")`,
            php: `$source = \\Trimixo\\fromFile("unoptimized.jpg");
$source->toFile("optimized.jpg");`
        },
        resize: {
            curl: `curl https://api.trimixo.com/api/compress \\
     --user api:YOUR_API_KEY \\
     -F "image=@large.png" \\
     -F "width=150" \\
     -F "height=100" \\
     -F "method=thumb"`,
            node: `const source = trimixo.fromFile("large.jpg");
const resized = source.resize({
  method: "fit",
  width: 150,
  height: 100
});
resized.toFile("thumbnail.jpg");`,
            python: `source = trimixo.from_file("large.jpg")
resized = source.resize(
    method="cover",
    width=150,
    height=100
)
resized.to_file("thumbnail.jpg")`,
            php: `$source = \\Trimixo\\fromFile("large.jpg");
$resized = $source->resize([
    "method" => "thumb",
    "width" => 150,
    "height" => 100
]);
$resized->toFile("thumbnail.jpg");`
        }
    };

    const CodePane = ({ sectionId }) => (
        <div className="code-container">
            <div className="code-header">
                {['curl', 'node', 'python', 'php'].map(lang => (
                    <button
                        key={lang}
                        className={`code-tab ${activeLang === lang ? 'active' : ''}`}
                        onClick={() => setActiveLang(lang)}
                    >
                        {lang === 'curl' ? 'cURL' : lang === 'node' ? 'Node.js' : lang === 'python' ? 'Python' : 'PHP'}
                    </button>
                ))}
            </div>
            <div className="code-body">
                <pre><code>{examples[sectionId]?.[activeLang] || "// Implementation example matches section above"}</code></pre>
                <button className="copy-btn" onClick={() => copyToClipboard(examples[sectionId]?.[activeLang])}>
                    <Copy size={16} />
                </button>
            </div>
        </div>
    );

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="docs-layout">
            <aside className="docs-sidebar">
                <div className="sidebar-group">
                    <h4>Core API</h4>
                    <ul>
                        <li className={`sidebar-link ${activeSection === 'auth' ? 'active' : ''}`} onClick={() => scrollTo('auth')}>
                            <Shield size={16} /> Authentication
                        </li>
                        <li className={`sidebar-link ${activeSection === 'compress' ? 'active' : ''}`} onClick={() => scrollTo('compress')}>
                            <Zap size={16} /> Compressing images
                        </li>
                        <li className={`sidebar-link ${activeSection === 'resize' ? 'active' : ''}`} onClick={() => scrollTo('resize')}>
                            <Box size={16} /> Resizing images
                        </li>
                    </ul>
                </div>
                <div className="sidebar-group">
                    <h4>Advanced</h4>
                    <ul>
                        <li className={`sidebar-link ${activeSection === 'convert' ? 'active' : ''}`} onClick={() => scrollTo('convert')}>
                            <Layers size={16} /> Converting images
                        </li>
                        <li className={`sidebar-link ${activeSection === 'metadata' ? 'active' : ''}`} onClick={() => scrollTo('metadata')}>
                            <Save size={16} /> Preserving metadata
                        </li>
                    </ul>
                </div>
                <div className="sidebar-group">
                    <h4>Usage</h4>
                    <ul>
                        <li className={`sidebar-link ${activeSection === 'headers' ? 'active' : ''}`} onClick={() => scrollTo('headers')}>
                            <Terminal size={16} /> Response Headers
                        </li>
                        <li className={`sidebar-link ${activeSection === 'errors' ? 'active' : ''}`} onClick={() => scrollTo('errors')}>
                            <AlertTriangle size={16} /> Error handling
                        </li>
                    </ul>
                </div>
            </aside>

            <main className="docs-main">
                <header className="docs-header-hero">
                    <h1>API Reference</h1>
                    <p>The Trimixo API allows you to compress and resize images on your own servers. It uses smart lossy compression techniques to reduce the file size of your WebP, PNG and JPEG files.</p>
                </header>

                <div className="docs-sections">
                    {/* Authentication */}
                    <section id="auth" className="api-section">
                        <div className="section-content">
                            <h2>Authentication</h2>
                            <p>To use the API you must provide your API key. You can [get an API key](/signup) by registering with your email address. Always keep your API key secret!</p>
                            <p>Authentication to the API is done with <strong>HTTP Basic Auth</strong>. All requests require an Authorization header that contains a Base64 digest of <code>api:YOUR_API_KEY</code>.</p>

                            <div className="auth-grid">
                                <div className="auth-card">
                                    <h4>Basic Auth</h4>
                                    <code>Authorization: Basic [base64(api:key)]</code>
                                </div>
                            </div>
                        </div>
                        <div className="section-examples">
                            <CodePane sectionId="auth" />
                        </div>
                    </section>

                    {/* Compression */}
                    <section id="compress" className="api-section">
                        <div className="section-content">
                            <h2>Compressing images</h2>
                            <p>You can upload any WebP, JPEG or PNG image to the Trimixo API to compress it. We will automatically detect the type of image and optimize it accordingly.</p>

                            <div className="endpoint-badge">
                                <span className="method-label">POST</span>
                                <code>/api/compress</code>
                            </div>

                            <p>The post data contains the image binary. Most clients support multipart/form-data as well as raw binary uploads.</p>
                        </div>
                        <div className="section-examples">
                            <CodePane sectionId="compress" />
                        </div>
                    </section>

                    {/* Resizing */}
                    <section id="resize" className="api-section">
                        <div className="section-content">
                            <h2>Resizing images</h2>
                            <p>Use the API to create resized versions of your uploaded images. Resized images will be optimally compressed with a nice and crisp appearance.</p>

                            <div className="params-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Method</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>fit</code></td>
                                            <td>Proportionally scaled to fit within dimensions.</td>
                                        </tr>
                                        <tr>
                                            <td><code>scale</code></td>
                                            <td>Scaled to exactly match width or height.</td>
                                        </tr>
                                        <tr>
                                            <td><code>cover</code></td>
                                            <td>Crops the image to fit dimensions exactly.</td>
                                        </tr>
                                        <tr>
                                            <td><code>thumb</code></td>
                                            <td>Intelligently crops to create a thumbnail.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="section-examples">
                            <CodePane sectionId="resize" />
                        </div>
                    </section>

                    {/* Converting */}
                    <section id="convert" className="api-section">
                        <div className="section-content">
                            <h2>Converting images</h2>
                            <p>Convert your images between formats. Supported output formats are WebP, PNG and JPEG.</p>
                            <div className="params-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Property</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>format</code></td>
                                            <td>string</td>
                                            <td>Target format: <code>webp</code>, <code>png</code> or <code>jpg</code>.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="section-examples">
                            <div className="code-container">
                                <div className="code-header"><div className="code-tab active">cURL</div></div>
                                <div className="code-body">
                                    <pre><code>{`curl https://api.trimixo.com/api/compress \\
     --user api:YOUR_API_KEY \\
     -F "format=webp" \\
     -F "image=@photo.png"`}</code></pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Metadata */}
                    <section id="metadata" className="api-section">
                        <div className="section-content">
                            <h2>Preserving metadata</h2>
                            <p>You can choose to preserve specific metadata from the original image (like copyright information or GPS location).</p>
                        </div>
                        <div className="section-examples">
                            <div className="code-container">
                                <div className="code-header"><div className="code-tab active">cURL</div></div>
                                <div className="code-body">
                                    <pre><code>{`curl https://api.trimixo.com/api/compress \\
     --user api:YOUR_API_KEY \\
     -F "preserve[]=copyright" \\
     -F "image=@photo.jpg"`}</code></pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Headers */}
                    <section id="headers" className="api-section">
                        <div className="section-content">
                            <h2>Response Headers</h2>
                            <p>Successful responses are binary image data along with custom headers providing compression statistics.</p>
                            <div className="params-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Header</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>X-Original-Size</code></td>
                                            <td>Original size in bytes.</td>
                                        </tr>
                                        <tr>
                                            <td><code>X-Compressed-Size</code></td>
                                            <td>Optimized size in bytes.</td>
                                        </tr>
                                        <tr>
                                            <td><code>X-Saved-Percent</code></td>
                                            <td>Percentage saved.</td>
                                        </tr>
                                        <tr>
                                            <td><code>X-Compression-Count</code></td>
                                            <td>API count for this month.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="section-examples">
                            <div className="code-container">
                                <div className="code-header">
                                    <div className="code-tab active">Response Example</div>
                                </div>
                                <div className="code-body">
                                    <pre><code>{`HTTP/1.1 200 OK
Content-Type: image/png
X-Original-Size: 207565
X-Compressed-Size: 46480
X-Saved-Percent: 77.61
X-Compression-Count: 12`}</code></pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Errors */}
                    <section id="errors" className="api-section">
                        <div className="section-content">
                            <h2>Error handling</h2>
                            <p>Standard HTTP status codes are used to indicate success or failure of an API request.</p>
                        </div>
                        <div className="section-examples">
                            <div className="code-container">
                                <div className="code-header">
                                    <div className="code-tab active">Error Body</div>
                                </div>
                                <div className="code-body">
                                    <pre><code>{`{
  "success": false,
  "error": "Usage limit reached."
}`}</code></pre>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
