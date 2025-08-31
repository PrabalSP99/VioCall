# 🚀 Deployment Guide

## Recommended Architecture

- **Frontend**: Vercel (React app)
- **Backend**: Railway/Render (Express + Socket.IO)

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free tier available)
- Git installed locally

## 🎯 Step-by-Step Deployment

### 1. Frontend Deployment (Vercel)

#### Option A: Deploy via Vercel Dashboard
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `client`
   - Add environment variable:
     - `REACT_APP_SERVER_URL`: `https://your-backend-url.railway.app`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app.vercel.app`

#### Option B: Deploy via CLI
```bash
cd client
npm install -g vercel
vercel
```

### 2. Backend Deployment (Railway)

#### Option A: Deploy via Railway Dashboard
1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"

2. **Configure Project**
   - Select your repository
   - Set root directory to `/` (root of project)
   - Add environment variables:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend-url.vercel.app
     PORT=5000
     ```

3. **Deploy**
   - Railway will automatically detect Node.js and deploy
   - Your backend will be available at `https://your-app.railway.app`

#### Option B: Deploy via CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 3. Backend Deployment (Render - Alternative)

If you prefer Render over Railway:

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `meet-video-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables as above

## 🔧 Environment Variables

### Frontend (Vercel)
```
REACT_APP_SERVER_URL=https://your-backend-url.railway.app
```

### Backend (Railway/Render)
```
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
```

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. **Frontend**: Add custom domain in Vercel dashboard
2. **Backend**: Add custom domain in Railway/Render dashboard
3. **Update environment variables** with new URLs

## 🔍 Testing Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit `https://your-backend-url.railway.app/api/health`
3. **Test Video Call**: Open app in two browser tabs/windows

## 🚨 Important Notes

### CORS Configuration
The backend is already configured to accept requests from any origin in development. For production, update the CORS configuration in `server/index.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://your-frontend-url.vercel.app",
    methods: ["GET", "POST"]
  }
});
```

### WebRTC Considerations
- **STUN servers**: Using Google's public STUN servers
- **TURN servers**: Consider adding TURN servers for production
- **HTTPS**: Required for WebRTC in production

## 🔧 Troubleshooting

### Common Issues

**Frontend can't connect to backend:**
- Check `REACT_APP_SERVER_URL` environment variable
- Verify backend is running and accessible
- Check CORS configuration

**WebRTC not working:**
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify camera/microphone permissions

**Socket.IO connection issues:**
- Check backend logs for errors
- Verify environment variables
- Check network connectivity

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.railway.app/api/health

# Check frontend build
cd client && npm run build

# Test locally with production backend
REACT_APP_SERVER_URL=https://your-backend-url.railway.app npm start
```

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics for frontend
- Performance monitoring
- Error tracking

### Railway/Render Monitoring
- Application logs
- Performance metrics
- Error tracking

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:
- **Vercel**: Deploys on every push to main branch
- **Railway**: Deploys on every push to main branch

## 💰 Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Railway**: $5/month for 500 hours, 1GB RAM
- **Render**: Free tier with limitations

### Production Scaling
- **Vercel Pro**: $20/month for advanced features
- **Railway**: Pay-as-you-go pricing
- **Render**: $7/month for standard instances

## 🎉 Success!

Once deployed, your video calling app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

Share the frontend URL with users to start video calling!
