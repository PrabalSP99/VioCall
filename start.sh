#!/bin/bash

echo "🚀 Starting Meet Video - Video Calling Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "🔧 Starting development servers..."
echo "📱 React client will be available at: http://localhost:3000"
echo "🖥️  Express server will be available at: http://localhost:5000"
echo ""

# Start the development servers
npm run dev
