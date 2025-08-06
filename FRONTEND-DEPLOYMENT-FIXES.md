# Frontend Deployment Fixes for FreelanceHub

This document contains solutions for common frontend deployment issues.

## 🚨 Common Deployment Errors & Fixes

### 1. Vercel: "functions property cannot be used with builds"

**Error**: `The functions property cannot be used in conjunction with the builds property`

**Solution**: ✅ **FIXED** - Removed `functions` property from `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ]
}
```

### 2. Environment Variables Not Loading

**Error**: API calls failing, undefined environment variables

**Solutions**:
- ✅ **FIXED** - Added fallback logic in `api.js`
- ✅ **FIXED** - Created production environment file
- ✅ **FIXED** - Updated Socket.io connection logic

### 3. Build Size Too Large

**Error**: Bundle size warnings, slow loading

**Solutions**:
- ✅ **FIXED** - Added code splitting in `vite.config.js`
- ✅ **FIXED** - Increased chunk size warning limit
- ✅ **FIXED** - Optimized manual chunks

### 4. Socket.io Connection Issues

**Error**: WebSocket connection failures in production

**Solutions**:
- ✅ **FIXED** - Added transport fallbacks
- ✅ **FIXED** - Dynamic URL resolution
- ✅ **FIXED** - Increased timeout values

## 🛠️ Platform-Specific Deployment

### Vercel Deployment

#### Option 1: Full-Stack Deployment
```bash
# Use the main vercel.json
vercel --prod
```

#### Option 2: Frontend-Only Deployment
```bash
# Use vercel-frontend-only.json
cp vercel-frontend-only.json vercel.json
# Update backend URL in the file
vercel --prod
```

### Netlify Deployment

```bash
# Build and deploy
npm run build
# Upload client/dist folder to Netlify
# Or connect GitHub repository
```

### Traditional Hosting

```bash
# Build the client
cd client
npm run build

# Upload dist/ folder to your web server
# Configure web server to serve index.html for all routes
```

## 🔧 Environment Configuration

### Development (.env.local)
```bash
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

### Production
```bash
VITE_API_URL=https://your-domain.com/api
VITE_SOCKET_URL=https://your-domain.com
```

### Vercel Environment Variables
Set these in Vercel dashboard:
- `VITE_API_URL`
- `VITE_SOCKET_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 🚀 Quick Deployment Commands

### Test Build Locally
```bash
cd client
npm run build
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
cd client
npm run build
netlify deploy --prod --dir=dist
```

## 🔍 Debugging Deployment Issues

### 1. Check Build Logs
```bash
cd client
npm run build -- --verbose
```

### 2. Test Production Build Locally
```bash
cd client
npm run build
npm run preview
```

### 3. Check Network Requests
- Open browser dev tools
- Check Network tab for failed requests
- Verify API URLs are correct

### 4. Check Console Errors
- Look for JavaScript errors
- Check for missing environment variables
- Verify all imports are correct

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] All API endpoints accessible
- [ ] Socket.io connection working
- [ ] Static assets loading correctly
- [ ] Routing works for all pages
- [ ] No console errors
- [ ] Performance is acceptable

## 🆘 Emergency Fixes

### If deployment fails completely:

1. **Use frontend-only deployment**:
   ```bash
   cp vercel-frontend-only.json vercel.json
   # Update backend URL
   vercel --prod
   ```

2. **Deploy to Netlify instead**:
   ```bash
   cd client
   npm run build
   # Upload dist/ folder manually
   ```

3. **Use GitHub Pages**:
   ```bash
   # Add to package.json
   "homepage": "https://username.github.io/repo-name"
   npm run build
   # Deploy dist/ to gh-pages branch
   ```

## 📞 Support

If you encounter issues not covered here:
1. Check the main DEPLOYMENT.md guide
2. Review Vercel/Netlify documentation
3. Check browser console for errors
4. Verify environment variables
5. Test API endpoints directly
