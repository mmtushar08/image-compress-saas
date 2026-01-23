# 🚀 Optimized VPS Deployment

## Quick Deploy

Deploy your latest changes to production (VPS) with one command:

```bash
npm run deploy:production
```

## What It Does

This optimized deployment script:

### ✅ Includes
- **Frontend**: Only the built `dist` folder (~500 KB - 2 MB)
- **Backend**: API code files (excluding node_modules)

### ❌ Excludes from Upload
- `client/node_modules` (~200-400 MB)
- `api/node_modules` (uses existing on server)
- Upload files
- Log files
- Output files

### 🔧 Server Actions
1. **Backs up** current frontend dist folder
2. **Extracts** new files to `/var/www/shrinkix`
3. **Removes** client/node_modules (frees up space!)
4. **Preserves** backend node_modules (keeps intact)
5. **Installs** any new backend dependencies
6. **Restarts** PM2 (backend API)
7. **Reloads** nginx (frontend)

## Deployment Flow

```
Local Machine                    VPS Server
============                     ==========

1. Build frontend               
   npm run build ─────────────>  
                                
2. Create archive               
   (dist + API files)           
   Exclude: node_modules        
                                
3. Upload archive ──────────>   Receive archive
                                
4.                              Extract files
                                
5.                              Remove client/node_modules
                                (Save 200-400 MB!)
                                
6.                              Keep api/node_modules intact
                                
7.                              Install backend deps
                                
8.                              Restart services
                                
9. Delete local archive         Delete remote archive
                                
✅ Complete!                    ✅ Live!
```

## Storage Savings

**Before Optimization:**
```
/var/www/shrinkix/
├── client/
│   ├── node_modules/   ~300 MB  ❌ Unnecessary
│   ├── dist/           ~1 MB    ✅ Needed
│   └── src/            ~2 MB
└── api/
    ├── node_modules/   ~150 MB  ✅ Needed
    └── ...
Total: ~453 MB
```

**After Optimization:**
```
/var/www/shrinkix/
├── client/
│   └── dist/           ~1 MB    ✅ Needed
└── api/
    ├── node_modules/   ~150 MB  ✅ Needed
    └── ...
Total: ~151 MB
```

**Space Saved: ~300 MB (66% reduction!)**

## Manual Deployment

If you prefer to deploy manually:

```bash
# 1. Build frontend locally
cd client
npm run build

# 2. Upload only dist folder
scp -r dist/ root@your-vps-ip:/var/www/shrinkix/client/

# 3. Upload API files (excluding node_modules)
rsync -avz --exclude 'node_modules' api/ root@your-vps-ip:/var/www/shrinkix/api/

# 4. SSH into server
ssh root@your-vps-ip

# 5. Install backend dependencies
cd /var/www/shrinkix/api
npm install --production

# 6. Restart services
pm2 restart api
systemctl reload nginx
```

## Why This Approach?

### Traditional (Bad) ❌
- Upload entire project including node_modules
- 500+ MB uploads
- Slow deployment (10+ minutes)
- Wastes server disk space

### Optimized (Good) ✅
- Upload only built files
- ~2-5 MB uploads
- Fast deployment (< 1 minute)
- Minimal server disk usage
- Professional workflow

## Troubleshooting

### "Build failed"
```bash
cd client
npm install
npm run build
```

### "Backend not starting"
SSH into server and check:
```bash
pm2 logs api
```

### "Changes not visible"
Hard refresh browser: `Ctrl + Shift + R`

## Configuration

Edit deployment config in `scripts/deploy-tool/deploy_optimized.js`:

```javascript
const config = {
    host: process.env.VPS_HOST,
    username: process.env.VPS_USER,
    password: process.env.VPS_PASSWORD  // Loaded from .env
};
```

## Best Practices

1. **Always test locally** before deploying
2. **Backup database** before major updates
3. **Check PM2 logs** after deployment
4. **Use environment variables** for sensitive config
5. **Keep backend node_modules** on server
6. **Remove frontend node_modules** to save space

---

Made with ❤️ for efficient deployments
