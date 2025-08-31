# Meet Video - Video Calling Application

A modern, real-time video calling application built with React, Express, Socket.IO, and WebRTC.

## Features

- 🎥 **High-quality video calling** with WebRTC
- 🎤 **Audio controls** - mute/unmute functionality
- 📹 **Video controls** - turn camera on/off
- 💬 **Real-time chat** during video calls
- 👥 **Room-based calling** - join with room IDs
- 📱 **Responsive design** - works on all devices
- 🔒 **Secure connections** with STUN servers
- ⚡ **Real-time signaling** with Socket.IO

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Socket.IO Client** - Real-time communication
- **WebRTC** - Peer-to-peer video streaming
- **CSS3** - Modern styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket server
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with camera/microphone access

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meet-video
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install all dependencies at once**
   ```bash
   npm run install-all
   ```

## Configuration

Create a `.env` file in the root directory:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
# Run both server and client concurrently
npm run dev

# Or run them separately:
npm run server    # Runs backend on port 5000
npm run client    # Runs React app on port 3000
```

### Production Mode
```bash
# Build the React app
npm run build

# Start the production server
npm start
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- Vercel CLI: `npm install -g vercel`
- Vercel account: [vercel.com](https://vercel.com)

#### Quick Deploy
```bash
# Build and deploy to Vercel
./deploy-vercel.sh

# Or manually:
./build-vercel.sh
vercel --prod
```

#### Environment Variables (Vercel Dashboard)
- `NODE_ENV`: `production`
- `CLIENT_URL`: `https://your-domain.vercel.app`

For detailed deployment instructions, see [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)

## Usage

1. **Open the application** in your browser at `http://localhost:3000`
2. **Enter your name** and a room ID (or generate one)
3. **Allow camera/microphone access** when prompted
4. **Share the room ID** with others to invite them
5. **Start your video call!**

## Project Structure

```
meet-video/
├── server/                 # Backend server
│   └── index.js           # Express server with Socket.IO
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── package.json            # Backend dependencies
└── README.md              # This file
```

## Components

- **JoinRoom** - Room entry form
- **VideoRoom** - Main video calling interface
- **VideoParticipant** - Individual participant video
- **Controls** - Video/audio controls
- **ChatPanel** - In-call chat functionality

## WebRTC Implementation

The application uses WebRTC for peer-to-peer video communication:

1. **Signaling Server** - Socket.IO handles connection establishment
2. **STUN Servers** - Google's public STUN servers for NAT traversal
3. **Peer Connections** - Direct peer-to-peer connections for video/audio
4. **Media Streams** - Local camera/microphone access and remote stream handling

## Socket.IO Events

- `join-room` - User joins a video room
- `user-joined` - New user notification
- `user-left` - User departure notification
- `offer` - WebRTC offer for connection
- `answer` - WebRTC answer for connection
- `ice-candidate` - ICE candidate exchange
- `chat-message` - Real-time chat messages

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Troubleshooting

### Camera/Microphone Access
- Ensure your browser has permission to access camera and microphone
- Check if other applications are using the camera
- Try refreshing the page and granting permissions again

### Connection Issues
- Check if the server is running on the correct port
- Verify firewall settings allow connections
- Ensure both client and server are on the same network (for local development)

### Video Quality
- WebRTC automatically adjusts quality based on network conditions
- Ensure stable internet connection for best performance
- Close other bandwidth-intensive applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.

---

**Note**: This application is for educational and development purposes. For production use, consider implementing additional security measures, TURN servers for NAT traversal, and proper user authentication.
