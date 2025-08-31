#!/bin/bash

echo "🏗️  Building Meet Video for Production"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the React app
echo "📦 Building React frontend..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "✅ Frontend built successfully"

# Check if build directory exists
if [ ! -d "client/build" ]; then
    echo "❌ Error: Build directory not found"
    exit 1
fi

# Create production environment file
echo "🔧 Creating production environment file..."
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
EOF

echo "✅ Production environment file created"

# Test the production build
echo "🧪 Testing production build..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test the health endpoint
curl -f http://localhost:5000/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    kill $SERVER_PID
    exit 1
fi

# Stop the test server
kill $SERVER_PID

echo ""
echo "🎉 Production build completed successfully!"
echo ""
echo "📁 Files ready for deployment:"
echo "   - Frontend: client/build/"
echo "   - Backend: server/"
echo "   - Config: .env.production"
echo ""
echo "🚀 Next steps:"
echo "   1. Deploy frontend to Vercel"
echo "   2. Deploy backend to Railway/Render"
echo "   3. Update environment variables"
echo "   4. Test the deployed application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
