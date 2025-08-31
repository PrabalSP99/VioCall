#!/bin/bash

echo "🚀 Building project for Vercel deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd client && npm install && cd ..

# Build the React frontend
echo "🔨 Building React frontend..."
cd client
npm run build
cd ..

# Create production environment file
echo "⚙️ Creating production environment..."
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
CLIENT_URL=https://meet-video-umber.vercel.app
EOF

# Create client production environment file
echo "⚙️ Creating client production environment..."
cat > client/.env.production << EOF
REACT_APP_SERVER_URL=https://meet-video-umber.vercel.app
REACT_APP_ENV=production
NODE_ENV=production
EOF

echo "✅ Build completed successfully!"
echo "📁 Build artifacts:"
echo "   - Frontend: client/build/"
echo "   - Backend: server/"
echo "   - Config: vercel.json"
echo ""
echo "🚀 Ready to deploy to Vercel!"
echo "   Run: vercel --prod"





