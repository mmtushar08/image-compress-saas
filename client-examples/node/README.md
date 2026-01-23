# SmartCompress Node.js Client

Official Node.js client for the SmartCompress API.

## Installation

```bash
npm install smartcompress
```

## Usage

```javascript
const SmartCompress = require('smartcompress');

const client = new SmartCompress('YOUR_API_KEY');

async function optimize() {
    try {
        await client.fromFile('input.png', 'output.png', {
            quality: 80,
            width: 500
        });
        console.log('Done!');
    } catch (err) {
        console.error(err);
    }
}

optimize();
```
