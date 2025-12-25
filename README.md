# SmartCompress - Image Compression SaaS

A modern image compression tool built with React and Node.js. Compress PNG, JPG, and WebP images with smart lossy compression techniques.

## Features

- 🖼️ **Multi-format Support**: PNG, JPG, and WebP compression
- 🚀 **Batch Processing**: Upload and compress multiple images at once
- 📦 **ZIP Download**: Download all compressed images as a single ZIP file
- 💎 **Premium UI**: Modern design with smooth animations
- 🔒 **Rate Limiting**: 100 compressions per day for free tier
- 📊 **Real-time Stats**: See compression savings instantly
- ⚡ **Fast Processing**: Docker-based compression engine

## Tech Stack

### Frontend
- React 18 with Vite
- Lucide React (icons)
- JSZip & FileSaver.js
- CSS3 with smooth animations

### Backend
- Node.js & Express
- Multer (file uploads)
- Docker (compression engine)
- pngquant, jpegoptim, cwebp

## Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mmtushar08/image-compress-saas.git
cd image-compress-saas
```

2. **Build the Docker image**
```bash
docker build -t img-compress-engine ./engine
```

3. **Install API dependencies**
```bash
cd api
npm install
```

4. **Install Client dependencies**
```bash
cd ../client
npm install
```

5. **Create .env file** (in `api/` directory)
```
PORT=5000
```

### Running the Application

1. **Start the API server**
```bash
cd api
npm start
```
The API will be available at `http://localhost:5000`

2. **Start the React dev server** (in a new terminal)
```bash
cd client
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Note**: Both servers must be running for the application to work properly.

## Project Structure

```
image-compress-saas/
├── api/                    # Express backend
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── server.js          # Entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── index.css      # Global styles
│   └── index.html
├── engine/                # Docker compression engine
│   ├── compress.sh        # Main compression script
│   ├── compress-png.sh    # PNG compression
│   ├── compress-jpg.sh    # JPG compression
│   └── Dockerfile
└── web/                   # Legacy vanilla HTML version
```

## API Endpoints

### `POST /api/compress`
Compress an image file

**Request:**
- `image`: File (multipart/form-data)
- `format`: Optional query param (webp|jpg|png)

**Response:**
- Compressed image file
- Headers: `X-Original-Size`, `X-Compressed-Size`, `X-Saved-Percent`

### `GET /api/check-limit`
Check remaining daily compression limit

**Response:**
```json
{
  "remaining": 95
}
```

## Pricing Tiers

- **Starter (Free)**: 100 images/day, 10MB max file size
- **Pro ($5/mo)**: Unlimited images, 25MB max, API access
- **Ultra ($15/mo)**: 100MB max, analytics, priority support

## Security Features

- ✅ Input validation & sanitization
- ✅ File type whitelist (PNG, JPG, WebP only)
- ✅ File size limits
- ✅ Rate limiting
- ✅ Command injection prevention
- ✅ CORS configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**Tushar** - [GitHub](https://github.com/mmtushar08)
