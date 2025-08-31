

# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Prerequisites
- **Node.js v16+** installed on your system
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Camera and microphone** access

### 2. Quick Start
```bash
# Option 1: Use the start script (recommended)
./start.sh

# Option 2: Manual start
npm run install-all
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 How to Use

1. **Open** http://localhost:3000 in your browser
2. **Enter** your name and room ID (or generate one)
3. **Allow** camera/microphone access when prompted
4. **Share** the room ID with others to invite them
5. **Start** your video call!

## 🧪 Test Your Setup

Open `test-webrtc.html` in your browser to verify:
- WebRTC compatibility
- Camera access
- Server connection

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes using ports 3000/5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Camera not working:**
- Check browser permissions
- Ensure no other apps are using camera
- Try refreshing the page

**Connection issues:**
- Verify both servers are running
- Check firewall settings
- Ensure you're on the same network

### Development Commands

```bash
# Start both servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

## 📁 Project Structure

```
meet-video/
├── server/                 # Express backend
│   └── index.js           # Main server file
├── client/                 # React frontend
│   ├── src/components/    # React components
│   ├── src/context/       # Socket.IO context
│   └── public/            # Static files
├── start.sh               # Quick start script
├── test-webrtc.html       # WebRTC test page
└── README.md              # Full documentation
```

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 📞 Features

- 🎥 High-quality video calling
- 🎤 Audio controls (mute/unmute)
- 📹 Video controls (on/off)
- 💬 Real-time chat
- 👥 Room-based calling
- 📱 Responsive design
- 🔒 Secure WebRTC connections

## 🚨 Important Notes

- **Development only**: This is for learning/development
- **Local network**: Works best on same network
- **STUN servers**: Uses Google's public STUN servers
- **No TURN**: May not work through strict firewalls

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Check browser console for errors
4. Ensure ports 3000 and 5000 are free
5. Open an issue on GitHub

---

**Happy Video Calling! 🎉**
