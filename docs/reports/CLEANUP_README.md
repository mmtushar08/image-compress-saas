# Server Cleanup - Quick Reference

## 🎯 Quick Stats

**Before Cleanup:** 255MB  
**After Cleanup:** 87MB  
**Saved:** 168MB (66% reduction) ✅

---

## 🧹 What Was Removed

| Item | Size | Impact |
|------|------|--------|
| `client/node_modules/` | 169MB | ✅ None - Build deps only |
| Old archives | ~200KB | ✅ None - Can recreate |
| Source maps | ~5MB | ✅ None - Debug files |
| Old temp files | Varies | ✅ None - Already processed |

---

## ✅ What Was Kept (Important!)

- ✅ `api/node_modules/` (86MB) - **API requires this**
- ✅ `client/dist/` (900KB) - **Frontend build**
- ✅ `api/data/users.json` - **User database**
- ✅ `api/.env` - **Configuration**
- ✅ All server code

---

## 🚀 How to Run Cleanup

### Automatic (Recommended)
```bash
cd scripts/deploy-tool
node cleanup_server.js
```

### Manual
```bash
ssh root@62.72.57.16
cd /root/app
rm -rf client/node_modules
rm -f deploy.tar.gz
find api/uploads -type f -mtime +1 -delete
find api/output -type f -mtime +1 -delete
```

---

## 📋 Verification

After cleanup, test:
1. ✅ Website: https://shrinkix.com
2. ✅ API: https://shrinkix.com/api/shrink
3. ✅ Upload & compress an image
4. ✅ Check PM2: `pm2 status`

---

## 🔄 Maintenance

### Monthly Cleanup
```bash
node cleanup_server.js
```

### Auto-Cleanup (Cron)
```bash
# Add to server crontab
0 3 * * * find /root/app/api/uploads -type f -mtime +1 -delete
0 3 * * * find /root/app/api/output -type f -mtime +1 -delete
```

---

## 📊 Disk Usage Monitoring

```bash
# Check total size
du -sh /root/app

# Check by directory
du -sh /root/app/*

# Find large files
find /root/app -type f -size +10M
```

---

## 🆘 If Something Breaks

### Rebuild Frontend
```bash
cd /root/app/client
npm install
npm run build
```

### Full Redeploy
```bash
# From local machine
cd scripts/deploy-tool
node deploy_smart_v2.js
```

---

## 📝 Files

- **Documentation:** `SERVER_CLEANUP.md` (detailed)
- **Cleanup Script:** `scripts/deploy-tool/cleanup_server.js`
- **Analysis Script:** `scripts/deploy-tool/analyze_server.js`
- **This File:** `CLEANUP_README.md` (quick reference)

---

**Last Cleanup:** January 10, 2026  
**Status:** ✅ Successful  
**Savings:** 168MB (66%)
