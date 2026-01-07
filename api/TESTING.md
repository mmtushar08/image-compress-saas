# Testing Guide

## Quick Test Methods

### Method 1: Using the Test Script (Easiest)

1. **Start the API server:**
   ```bash
   cd api
   npm start
   ```

2. **In another terminal, run the test:**
   ```bash
   cd api
   node test-batch.js
   ```

### Method 2: Using cURL

**Single Image Compression:**
```bash
curl -X POST http://localhost:5000/api/compress \
  -F "image=@path/to/your/image.png" \
  --output compressed.png \
  -v
```

**Batch Compression (Multiple Images):**
```bash
curl -X POST http://localhost:5000/api/compress/batch \
  -F "images[]=@image1.png" \
  -F "images[]=@image2.jpg" \
  -F "images[]=@image3.webp" \
  --output compressed-images.zip \
  -v
```

### Method 3: Using Postman

1. **Open Postman**
2. **Create a new request:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/compress/batch`
3. **Go to Body tab:**
   - Select `form-data`
   - Add key: `images[]` (type: File)
   - Click "Select Files" and choose multiple images
   - Add more files by clicking "Add Row" and using the same key `images[]`
4. **Click Send**
5. **Save Response:**
   - Click "Save Response" → "Save to a file"
   - Save as `.zip` file

### Method 4: Using Browser (GET endpoints only)

**Health Check:**
```
http://localhost:5000/api/health
```

**Check Rate Limit:**
```
http://localhost:5000/api/check-limit
```

**Batch Endpoint Info (GET):**
```
http://localhost:5000/api/compress/batch
```
(Shows helpful error message with usage instructions)

### Method 5: Using JavaScript/Fetch

```javascript
// Single Image
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/compress', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const originalSize = response.headers.get('X-Original-Size');
const compressedSize = response.headers.get('X-Compressed-Size');
const savedPercent = response.headers.get('X-Saved-Percent');

console.log(`Saved ${savedPercent}%`);
// Download the blob
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'compressed.png';
a.click();
```

```javascript
// Batch Compression
const formData = new FormData();
formData.append('images[]', file1);
formData.append('images[]', file2);
formData.append('images[]', file3);

const response = await fetch('http://localhost:5000/api/compress/batch', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const totalFiles = response.headers.get('X-Total-Files');

console.log(`Compressed ${totalFiles} files`);
// Download ZIP
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'compressed-images.zip';
a.click();
```

## Expected Responses

### Single Compression Success:
- **Status:** 200 OK
- **Headers:**
  - `X-Original-Size`: Original file size in bytes
  - `X-Compressed-Size`: Compressed file size in bytes
  - `X-Saved-Percent`: Percentage saved (e.g., "49.64")
  - `X-Compression-Ratio`: Same as saved percent
  - `X-Output-Format`: Output format (png, jpg, webp)
- **Body:** Binary image file

### Batch Compression Success:
- **Status:** 200 OK
- **Content-Type:** `application/zip`
- **Headers:**
  - `X-Total-Files`: Number of files compressed
  - `X-Total-Original-Size`: Total original size in bytes
  - `X-Total-Compressed-Size`: Total compressed size in bytes
- **Body:** ZIP file containing compressed images

### Error Responses:
- **400 Bad Request:** Invalid file type or no files uploaded
- **413 Payload Too Large:** File exceeds size limit (50MB)
- **429 Too Many Requests:** Daily limit reached (20/day for free tier)
- **500 Internal Server Error:** Compression failed

## Test Images

Test images are available in:
```
engine/test-images/
  - footer_logo.png
  - footer_logo.min.png
  - DSLR.JPG
  - DSLR.min.jpg
```

## Troubleshooting

**"Cannot connect to server":**
- Make sure the API server is running: `cd api && npm start`
- Check if port 5000 is available
- Verify server is listening: `http://localhost:5000/api/health`

**"Docker is not available":**
- Install Docker Desktop
- Make sure Docker is running
- Build the image: `docker build -t img-compress-engine ./engine`

**"Docker image not found":**
- Build the image: `docker build -t img-compress-engine ./engine`

**"Daily limit reached":**
- Wait until next day (resets at midnight UTC)
- Or use a Pro API key

