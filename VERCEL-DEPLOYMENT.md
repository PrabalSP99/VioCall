# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel CLI**: Install Vercel CLI globally
   ```bash
   npm install -g vercel
   ```

2. **GitHub Account**: Your project should be on GitHub
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## 🔧 Project Setup

### 1. Build the Project
```bash
./build-vercel.sh
```

### 2. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

## 🚀 Deployment Steps

### Step 1: Login to Vercel
```bash
vercel login
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Configure Environment Variables
After deployment, go to your Vercel dashboard and set these environment variables:

- `NODE_ENV`: `production`
- `CLIENT_URL`: `https://your-domain.vercel.app` (replace with your actual domain)

## 📁 Project Structure for Vercel

```
meet-video/
├── vercel.json          # Vercel configuration
├── server/
│   └── index.js        # Backend API
├── client/
│   ├── build/          # Built React app
│   └── package.json    # Frontend dependencies
└── package.json        # Root dependencies
```

## 🔄 How It Works

### Routing Configuration
- `/api/*` → Backend serverless functions
- `/socket.io/*` → WebSocket connections
- `/*` → React frontend

### Build Process
1. **Frontend**: React app builds to `client/build/`
2. **Backend**: Node.js server runs as serverless functions
3. **WebSocket**: Socket.IO connections handled by backend

## 🌐 Environment Variables

### Development
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Production (Vercel)
```env
NODE_ENV=production
CLIENT_URL=https://your-domain.vercel.app
```

## 🔧 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure Socket.IO is configured for serverless
   - Check CORS settings
   - Verify environment variables

2. **Build Errors**
   - Run `npm install` in both root and client directories
   - Check for missing dependencies
   - Verify Node.js version compatibility

3. **API Routes Not Working**
   - Check `vercel.json` routing configuration
   - Ensure server/index.js exports properly
   - Verify environment variables

### Debug Commands

```bash
# Check build output
ls -la client/build/

# Test local build
npm run build

# Check Vercel configuration
vercel --debug
```

## 📊 Monitoring

### Vercel Dashboard
- **Functions**: Monitor serverless function performance
- **Analytics**: Track user engagement
- **Logs**: View real-time logs

### Performance Tips
1. **Optimize Bundle Size**: Use code splitting
2. **Caching**: Implement proper caching headers
3. **CDN**: Vercel provides global CDN automatically

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure proper CORS settings
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Validate all user inputs

## 📈 Scaling

### Automatic Scaling
- Vercel automatically scales based on traffic
- Serverless functions scale to zero when not in use
- Global CDN ensures fast loading worldwide

### Custom Domains
1. Add custom domain in Vercel dashboard
2. Update DNS records
3. Update `CLIENT_URL` environment variable

## 🎉 Success Checklist

- [ ] Project builds successfully
- [ ] Frontend accessible at your domain
- [ ] Backend API endpoints working
- [ ] WebSocket connections established
- [ ] Video calling functionality working
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Socket.IO Serverless**: Check Socket.IO documentation
- **React Deployment**: [cra.link/deployment](https://cra.link/deployment)

---

**Happy Deploying! 🚀**
