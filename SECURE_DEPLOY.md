# 🔒 Secure Deployment Guide

## ⚠️ Critical Security Notice
**Issue:** Previous deployment scripts contained hardcoded credentials which were exposed in the public repository.
**Fix:** Credentials have been moved to a local `.env` file that is excluded from git.
**Action Required:** You MUST change your VPS password immediately if you haven't already.

## 1. Setup Secure Configuration
1. Go to the `api` directory:
   ```bash
   cd api
   ```
2. Create/Edit your `.env` file (this file is git-ignored):
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your **NEW** secure credentials:
   ```env
   VPS_HOST=62.72.57.16
   VPS_USER=root
   VPS_PASSWORD=your_new_password  <-- UPDATE THIS!
   ```

## 2. Deploy Securely
Run the optimized deployment script (now secure):
```bash
node scripts/deploy-tool/deploy_optimized.js
```

## 3. Post-Deployment Checks
- Verify the site is running: `https://shrinkix.com`
- Check API health: `https://api.shrinkix.com/health`
