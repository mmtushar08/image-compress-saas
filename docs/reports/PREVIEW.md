# 🚀 Local Preview Guide

## Quick Start (Windows)

### Option 1: Using the Script (Easiest)
```powershell
.\start-preview.ps1
```

### Option 2: Manual Start

**Terminal 1 - API Server:**
```powershell
cd api
npm start
```

**Terminal 2 - React Client:**
```powershell
cd client
npm run dev
```

Then open: **http://localhost:5173**

---

## Quick Start (Linux/Mac)

### Option 1: Using the Script
```bash
chmod +x start-preview.sh
./start-preview.sh
```

### Option 2: Manual Start

**Terminal 1 - API Server:**
```bash
cd api
npm start
```

**Terminal 2 - React Client:**
```bash
cd client
npm run dev
```

Then open: **http://localhost:5173**

---

## Prerequisites

1. **Node.js 20+** installed
2. **Docker Desktop** installed and running
3. **Docker image built:**
   ```bash
   docker build -t img-compress-engine ./engine
   ```

---

## URLs

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## Features to Test

### 1. Single Image Compression
- Drag & drop an image
- Or click to select
- See compression stats
- Download compressed image

### 2. Batch Compression
- Upload multiple images
- See "Download All as ZIP" button
- Download ZIP with all compressed images

### 3. Navigation
- **Home:** Main compression interface
- **Pricing:** View pricing plans
- **API Docs:** API documentation
- **Signup:** Register for API key
- **Dashboard:** View usage stats (after signup)

---

## Troubleshooting

### "Cannot connect to API"
- Make sure API server is running on port 5000
- Check: http://localhost:5000/api/health

### "Docker is not available"
- Start Docker Desktop
- Verify: `docker --version`
- Build image: `docker build -t img-compress-engine ./engine`

### "Port already in use"
- Stop other services using ports 5000 or 5173
- Or change ports in:
  - API: `api/.env` (PORT=5000)
  - Client: `client/vite.config.js` (server.port)

### "Module not found"
- Install dependencies:
  ```bash
  cd api && npm install
  cd ../client && npm install
  ```

---

## Stopping Servers

**Windows:**
- Close the PowerShell windows
- Or: `Get-Process -Name node | Stop-Process`

**Linux/Mac:**
- Press `Ctrl+C` in each terminal
- Or: `pkill -f "node.*server.js"` and `pkill -f "vite"`

---

## Development Tips

- **Hot Reload:** Both servers support hot reload
- **API Changes:** Restart API server
- **Client Changes:** Vite auto-reloads
- **Check Logs:** Look at terminal output for errors

