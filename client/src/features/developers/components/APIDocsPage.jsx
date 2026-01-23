import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/api-docs.css';

export default function APIDocsPage() {
    const [activeSection, setActiveSection] = useState('installation');

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        setActiveSection(sectionId);
    };

    return (
        <div className="api-docs-page">
            <nav className="api-docs-nav">
                <div className="api-docs-nav-header">
                    <h3>API Reference</h3>
                </div>
                <ul className="api-docs-nav-list">
                    <li>
                        <a href="#installation"
                            className={activeSection === 'installation' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('installation'); }}>
                            Installation
                        </a>
                    </li>
                    <li>
                        <a href="#authentication"
                            className={activeSection === 'authentication' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('authentication'); }}>
                            Authentication
                        </a>
                    </li>
                    <li>
                        <a href="#compressing"
                            className={activeSection === 'compressing' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('compressing'); }}>
                            Compressing Images
                        </a>
                    </li>
                    <li>
                        <a href="#converting"
                            className={activeSection === 'converting' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('converting'); }}>
                            Converting Images
                        </a>
                    </li>
                    <li>
                        <a href="#metadata"
                            className={activeSection === 'metadata' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('metadata'); }}>
                            Preserving Metadata
                        </a>
                    </li>
                    <li>
                        <a href="#errors"
                            className={activeSection === 'errors' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('errors'); }}>
                            Error Handling
                        </a>
                    </li>
                    <li>
                        <a href="#compression-count"
                            className={activeSection === 'compression-count' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('compression-count'); }}>
                            Compression Count
                        </a>
                    </li>
                    <li>
                        <a href="#help"
                            className={activeSection === 'help' ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); scrollToSection('help'); }}>
                            Need Help?
                        </a>
                    </li>
                </ul>
            </nav>

            <main className="api-docs-content">
                {/* Installation */}
                <section id="installation" className="api-section">
                    <h1>Shrinkix API Reference</h1>
                    <p className="api-intro">
                        Welcome to the Shrinkix API! Integrate powerful image compression and optimization
                        into your applications with our simple HTTP API.
                    </p>

                    <h2>Installation</h2>
                    <p>
                        To use the Shrinkix API, you'll need to install an HTTP client library for your
                        programming language. Below are the recommended libraries:
                    </p>

                    <div className="install-grid">
                        <div className="install-card">
                            <h4>Node.js</h4>
                            <CodeExample examples={{
                                'npm': 'npm install axios form-data',
                                'yarn': 'yarn add axios form-data'
                            }} />
                        </div>
                        <div className="install-card">
                            <h4>Python</h4>
                            <CodeExample examples={{
                                'pip': 'pip install requests'
                            }} />
                        </div>
                        <div className="install-card">
                            <h4>PHP</h4>
                            <p>cURL extension (built-in with PHP)</p>
                        </div>
                        <div className="install-card">
                            <h4>Ruby</h4>
                            <CodeExample examples={{
                                'gem': 'gem install multipart-post'
                            }} />
                        </div>
                    </div>

                    <p className="note">
                        <strong>Note:</strong> For other languages (Go, Java, C#), use the standard HTTP
                        libraries included with the language.
                    </p>
                </section>

                {/* Authentication */}
                <section id="authentication" className="api-section">
                    <h2>Authentication</h2>
                    <p>
                        To use the API you must provide your API key. You can get an API key by
                        signing up for a <Link to="/pricing">Pro or Ultra plan</Link>. Always keep
                        your API key secret!
                    </p>

                    <p>
                        Include your API key in the <code>X-API-Key</code> header with every request:
                    </p>

                    <CodeExample examples={{
                        'Header': 'X-API-Key: YOUR_API_KEY'
                    }} />

                    <div className="alert alert-warning">
                        <strong>⚠️ Security Warning</strong>
                        <p>Never expose your API key in client-side code or public repositories.
                            Always make API calls from your backend server.</p>
                    </div>

                    <h3>Getting Your API Key</h3>
                    <ol>
                        <li>Sign up for a <Link to="/pricing">Pro or Ultra plan</Link></li>
                        <li>Navigate to your <Link to="/dashboard/api">API Dashboard</Link></li>
                        <li>Click "Generate API Key"</li>
                        <li>Copy your API key and store it securely</li>
                    </ol>

                    <h3>Rate Limiting</h3>
                    <p>
                        API requests are rate-limited based on your subscription plan to ensure fair usage
                        and system stability.
                    </p>

                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th>Monthly Limit</th>
                                <th>Requests/Second</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Free</td>
                                <td>25 compressions</td>
                                <td>1 req/sec</td>
                            </tr>
                            <tr>
                                <td>Pro</td>
                                <td>1,000 compressions</td>
                                <td>5 req/sec</td>
                            </tr>
                            <tr>
                                <td>Ultra</td>
                                <td>5,000 compressions</td>
                                <td>10 req/sec</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Rate Limit Headers</h4>
                    <p>Every API response includes rate limit information in the headers:</p>

                    <CodeExample examples={{
                        'Response Headers': `X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1705564800

# X-RateLimit-Limit: Total requests allowed per month
# X-RateLimit-Remaining: Requests remaining this month
# X-RateLimit-Reset: Unix timestamp when limit resets`
                    }} />

                    <h4>Handling 429 Responses</h4>
                    <p>When you exceed the rate limit, the API returns a <code>429 Too Many Requests</code> response:</p>

                    <CodeExample examples={{
                        'Node.js': `if (error.response?.status === 429) {
  const retryAfter = error.response.headers['retry-after'];
  console.log(\`Rate limit exceeded. Retry after \${retryAfter} seconds\`);
  
  // Wait and retry
  await new Promise(r => setTimeout(r, retryAfter * 1000));
  // Retry request
}`,
                        'Python': `if e.response.status_code == 429:
    retry_after = int(e.response.headers.get('Retry-After', 60))
    print(f"Rate limit exceeded. Retry after {retry_after} seconds")
    
    # Wait and retry
    time.sleep(retry_after)
    # Retry request`
                    }} />

                    <h3>Size Limits</h3>
                    <p>File size limits vary by plan to ensure optimal performance:</p>

                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th>Max File Size</th>
                                <th>Max Batch Size</th>
                                <th>Supported Formats</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Free</td>
                                <td>5 MB</td>
                                <td>N/A</td>
                                <td>JPG, PNG, WebP</td>
                            </tr>
                            <tr>
                                <td>Pro</td>
                                <td>25 MB</td>
                                <td>10 files</td>
                                <td>JPG, PNG, WebP, AVIF</td>
                            </tr>
                            <tr>
                                <td>Ultra</td>
                                <td>75 MB</td>
                                <td>50 files</td>
                                <td>JPG, PNG, WebP, AVIF</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="note">
                        <strong>💡 Tip:</strong> If you need to process larger files or batches,
                        <Link to="/pricing"> upgrade your plan</Link> or contact our sales team for enterprise options.
                    </div>

                    <h3>API Security Best Practices</h3>
                    <div className="security-tips">
                        <h4>🔐 API Key Management</h4>
                        <ul>
                            <li>Store API keys in environment variables, never hardcode</li>
                            <li>Use different keys for development and production</li>
                            <li>Rotate keys every 90 days for enhanced security</li>
                            <li>Revoke compromised keys immediately from your dashboard</li>
                        </ul>

                        <h4>🛡️ Request Security</h4>
                        <ul>
                            <li>Always use HTTPS for API requests</li>
                            <li>Validate file types before uploading</li>
                            <li>Implement request timeouts (30 seconds recommended)</li>
                            <li>Monitor API usage for unusual activity</li>
                        </ul>

                        <h4>🔒 Data Privacy</h4>
                        <ul>
                            <li>Images are processed and immediately deleted</li>
                            <li>No permanent storage of user images</li>
                            <li>GDPR and CCPA compliant</li>
                            <li>End-to-end encryption in transit</li>
                        </ul>
                    </div>
                </section>

                {/* Compressing Images */}
                <section id="compressing" className="api-section">
                    <h2>Compressing Images</h2>
                    <p>
                        You can upload any AVIF, WebP, JPEG or PNG image to the Shrinkix API to compress it.
                        We will automatically detect the type of image and optimize it accordingly.
                    </p>

                    <div className="endpoint-badge">
                        <span className="method-label">POST</span>
                        <code>/api/compress</code>
                    </div>

                    <h3>Request Parameters</h3>
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
                                <td>Yes</td>
                                <td>The image file to compress</td>
                            </tr>
                            <tr>
                                <td><code>quality</code></td>
                                <td>Integer</td>
                                <td>No</td>
                                <td>Output quality (1-100). Default: 80</td>
                            </tr>
                            <tr>
                                <td><code>width</code></td>
                                <td>Integer</td>
                                <td>No</td>
                                <td>Resize width in pixels</td>
                            </tr>
                            <tr>
                                <td><code>height</code></td>
                                <td>Integer</td>
                                <td>No</td>
                                <td>Resize height in pixels</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Response Headers</h3>
                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Header</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>X-Original-Size</code></td>
                                <td>Original file size in bytes</td>
                            </tr>
                            <tr>
                                <td><code>X-Compressed-Size</code></td>
                                <td>Compressed file size in bytes</td>
                            </tr>
                            <tr>
                                <td><code>X-Saved-Percent</code></td>
                                <td>Percentage of size reduction</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Example Request</h3>
                    <MultiLanguageExample />
                </section>

                {/* Converting Images */}
                <section id="converting" className="api-section">
                    <h2>Converting Images</h2>
                    <p>
                        Use the API to convert images between different formats. Shrinkix supports conversion
                        to PNG, JPEG, WebP, and AVIF formats.
                    </p>

                    <h3>Request Options</h3>
                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>format</code></td>
                                <td>String</td>
                                <td>Target format: <code>jpg</code>, <code>png</code>, <code>webp</code>, <code>avif</code></td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Example Convert Request</h3>
                    <CodeExample examples={{
                        'cURL': `# Request - Convert PNG to WebP
curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.png" \\
  -F "format=webp" \\
  -o photo.webp \\
  -v

# Response Headers
< HTTP/1.1 200 OK
< X-Original-Size: 125840
< X-Compressed-Size: 42150
< X-Saved-Percent: 66.51
< Content-Type: image/webp
< Content-Length: 42150

# Output
* Saved photo.webp (42150 bytes)
* Format converted: PNG → WebP
* Compression: 66.51% reduction`,

                        'Node.js': `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('image', fs.createReadStream('photo.png'));
form.append('format', 'webp');

const response = await axios.post('https://api.shrinkix.com/compress', form, {
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    ...form.getHeaders()
  },
  responseType: 'arraybuffer'
});

fs.writeFileSync('photo.webp', response.data);

// Output
console.log('Format:', response.headers['content-type']);
console.log('Original Size:', response.headers['x-original-size']);
console.log('Compressed Size:', response.headers['x-compressed-size']);
console.log('Saved:', response.headers['x-saved-percent'] + '%');

// Console Output:
// Format: image/webp
// Original Size: 125840
// Compressed Size: 42150
// Saved: 66.51%`,

                        'Python': `import requests

with open('photo.png', 'rb') as f:
    response = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'format': 'webp'},
        headers={'X-API-Key': 'YOUR_API_KEY'}
    )

with open('photo.webp', 'wb') as f:
    f.write(response.content)

# Output
print(f"Format: {response.headers['Content-Type']}")
print(f"Original Size: {response.headers['X-Original-Size']}")
print(f"Compressed Size: {response.headers['X-Compressed-Size']}")
print(f"Saved: {response.headers['X-Saved-Percent']}%")

# Console Output:
# Format: image/webp
# Original Size: 125840
# Compressed Size: 42150
# Saved: 66.51%`,

                        'PHP': `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile('photo.png'),
    'format' => 'webp'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

file_put_contents('photo.webp', $body);

// Output
preg_match('/Content-Type: ([^\\r\\n]+)/', $headers, $contentType);
preg_match('/X-Original-Size: (\\d+)/', $headers, $originalSize);
preg_match('/X-Compressed-Size: (\\d+)/', $headers, $compressedSize);
preg_match('/X-Saved-Percent: ([\\d.]+)/', $headers, $savedPercent);

echo "Format: " . $contentType[1] . "\\n";
echo "Original Size: " . $originalSize[1] . " bytes\\n";
echo "Compressed Size: " . $compressedSize[1] . " bytes\\n";
echo "Saved: " . $savedPercent[1] . "%\\n";

// Console Output:
// Format: image/webp
// Original Size: 125840 bytes
// Compressed Size: 42150 bytes
// Saved: 66.51%`,

                        'Ruby': `require 'net/http'
require 'uri'

uri = URI.parse('https://api.shrinkix.com/compress')
request = Net::HTTP::Post.new(uri)
request['X-API-Key'] = 'YOUR_API_KEY'

form_data = [
  ['image', File.open('photo.png')],
  ['format', 'webp']
]
request.set_form form_data, 'multipart/form-data'

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

File.write('photo.webp', response.body)

# Output
puts "Format: #{response['Content-Type']}"
puts "Original Size: #{response['X-Original-Size']}"
puts "Compressed Size: #{response['X-Compressed-Size']}"
puts "Saved: #{response['X-Saved-Percent']}%"

# Console Output:
# Format: image/webp
# Original Size: 125840
# Compressed Size: 42150
# Saved: 66.51%`,

                        'Go': `package main

import (
    "bytes"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func main() {
    file, _ := os.Open("photo.png")
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    part, _ := writer.CreateFormFile("image", "photo.png")
    io.Copy(part, file)
    writer.WriteField("format", "webp")
    writer.Close()

    req, _ := http.NewRequest("POST", "https://api.shrinkix.com/compress", body)
    req.Header.Set("X-API-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    out, _ := os.Create("photo.webp")
    defer out.Close()
    io.Copy(out, resp.Body)
    
    // Output
    fmt.Printf("Format: %s\\n", resp.Header.Get("Content-Type"))
    fmt.Printf("Original Size: %s\\n", resp.Header.Get("X-Original-Size"))
    fmt.Printf("Compressed Size: %s\\n", resp.Header.Get("X-Compressed-Size"))
    fmt.Printf("Saved: %s%%\\n", resp.Header.Get("X-Saved-Percent"))
}

// Console Output:
// Format: image/webp
// Original Size: 125840
// Compressed Size: 42150
// Saved: 66.51%`,

                        'Java': `import java.net.http.*;
import java.nio.file.*;

HttpClient client = HttpClient.newHttpClient();
Path file = Path.of("photo.png");

String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
byte[] data = Files.readAllBytes(file);

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shrinkix.com/compress"))
    .header("X-API-Key", "YOUR_API_KEY")
    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
    .POST(HttpRequest.BodyPublishers.ofByteArray(data))
    .build();

HttpResponse<byte[]> response = client.send(request, 
    HttpResponse.BodyHandlers.ofByteArray());
    
Files.write(Path.of("photo.webp"), response.body());

// Output
System.out.println("Format: " + 
    response.headers().firstValue("Content-Type").orElse("N/A"));
System.out.println("Original Size: " + 
    response.headers().firstValue("X-Original-Size").orElse("N/A"));
System.out.println("Compressed Size: " + 
    response.headers().firstValue("X-Compressed-Size").orElse("N/A"));
System.out.println("Saved: " + 
    response.headers().firstValue("X-Saved-Percent").orElse("N/A") + "%");

// Console Output:
// Format: image/webp
// Original Size: 125840
// Compressed Size: 42150
// Saved: 66.51%`,

                        'C#': `using System.Net.Http;
using System.IO;

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");

using var form = new MultipartFormDataContent();
using var fileStream = File.OpenRead("photo.png");

form.Add(new StreamContent(fileStream), "image", "photo.png");
form.Add(new StringContent("webp"), "format");

var response = await client.PostAsync("https://api.shrinkix.com/compress", form);
var bytes = await response.Content.ReadAsByteArrayAsync();
await File.WriteAllBytesAsync("photo.webp", bytes);

// Output
Console.WriteLine($"Format: {response.Content.Headers.ContentType}");
Console.WriteLine($"Original Size: {response.Headers.GetValues("X-Original-Size").First()}");
Console.WriteLine($"Compressed Size: {response.Headers.GetValues("X-Compressed-Size").First()}");
Console.WriteLine($"Saved: {response.Headers.GetValues("X-Saved-Percent").First()}%");

// Console Output:
// Format: image/webp
// Original Size: 125840
// Compressed Size: 42150
// Saved: 66.51%`
                    }} />

                    <div className="note">
                        <strong>💡 Tip:</strong> WebP and AVIF formats typically provide better compression
                        than PNG or JPEG while maintaining visual quality.
                    </div>
                </section>

                {/* Preserving Metadata */}
                <section id="metadata" className="api-section">
                    <h2>Preserving Metadata</h2>
                    <p>
                        By default, Shrinkix removes metadata (EXIF, IPTC, XMP) to reduce file size.
                        You can preserve specific metadata if needed.
                    </p>

                    <h3>Request Options</h3>
                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>preserveMetadata</code></td>
                                <td>Boolean</td>
                                <td>Set to <code>true</code> to keep all metadata</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Example with Metadata</h3>
                    <CodeExample examples={{
                        'cURL': `# Request - Preserve EXIF metadata
curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "preserveMetadata=true" \\
  -o compressed.jpg \\
  -v

# Response Headers
< HTTP/1.1 200 OK
< X-Original-Size: 89450
< X-Compressed-Size: 28120
< X-Saved-Percent: 68.55
< X-Metadata-Preserved: true
< Content-Type: image/jpeg

# Output
* Metadata preserved (EXIF, GPS, camera info)
* Compression: 68.55% reduction
* File size: 28,120 bytes`,

                        'Node.js': `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('image', fs.createReadStream('photo.jpg'));
form.append('preserveMetadata', 'true');

const response = await axios.post('https://api.shrinkix.com/compress', form, {
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    ...form.getHeaders()
  },
  responseType: 'arraybuffer'
});

fs.writeFileSync('compressed.jpg', response.data);

// Output
console.log('Metadata Preserved:', response.headers['x-metadata-preserved']);
console.log('Original Size:', response.headers['x-original-size']);
console.log('Compressed Size:', response.headers['x-compressed-size']);
console.log('Saved:', response.headers['x-saved-percent'] + '%');

// Console Output:
// Metadata Preserved: true
// Original Size: 89450
// Compressed Size: 28120
// Saved: 68.55%`,

                        'Python': `import requests

with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'preserveMetadata': 'true'},
        headers={'X-API-Key': 'YOUR_API_KEY'}
    )

with open('compressed.jpg', 'wb') as f:
    f.write(response.content)

# Output
print(f"Metadata Preserved: {response.headers['X-Metadata-Preserved']}")
print(f"Original Size: {response.headers['X-Original-Size']}")
print(f"Compressed Size: {response.headers['X-Compressed-Size']}")
print(f"Saved: {response.headers['X-Saved-Percent']}%")

# Console Output:
# Metadata Preserved: true
# Original Size: 89450
# Compressed Size: 28120
# Saved: 68.55%`,

                        'PHP': `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile('photo.jpg'),
    'preserveMetadata' => 'true'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

file_put_contents('compressed.jpg', $body);

// Output
preg_match('/X-Metadata-Preserved: ([^\\r\\n]+)/', $headers, $metadataPreserved);
preg_match('/X-Original-Size: (\\d+)/', $headers, $originalSize);
preg_match('/X-Compressed-Size: (\\d+)/', $headers, $compressedSize);
preg_match('/X-Saved-Percent: ([\\d.]+)/', $headers, $savedPercent);

echo "Metadata Preserved: " . $metadataPreserved[1] . "\\n";
echo "Original Size: " . $originalSize[1] . " bytes\\n";
echo "Compressed Size: " . $compressedSize[1] . " bytes\\n";
echo "Saved: " . $savedPercent[1] . "%\\n";

// Console Output:
// Metadata Preserved: true
// Original Size: 89450 bytes
// Compressed Size: 28120 bytes
// Saved: 68.55%`,

                        'Ruby': `require 'net/http'
require 'uri'

uri = URI.parse('https://api.shrinkix.com/compress')
request = Net::HTTP::Post.new(uri)
request['X-API-Key'] = 'YOUR_API_KEY'

form_data = [
  ['image', File.open('photo.jpg')],
  ['preserveMetadata', 'true']
]
request.set_form form_data, 'multipart/form-data'

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

File.write('compressed.jpg', response.body)

# Output
puts "Metadata Preserved: #{response['X-Metadata-Preserved']}"
puts "Original Size: #{response['X-Original-Size']}"
puts "Compressed Size: #{response['X-Compressed-Size']}"
puts "Saved: #{response['X-Saved-Percent']}%"

# Console Output:
# Metadata Preserved: true
# Original Size: 89450
# Compressed Size: 28120
# Saved: 68.55%`,

                        'Go': `package main

import (
    "bytes"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func main() {
    file, _ := os.Open("photo.jpg")
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    part, _ := writer.CreateFormFile("image", "photo.jpg")
    io.Copy(part, file)
    writer.WriteField("preserveMetadata", "true")
    writer.Close()

    req, _ := http.NewRequest("POST", "https://api.shrinkix.com/compress", body)
    req.Header.Set("X-API-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    out, _ := os.Create("compressed.jpg")
    defer out.Close()
    io.Copy(out, resp.Body)
    
    // Output
    fmt.Printf("Metadata Preserved: %s\\n", resp.Header.Get("X-Metadata-Preserved"))
    fmt.Printf("Original Size: %s\\n", resp.Header.Get("X-Original-Size"))
    fmt.Printf("Compressed Size: %s\\n", resp.Header.Get("X-Compressed-Size"))
    fmt.Printf("Saved: %s%%\\n", resp.Header.Get("X-Saved-Percent"))
}

// Console Output:
// Metadata Preserved: true
// Original Size: 89450
// Compressed Size: 28120
// Saved: 68.55%`,

                        'Java': `import java.net.http.*;
import java.nio.file.*;

HttpClient client = HttpClient.newHttpClient();
Path file = Path.of("photo.jpg");

String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
byte[] data = Files.readAllBytes(file);

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shrinkix.com/compress"))
    .header("X-API-Key", "YOUR_API_KEY")
    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
    .POST(HttpRequest.BodyPublishers.ofByteArray(data))
    .build();

HttpResponse<byte[]> response = client.send(request, 
    HttpResponse.BodyHandlers.ofByteArray());
    
Files.write(Path.of("compressed.jpg"), response.body());

// Output
System.out.println("Metadata Preserved: " + 
    response.headers().firstValue("X-Metadata-Preserved").orElse("N/A"));
System.out.println("Original Size: " + 
    response.headers().firstValue("X-Original-Size").orElse("N/A"));
System.out.println("Compressed Size: " + 
    response.headers().firstValue("X-Compressed-Size").orElse("N/A"));
System.out.println("Saved: " + 
    response.headers().firstValue("X-Saved-Percent").orElse("N/A") + "%");

// Console Output:
// Metadata Preserved: true
// Original Size: 89450
// Compressed Size: 28120
// Saved: 68.55%`,

                        'C#': `using System.Net.Http;
using System.IO;

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");

using var form = new MultipartFormDataContent();
using var fileStream = File.OpenRead("photo.jpg");

form.Add(new StreamContent(fileStream), "image", "photo.jpg");
form.Add(new StringContent("true"), "preserveMetadata");

var response = await client.PostAsync("https://api.shrinkix.com/compress", form);
var bytes = await response.Content.ReadAsByteArrayAsync();
await File.WriteAllBytesAsync("compressed.jpg", bytes);

// Output
Console.WriteLine($"Metadata Preserved: {response.Headers.GetValues("X-Metadata-Preserved").First()}");
Console.WriteLine($"Original Size: {response.Headers.GetValues("X-Original-Size").First()}");
Console.WriteLine($"Compressed Size: {response.Headers.GetValues("X-Compressed-Size").First()}");
Console.WriteLine($"Saved: {response.Headers.GetValues("X-Saved-Percent").First()}%");

// Console Output:
// Metadata Preserved: true
// Original Size: 89450
// Compressed Size: 28120
// Saved: 68.55%`
                    }} />

                    <div className="note">
                        <strong>📸 What Metadata is Preserved:</strong>
                        <ul>
                            <li>EXIF data (camera settings, date, time)</li>
                            <li>GPS coordinates (location information)</li>
                            <li>Camera make and model</li>
                            <li>Copyright and author information</li>
                            <li>Color profile (ICC)</li>
                        </ul>
                        <strong>Note:</strong> Preserving metadata will result in slightly larger file sizes (typically 2-5% larger).
                    </div>
                </section>

                {/* Error Handling */}
                <section id="errors" className="api-section">
                    <h2>Error Handling</h2>
                    <p>
                        The Shrinkix API uses standard HTTP status codes to indicate the success or failure
                        of requests. Errors should be handled appropriately in your application.
                    </p>

                    <h3>HTTP Status Codes</h3>
                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Status Code</th>
                                <th>Error Type</th>
                                <th>Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>200 OK</code></td>
                                <td>-</td>
                                <td>Request successful</td>
                            </tr>
                            <tr>
                                <td><code>400 Bad Request</code></td>
                                <td>ClientError</td>
                                <td>Invalid parameters or unsupported file format</td>
                            </tr>
                            <tr>
                                <td><code>401 Unauthorized</code></td>
                                <td>AccountError</td>
                                <td>Missing or invalid API key</td>
                            </tr>
                            <tr>
                                <td><code>413 Payload Too Large</code></td>
                                <td>ClientError</td>
                                <td>File size exceeds plan limit</td>
                            </tr>
                            <tr>
                                <td><code>429 Too Many Requests</code></td>
                                <td>AccountError</td>
                                <td>Rate limit exceeded or monthly quota reached</td>
                            </tr>
                            <tr>
                                <td><code>500 Internal Server Error</code></td>
                                <td>ServerError</td>
                                <td>Temporary server issue - please retry</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Error Types</h3>
                    <div className="error-types">
                        <div className="error-type-card">
                            <h4>AccountError (401, 429)</h4>
                            <p>Verify your API key and check your account limits. You may need to upgrade your plan.</p>
                        </div>
                        <div className="error-type-card">
                            <h4>ClientError (400, 413)</h4>
                            <p>Check your source image and request parameters. Ensure the file format is supported and within size limits.</p>
                        </div>
                        <div className="error-type-card">
                            <h4>ServerError (500)</h4>
                            <p>Temporary issue with the Shrinkix API. Please retry your request after a short delay.</p>
                        </div>
                        <div className="error-type-card">
                            <h4>ConnectionError</h4>
                            <p>Network connection error occurred. Check your internet connection and retry.</p>
                        </div>
                    </div>

                    <h3>Error Code Reference</h3>
                    <p>Specific error codes to help you troubleshoot issues quickly:</p>

                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Error Code</th>
                                <th>HTTP Status</th>
                                <th>Description</th>
                                <th>Recommended Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>INVALID_API_KEY</code></td>
                                <td>401</td>
                                <td>API key is missing or invalid</td>
                                <td>Verify your API key in dashboard</td>
                            </tr>
                            <tr>
                                <td><code>QUOTA_EXCEEDED</code></td>
                                <td>429</td>
                                <td>Monthly compression limit reached</td>
                                <td>Upgrade plan or wait for reset</td>
                            </tr>
                            <tr>
                                <td><code>RATE_LIMIT_EXCEEDED</code></td>
                                <td>429</td>
                                <td>Too many requests per second</td>
                                <td>Implement rate limiting in your code</td>
                            </tr>
                            <tr>
                                <td><code>FILE_TOO_LARGE</code></td>
                                <td>413</td>
                                <td>File exceeds plan size limit</td>
                                <td>Reduce file size or upgrade plan</td>
                            </tr>
                            <tr>
                                <td><code>UNSUPPORTED_FORMAT</code></td>
                                <td>400</td>
                                <td>Image format not supported</td>
                                <td>Use JPG, PNG, WebP, or AVIF</td>
                            </tr>
                            <tr>
                                <td><code>INVALID_QUALITY</code></td>
                                <td>400</td>
                                <td>Quality parameter must be 1-100</td>
                                <td>Adjust quality to valid range</td>
                            </tr>
                            <tr>
                                <td><code>INVALID_DIMENSIONS</code></td>
                                <td>400</td>
                                <td>Width/height parameters invalid</td>
                                <td>Use positive integers for dimensions</td>
                            </tr>
                            <tr>
                                <td><code>CORRUPTED_IMAGE</code></td>
                                <td>400</td>
                                <td>Image file is corrupted or invalid</td>
                                <td>Verify image file integrity</td>
                            </tr>
                            <tr>
                                <td><code>SERVER_ERROR</code></td>
                                <td>500</td>
                                <td>Internal server error</td>
                                <td>Retry after a short delay</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Example Error Response</h3>
                    <CodeExample examples={{
                        'JSON': `{
  "error": "Invalid API key",
  "status": 401,
  "message": "Please provide a valid API key in the X-API-Key header"
}`
                    }} />

                    <h3>Error Handling Examples</h3>
                    <p>Handle errors appropriately in your application:</p>

                    <CodeExample examples={{
                        'Node.js': `try {
  const response = await axios.post('https://api.shrinkix.com/compress', form, {
    headers: { 'X-API-Key': apiKey, ...form.getHeaders() }
  });
  
  // Success - save compressed image
  fs.writeFileSync('compressed.jpg', response.data);
  
} catch (error) {
  if (error.response) {
    const status = error.response.status;
    
    if (status === 401 || status === 429) {
      // AccountError - check API key and limits
      console.error('Account error:', error.response.data.message);
      // Verify API key or upgrade plan
      
    } else if (status === 400 || status === 413) {
      // ClientError - check request parameters
      console.error('Client error:', error.response.data.message);
      // Check image format and size
      
    } else if (status === 500) {
      // ServerError - retry after delay
      console.error('Server error - retrying...');
      await new Promise(r => setTimeout(r, 5000));
      // Retry request
    }
  } else {
    // ConnectionError - network issue
    console.error('Connection error:', error.message);
  }
}`,
                        'Python': `import requests
from requests.exceptions import RequestException

try:
    response = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': open('photo.jpg', 'rb')},
        headers={'X-API-Key': api_key}
    )
    response.raise_for_status()
    
    # Success - save compressed image
    with open('compressed.jpg', 'wb') as f:
        f.write(response.content)
        
except requests.exceptions.HTTPError as e:
    status = e.response.status_code
    
    if status in [401, 429]:
        # AccountError - check API key and limits
        print(f"Account error: {e.response.json()['message']}")
        # Verify API key or upgrade plan
        
    elif status in [400, 413]:
        # ClientError - check request parameters
        print(f"Client error: {e.response.json()['message']}")
        # Check image format and size
        
    elif status == 500:
        # ServerError - retry after delay
        print("Server error - retrying...")
        time.sleep(5)
        # Retry request
        
except RequestException as e:
    # ConnectionError - network issue
    print(f"Connection error: {e}")`,
                        'PHP': `<?php
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: ' . $apiKey]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'image' => new CURLFile('photo.jpg')
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        // Success - save compressed image
        file_put_contents('compressed.jpg', $response);
        
    } elseif ($httpCode === 401 || $httpCode === 429) {
        // AccountError - check API key and limits
        $error = json_decode($response, true);
        error_log('Account error: ' . $error['message']);
        // Verify API key or upgrade plan
        
    } elseif ($httpCode === 400 || $httpCode === 413) {
        // ClientError - check request parameters
        $error = json_decode($response, true);
        error_log('Client error: ' . $error['message']);
        // Check image format and size
        
    } elseif ($httpCode === 500) {
        // ServerError - retry after delay
        error_log('Server error - retrying...');
        sleep(5);
        // Retry request
    }
    
} catch (Exception $e) {
    // ConnectionError - network issue
    error_log('Connection error: ' . $e->getMessage());
}`,
                        'Ruby': `require 'net/http'
require 'json'

begin
  uri = URI.parse('https://api.shrinkix.com/compress')
  request = Net::HTTP::Post.new(uri)
  request['X-API-Key'] = api_key
  
  form_data = [['image', File.open('photo.jpg')]]
  request.set_form form_data, 'multipart/form-data'
  
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  
  case response.code.to_i
  when 200
    # Success - save compressed image
    File.write('compressed.jpg', response.body)
    
  when 401, 429
    # AccountError - check API key and limits
    error = JSON.parse(response.body)
    puts "Account error: #{error['message']}"
    # Verify API key or upgrade plan
    
  when 400, 413
    # ClientError - check request parameters
    error = JSON.parse(response.body)
    puts "Client error: #{error['message']}"
    # Check image format and size
    
  when 500
    # ServerError - retry after delay
    puts 'Server error - retrying...'
    sleep 5
    # Retry request
  end
  
rescue StandardError => e
  # ConnectionError - network issue
  puts "Connection error: #{e.message}"
end`,
                        'Go': `// Check response status code
if resp.StatusCode != http.StatusOK {
    var errResp ErrorResponse
    json.NewDecoder(resp.Body).Decode(&errResp)

    switch resp.StatusCode {
    case 401, 429:
        // AccountError
        fmt.Printf("Account error: %s\\n", errResp.Message)
    case 400, 413:
        // ClientError
        fmt.Printf("Client error: %s\\n", errResp.Message)
    case 500:
        // ServerError - retry
        fmt.Println("Server error - retrying...")
        time.Sleep(5 * time.Second)
    default:
        fmt.Printf("Unexpected error: %d\\n", resp.StatusCode)
    }
    return
}

// Success - save compressed image
io.Copy(out, resp.Body)

// Console Output:
// Account error: Please provide a valid API key`,
                        'Java': `HttpResponse<byte[]> response = client.send(request, 
    HttpResponse.BodyHandlers.ofByteArray());

int status = response.statusCode();

if (status == 200) {
    // Success - save compressed image
    Files.write(Path.of("compressed.jpg"), response.body());
    
} else if (status == 401 || status == 429) {
    // AccountError
    System.out.println("Account error: Check API key and limits");
    
} else if (status == 400 || status == 413) {
    // ClientError
    System.out.println("Client error: Check parameters and file size");
    
} else if (status == 500) {
    // ServerError
    System.out.println("Server error - retrying...");
    Thread.sleep(5000);
}

// Console Output:
// Client error: Check parameters and file size`,
                        'C#': `var response = await client.PostAsync("https://api.shrinkix.com/compress", form);

if (response.IsSuccessStatusCode)
{
    // Success - save compressed image
    var bytes = await response.Content.ReadAsByteArrayAsync();
    await File.WriteAllBytesAsync("compressed.jpg", bytes);
}
else
{
    var errorJson = await response.Content.ReadAsStringAsync();
    var status = (int)response.StatusCode;

    switch (status)
    {
        case 401:
        case 429:
            // AccountError
            Console.WriteLine($"Account error: {status}");
            break;
        case 400:
        case 413:
            // ClientError
            Console.WriteLine($"Client error: {status}");
            break;
        case 500:
            // ServerError
            Console.WriteLine("Server error - retrying...");
            await Task.Delay(5000);
            break;
    }
}

// Console Output:
// Account error: 401`,
                        'cURL': `# Check HTTP status code
curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: IO" \\
  -F "image=@photo.jpg" \\
  -v

# Output indicating error
< HTTP/1.1 401 Unauthorized
< Content-Type: application/json
{
  "error": "Invalid API key",
  "status": 401,
  "message": "Please provide a valid API key in the X-API-Key header"
}`
                    }} />

                    <h3>API Key Validation</h3>
                    <p>
                        Validate your API key before making compression requests to ensure it's working correctly:
                    </p>

                    <CodeExample examples={{
                        'Node.js': `async function validateApiKey(apiKey) {
  try {
    const response = await axios.get('https://api.shrinkix.com/check-limit', {
      headers: { 'X-API-Key': apiKey }
    });
    
    console.log('API key valid!');
    console.log('Remaining:', response.data.remaining);
    return true;
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Invalid API key');
      return false;
    }
    throw error;
  }
}

// Console Output:
// API key valid!
// Remaining: 4850`,
                        'Python': `def validate_api_key(api_key):
    try:
        response = requests.get(
            'https://api.shrinkix.com/check-limit',
            headers={'X-API-Key': api_key}
        )
        response.raise_for_status()
        
        print('API key valid!')
        print(f"Remaining: {response.json()['remaining']}")
        return True
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print('Invalid API key')
            return False
        raise

# Console Output:
# API key valid!
# Remaining: 4850`
                    }} />

                    <div className="note">
                        <strong>💡 Best Practices:</strong>
                        <ul>
                            <li>Always validate API keys before processing user images</li>
                            <li>Implement exponential backoff for server errors (500)</li>
                            <li>Log errors for debugging and monitoring</li>
                            <li>Show user-friendly error messages to end users</li>
                            <li>Check account limits before batch operations</li>
                        </ul>
                    </div>
                </section>

                {/* Compression Count */}
                <section id="compression-count" className="api-section">
                    <h2>Compression Count</h2>
                    <p>
                        You can check your current usage and remaining compressions at any time.
                    </p>

                    <div className="endpoint-badge">
                        <span className="method-label get">GET</span>
                        <code>/api/check-limit</code>
                    </div>

                    <h3>Example Request</h3>
                    <CodeExample examples={{
                        'cURL': `curl https://api.shrinkix.com/check-limit \\
  -H "X-API-Key: YOUR_API_KEY"

# Output
{
  "remaining": 4850,
  "plan": "api-pro",
  "total": 5000,
  "usage": 150,
  "maxFileSize": 26214400
}`,
                        'Node.js': `const response = await axios.get('https://api.shrinkix.com/check-limit', {
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});

console.log(response.data);

// Output
// {
//   remaining: 4850,
//   plan: 'api-pro',
//   total: 5000,
//   usage: 150,
//   maxFileSize: 26214400
// }`,
                        'Python': `response = requests.get(
    'https://api.shrinkix.com/check-limit',
    headers={'X-API-Key': 'YOUR_API_KEY'}
)

print(response.json())

# Output
# {
#   'remaining': 4850,
#   'plan': 'api-pro',
#   'total': 5000,
#   'usage': 150,
#   'maxFileSize': 26214400
# }`
                    }} />

                    <h3>Example Response</h3>
                    <CodeExample examples={{
                        'JSON': `{
  "remaining": 4850,
  "plan": "api-pro",
  "total": 5000,
  "usage": 150,
  "maxFileSize": 26214400
}`
                    }} />

                    <h3>Response Fields</h3>
                    <table className="params-table">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>remaining</code></td>
                                <td>Compressions remaining this month</td>
                            </tr>
                            <tr>
                                <td><code>plan</code></td>
                                <td>Your current plan</td>
                            </tr>
                            <tr>
                                <td><code>total</code></td>
                                <td>Total monthly compressions</td>
                            </tr>
                            <tr>
                                <td><code>usage</code></td>
                                <td>Compressions used this month</td>
                            </tr>
                            <tr>
                                <td><code>maxFileSize</code></td>
                                <td>Maximum file size in bytes</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* Need Help */}
                <section id="help" className="api-section">
                    <h2>Need Help? Got Feedback?</h2>
                    <p>
                        We're here to help! If you have questions, need support, or want to provide feedback
                        about the Shrinkix API, we'd love to hear from you.
                    </p>

                    <div className="help-grid">
                        <div className="help-card">
                            <h4>📧 Email Support</h4>
                            <p>Get help from our support team</p>
                            <a href="mailto:support@shrinkix.com" className="btn btn-secondary">
                                Contact Support
                            </a>
                        </div>
                        <div className="help-card">
                            <h4>📚 Documentation</h4>
                            <p>Browse our complete documentation</p>
                            <Link to="/developers/how-it-works" className="btn btn-secondary">
                                View Docs
                            </Link>
                        </div>
                        <div className="help-card">
                            <h4>💬 Feedback</h4>
                            <p>Share your thoughts and suggestions</p>
                            <a href="mailto:feedback@shrinkix.com" className="btn btn-secondary">
                                Send Feedback
                            </a>
                        </div>
                    </div>

                    <div className="note" style={{ marginTop: '2rem' }}>
                        <strong>🚀 Quick Links:</strong>
                        <ul>
                            <li><Link to="/dashboard/api">API Dashboard</Link> - Manage your API keys</li>
                            <li><Link to="/pricing">Pricing Plans</Link> - Upgrade for higher limits</li>
                            <li><Link to="/">Home</Link> - Try the web interface</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Multi-language comprehensive example with output
function MultiLanguageExample() {
    const examples = {
        'cURL': `# Request
curl -X POST https://api.shrinkix.com/compress \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "quality=80" \\
  -o compressed.jpg \\
  -v

# Response Headers
< HTTP/1.1 200 OK
< X-Original-Size: 49925
< X-Compressed-Size: 13084
< X-Saved-Percent: 73.79
< Content-Type: image/jpeg
< Content-Length: 13084

# Output
* Saved compressed.jpg (13084 bytes)
* Compression: 73.79% reduction`,

        'Node.js': `const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('image', fs.createReadStream('photo.jpg'));
form.append('quality', '80');

const response = await axios.post('https://api.shrinkix.com/compress', form, {
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    ...form.getHeaders()
  },
  responseType: 'arraybuffer'
});

fs.writeFileSync('compressed.jpg', response.data);

// Output
console.log('Original Size:', response.headers['x-original-size']);
console.log('Compressed Size:', response.headers['x-compressed-size']);
console.log('Saved:', response.headers['x-saved-percent'] + '%');

// Console Output:
// Original Size: 49925
// Compressed Size: 13084
// Saved: 73.79%`,

        'Python': `import requests

with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'https://api.shrinkix.com/compress',
        files={'image': f},
        data={'quality': 80},
        headers={'X-API-Key': 'YOUR_API_KEY'}
    )

with open('compressed.jpg', 'wb') as f:
    f.write(response.content)

# Output
print(f"Status Code: {response.status_code}")
print(f"Original Size: {response.headers['X-Original-Size']}")
print(f"Compressed Size: {response.headers['X-Compressed-Size']}")
print(f"Saved: {response.headers['X-Saved-Percent']}%")

# Console Output:
# Status Code: 200
# Original Size: 49925
# Compressed Size: 13084
# Saved: 73.79%`,

        'PHP': `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile('photo.jpg'),
    'quality' => 80
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

file_put_contents('compressed.jpg', $body);

// Output
preg_match('/X-Original-Size: (\\d+)/', $headers, $originalSize);
preg_match('/X-Compressed-Size: (\\d+)/', $headers, $compressedSize);
preg_match('/X-Saved-Percent: ([\\d.]+)/', $headers, $savedPercent);

echo "HTTP Code: $httpCode\\n";
echo "Original Size: " . $originalSize[1] . " bytes\\n";
echo "Compressed Size: " . $compressedSize[1] . " bytes\\n";
echo "Saved: " . $savedPercent[1] . "%\\n";

// Console Output:
// HTTP Code: 200
// Original Size: 49925 bytes
// Compressed Size: 13084 bytes
// Saved: 73.79%`,

        'Ruby': `require 'net/http'
require 'uri'

uri = URI.parse('https://api.shrinkix.com/compress')
request = Net::HTTP::Post.new(uri)
request['X-API-Key'] = 'YOUR_API_KEY'

form_data = [
  ['image', File.open('photo.jpg')],
  ['quality', '80']
]
request.set_form form_data, 'multipart/form-data'

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

File.write('compressed.jpg', response.body)

# Output
puts "Status Code: #{response.code}"
puts "Original Size: #{response['X-Original-Size']}"
puts "Compressed Size: #{response['X-Compressed-Size']}"
puts "Saved: #{response['X-Saved-Percent']}%"

# Console Output:
# Status Code: 200
# Original Size: 49925
# Compressed Size: 13084
# Saved: 73.79%`,

        'Go': `package main

import (
    "bytes"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func main() {
    file, _ := os.Open("photo.jpg")
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    part, _ := writer.CreateFormFile("image", "photo.jpg")
    io.Copy(part, file)
    writer.WriteField("quality", "80")
    writer.Close()

    req, _ := http.NewRequest("POST", "https://api.shrinkix.com/compress", body)
    req.Header.Set("X-API-Key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    out, _ := os.Create("compressed.jpg")
    defer out.Close()
    io.Copy(out, resp.Body)
    
    // Output
    fmt.Printf("Status Code: %d\\n", resp.StatusCode)
    fmt.Printf("Original Size: %s\\n", resp.Header.Get("X-Original-Size"))
    fmt.Printf("Compressed Size: %s\\n", resp.Header.Get("X-Compressed-Size"))
    fmt.Printf("Saved: %s%%\\n", resp.Header.Get("X-Saved-Percent"))
}

// Console Output:
// Status Code: 200
// Original Size: 49925
// Compressed Size: 13084
// Saved: 73.79%`,

        'Java': `import java.net.http.*;
import java.nio.file.*;

HttpClient client = HttpClient.newHttpClient();
Path file = Path.of("photo.jpg");

String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
byte[] data = Files.readAllBytes(file);

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.shrinkix.com/compress"))
    .header("X-API-Key", "YOUR_API_KEY")
    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
    .POST(HttpRequest.BodyPublishers.ofByteArray(data))
    .build();

HttpResponse<byte[]> response = client.send(request, 
    HttpResponse.BodyHandlers.ofByteArray());
    
Files.write(Path.of("compressed.jpg"), response.body());

// Output
System.out.println("Status Code: " + response.statusCode());
System.out.println("Original Size: " + 
    response.headers().firstValue("X-Original-Size").orElse("N/A"));
System.out.println("Compressed Size: " + 
    response.headers().firstValue("X-Compressed-Size").orElse("N/A"));
System.out.println("Saved: " + 
    response.headers().firstValue("X-Saved-Percent").orElse("N/A") + "%");

// Console Output:
// Status Code: 200
// Original Size: 49925
// Compressed Size: 13084
// Saved: 73.79%`,

        'C#': `using System.Net.Http;
using System.IO;

using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");

using var form = new MultipartFormDataContent();
using var fileStream = File.OpenRead("photo.jpg");

form.Add(new StreamContent(fileStream), "image", "photo.jpg");
form.Add(new StringContent("80"), "quality");

var response = await client.PostAsync("https://api.shrinkix.com/compress", form);
var bytes = await response.Content.ReadAsByteArrayAsync();
await File.WriteAllBytesAsync("compressed.jpg", bytes);

// Output
Console.WriteLine($"Status Code: {(int)response.StatusCode}");
Console.WriteLine($"Original Size: {response.Headers.GetValues("X-Original-Size").First()}");
Console.WriteLine($"Compressed Size: {response.Headers.GetValues("X-Compressed-Size").First()}");
Console.WriteLine($"Saved: {response.Headers.GetValues("X-Saved-Percent").First()}%");

// Console Output:
// Status Code: 200
// Original Size: 49925
// Compressed Size: 13084
// Saved: 73.79%`
    };

    return <CodeExample examples={examples} />;
}

// Code Example Component
function CodeExample({ examples }) {
    const [activeTab, setActiveTab] = useState(Object.keys(examples)[0]);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(examples[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-example">
            <div className="code-tabs">
                {Object.keys(examples).map(lang => (
                    <button
                        key={lang}
                        className={`code-tab ${activeTab === lang ? 'active' : ''}`}
                        onClick={() => setActiveTab(lang)}
                    >
                        {lang}
                    </button>
                ))}
            </div>
            <div className="code-block-wrapper">
                <button className="copy-button" onClick={copyToClipboard}>
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <pre className="code-block">
                    <code>{examples[activeTab]}</code>
                </pre>
            </div>
        </div>
    );
}

