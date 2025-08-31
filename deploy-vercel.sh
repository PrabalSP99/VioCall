#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
./build-vercel.sh

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Set environment variables:"
echo "   - NODE_ENV: production"
echo "   - CLIENT_URL: https://your-domain.vercel.app"
echo "3. Test your video calling app"
echo ""
echo "🎉 Your app is now live on Vercel!"
