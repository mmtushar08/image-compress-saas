# Developer API Reference

Integrate SmartCompress into your applications with our easy-to-use HTTP API.

## Authentication

Pro users can authenticate using API keys sent in the request headers. Free users also receive **500 free API compressions per month**.

> [!IMPORTANT]
> Keep your API keys secure. Do not expose them in client-side code.

### API Key Header
```http
X-API-Key: your_api_key_here
X-API-Key: your_api_key_here
```

## Rate Limits
- **Free Account**: 500 API requests/month.
- **Web Plans**: Includes 500 API requests/month (same as Free).
- **API Pro**: 5,000 requests/month.
- **API Ultra**: 20,000 requests/month.

## Quick Start

### 1. Compress an Image

**Endpoint:** `POST https://api.shrinkix.com/compress`

Submit an image to be optimized. You can provide the image as a file upload.

#### Request Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `image` | File | The image file to compress (PNG, JPG, WebP). |
| `quality` | Integer | (Optional) Output quality (1-100). |
| `format` | String | (Optional) Convert to `webp`, `png`, `jpg`. |
| `width` | Integer | (Optional) Resize width. |
| `height` | Integer | (Optional) Resize height. |

#### Code Examples

````carousel
```node
const fs = require('fs');

async function compressImage() {
  const file = fs.openAsBlob('input.png');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('https://api.shrinkix.com/compress', {
    method: 'POST',
    headers: {
      'X-API-Key': 'YOUR_API_KEY'
    },
    body: formData
  });

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    fs.writeFileSync('output.png', Buffer.from(buffer));
  }
}
compressImage();
```
<!-- slide -->
```python
import requests

response = requests.post(
    "https://api.shrinkix.com/compress",
    files={"image": open("input.png", "rb")},
    headers={"X-API-Key": "YOUR_API_KEY"}
)

if response.status_code == 200:
    with open("output.png", "wb") as f:
        f.write(response.content)
```
<!-- slide -->
```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile('input.png')
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    file_put_contents('output.png', $result);
}
curl_close($ch);
?>
```
<!-- slide -->
```ruby
require 'net/http'
require 'uri'
require 'json'

# Use the 'multipart-post' gem for easier file uploads
# gem install multipart-post
require 'net/http/post/multipart'

url = URI.parse('https://api.shrinkix.com/compress')

File.open('input.png') do |png|
  req = Net::HTTP::Post::Multipart.new(
    url.path,
    "image" => UploadIO.new(png, "image/png", "input.png")
  )
  req['X-API-Key'] = 'YOUR_API_KEY'

  res = Net::HTTP.start(url.host, url.port, use_ssl: true) do |http|
    http.request(req)
  end
  
  File.binwrite('output.png', res.body)
end
```
<!-- slide -->
```go
package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	file, _ := os.Open("input.png")
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("image", "input.png")
	io.Copy(part, file)
	writer.Close()

	req, _ := http.NewRequest("POST", "https://api.shrinkix.com/compress", body)
	req.Header.Set("X-API-Key", "YOUR_API_KEY")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	out, _ := os.Create("output.png")
	defer out.Close()
	io.Copy(out, resp.Body)
}
```
<!-- slide -->
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.UUID;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class Compress {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder().build();
        Path file = Path.of("input.png");
        String boundary = "---boundary" + UUID.randomUUID().toString();
        
        // Manual multipart body construction for standard Java 11+ HttpClient
        // Ideally use a library like Apache HttpClient for production
        String header = "--" + boundary + "\r\n" +
                        "Content-Disposition: form-data; name=\"image\"; filename=\"input.png\"\r\n" +
                        "Content-Type: image/png\r\n\r\n";
        String footer = "\r\n--" + boundary + "--\r\n";
        
        byte[] headerBytes = header.getBytes(StandardCharsets.UTF_8);
        byte[] fileBytes = Files.readAllBytes(file);
        byte[] footerBytes = footer.getBytes(StandardCharsets.UTF_8);
        
        byte[] body = new byte[headerBytes.length + fileBytes.length + footerBytes.length];
        System.arraycopy(headerBytes, 0, body, 0, headerBytes.length);
        System.arraycopy(fileBytes, 0, body, headerBytes.length, fileBytes.length);
        System.arraycopy(footerBytes, 0, body, headerBytes.length + fileBytes.length, footerBytes.length);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.shrinkix.com/compress"))
                .header("X-API-Key", "YOUR_API_KEY")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                .build();

        client.send(request, HttpResponse.BodyHandlers.ofFile(Path.of("output.png")));
    }
}
```
<!-- slide -->
```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");

        using var form = new MultipartFormDataContent();
        using var fileStream = File.OpenRead("input.png");
        // "image" is the form field name, "input.png" is the filename
        form.Add(new StreamContent(fileStream), "image", "input.png");

        var response = await client.PostAsync("https://api.shrinkix.com/compress", form);
        
        if (response.IsSuccessStatusCode)
        {
            using var output = await response.Content.ReadAsStreamAsync();
            using var file = File.Create("output.png");
            await output.CopyToAsync(file);
        }
    }
}
```
````

### 2. Batch Compression

**Endpoint:** `POST https://api.shrinkix.com/compress/batch`

Compress multiple images at once. Returns a ZIP file.

````carousel
```bash
curl -X POST https://api.shrinkix.com/compress/batch \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "images[]=@photo1.jpg" \
  -F "images[]=@photo2.png" \
  -o compressed.zip
```
<!-- slide -->
```node
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function compressBatch() {
  const form = new FormData();
  form.append('images[]', fs.createReadStream('photo1.jpg'));
  form.append('images[]', fs.createReadStream('photo2.png'));

  const response = await axios.post('https://api.shrinkix.com/compress/batch', form, {
    headers: {
      ...form.getHeaders(),
      'X-API-Key': 'YOUR_API_KEY'
    },
    responseType: 'arraybuffer'
  });

  fs.writeFileSync('compressed.zip', response.data);
}
compressBatch();
```
<!-- slide -->
```python
import requests

files = [
    ('images[]', open('photo1.jpg', 'rb')),
    ('images[]', open('photo2.png', 'rb'))
]

response = requests.post(
    'https://api.shrinkix.com/compress/batch',
    files=files,
    headers={'X-API-Key': 'YOUR_API_KEY'}
)

with open('compressed.zip', 'wb') as f:
    f.write(response.content)
```
<!-- slide -->
```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress/batch');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'images[0]' => new CURLFile('photo1.jpg'),
    'images[1]' => new CURLFile('photo2.png')
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
file_put_contents('compressed.zip', $result);
curl_close($ch);
?>
```
<!-- slide -->
```ruby
require 'net/http/post/multipart'

url = URI.parse('https://api.shrinkix.com/compress/batch')

File.open('photo1.jpg') do |img1|
  File.open('photo2.png') do |img2|
    req = Net::HTTP::Post::Multipart.new(
      url.path,
      "images[]" => [
        UploadIO.new(img1, "image/jpeg", "photo1.jpg"),
        UploadIO.new(img2, "image/png", "photo2.png")
      ]
    )
    req['X-API-Key'] = 'YOUR_API_KEY'

    res = Net::HTTP.start(url.host, url.port, use_ssl: true) do |http|
      http.request(req)
    end
    
    File.binwrite('compressed.zip', res.body)
  end
end
```
<!-- slide -->
```go
package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add files
	for _, filename := range []string{"photo1.jpg", "photo2.png"} {
		file, _ := os.Open(filename)
		part, _ := writer.CreateFormFile("images[]", filename)
		io.Copy(part, file)
		file.Close()
	}
	writer.Close()

	req, _ := http.NewRequest("POST", "https://api.shrinkix.com/compress/batch", body)
	req.Header.Set("X-API-Key", "YOUR_API_KEY")
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	out, _ := os.Create("compressed.zip")
	defer out.Close()
	io.Copy(out, resp.Body)
}
```
<!-- slide -->
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.io.ByteArrayOutputStream;

public class BatchCompress {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder().build();
        String boundary = "BatchBoundary" + UUID.randomUUID().toString();
        
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        String boundaryLine = "--" + boundary;
        
        for (String filename : new String[]{"photo1.jpg", "photo2.png"}) {
            body.write((boundaryLine + "\r\n").getBytes());
            body.write(("Content-Disposition: form-data; name=\"images[]\"; filename=\"" + filename + "\"\r\n").getBytes());
            body.write(("Content-Type: application/octet-stream\r\n\r\n").getBytes());
            body.write(Files.readAllBytes(Path.of(filename)));
            body.write(("\r\n").getBytes());
        }
        body.write((boundaryLine + "--\r\n").getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.shrinkix.com/compress/batch"))
                .header("X-API-Key", "YOUR_API_KEY")
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(body.toByteArray()))
                .build();

        client.send(request, HttpResponse.BodyHandlers.ofFile(Path.of("compressed.zip")));
    }
}
```
<!-- slide -->
```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("X-API-Key", "YOUR_API_KEY");
        using var form = new MultipartFormDataContent();

        foreach (var file in new[] { "photo1.jpg", "photo2.png" })
        {
            var fs = File.OpenRead(file);
            form.Add(new StreamContent(fs), "images[]", file);
        }

        var response = await client.PostAsync("https://api.shrinkix.com/compress/batch", form);

        if (response.IsSuccessStatusCode)
        {
            var bytes = await response.Content.ReadAsByteArrayAsync();
            await File.WriteAllBytesAsync("compressed.zip", bytes);
        }
    }
}
```
````

### 3. Check Account Status

**Endpoint:** `GET https://api.shrinkix.com/check-limit`

Check your current usage and plan limits.

```json
{
  "remaining": 4950,
  "plan": "api-pro",
  "total": 5000
}
```

## Resizing

You can resize images while compressing them by providing `width` and `height`.

- **fit**: (Default) Scales the image to fit within the given dimensions while maintaining aspect ratio.
- **cover**: Scales the image to fill the stored dimensions, cropping if necessary.

```bash
curl -X POST https://api.shrinkix.com/compress \
  -F "image=@photo.jpg" \
  -F "width=150" \
  -F "height=100"
```

## Supported Formats

- **Input**: JPG, PNG, WebP, AVIF
- **Output**: JPG, PNG, WebP, AVIF
