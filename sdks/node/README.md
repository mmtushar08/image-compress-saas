# Shrinkix Node.js SDK

Official Node.js client for the [Shrinkix Image Compression API](https://shrinkix.com).

## Installation

```bash
npm install shrinkix
```

## Usage

### 1. Initialize

```javascript
const shrinkix = require('shrinkix')('YOUR_API_KEY');
```

### 2. Compress an Image

Pass a file path or a Buffer.

```javascript
try {
  // Compress to file
  await shrinkix.compress('./photo.jpg', {
    quality: 80,
    toFile: './compressed.jpg'
  });
  console.log('Done!');
} catch (err) {
  console.error(err.message);
}
```

### 3. Convert Format

Easily convert images to WebP, AVIF, PNG, or JPG.

```javascript
await shrinkix.convert('./photo.png', 'webp', {
  quality: 90,
  toFile: './photo.webp'
});
```

### 4. Check Account Status

View your remaining compression quota.

```javascript
const usage = await shrinkix.account();
console.log(`Remaining: ${usage.remaining}`);
```

## API Reference

### `compress(input, options)`
- **input**: `string` (path) or `Buffer`.
- **options**:
  - `quality`: `number` (1-100)
  - `width`: `number` (resize width)
  - `height`: `number` (resize height)
  - `format`: `string` ('webp', 'avif', etc)
  - `preserveMetadata`: `boolean` (true/false)
  - `toFile`: `string` (output path)

### `convert(input, format, options)`
Shortcut for `compress` with `format` set.

## Error Handling

The SDK throws descriptive errors for API issues:
- `ShrinkixAuthError`: Invalid API Key (401)
- `ShrinkixLimitError`: Quota Exceeded (429)
- `ShrinkixAPIError`: Other API errors

```javascript
try {
  await shrinkix.account();
} catch (err) {
    if (err.message.includes('Auth')) {
        console.log('Check your API Key!');
    }
}
```
