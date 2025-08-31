# Meet Video - Video Calling Application

A real-time video calling application built with React, Node.js, Socket.IO, and WebRTC.

## Features

- Real-time video and audio calling
- Chat functionality during calls
- Room-based video calls
- Camera and microphone controls
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meet-video
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the server**
   ```bash
   cd ../server
   npm start
   ```
   The server will run on http://localhost:5000

5. **Start the client**
   ```bash
   cd ../client
   npm start
   ```
   The client will run on http://localhost:3000

## Environment Variables

The server uses a `.env` file with the following variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Client URL for CORS

## Fixed Bugs

1. **Port Mismatch**: Fixed client configuration to connect to correct server port (5000)
2. **Missing Environment File**: Added `.env` file for server configuration
3. **WebRTC Peer Connection Issues**: Improved peer connection handling and stream management
4. **User Disconnection**: Fixed user disconnection handling to properly remove participants
5. **Production Route Handling**: Added proper production route handling for React app

## Usage

1. Open the application in your browser
2. Enter your name and room ID (or generate a new one)
3. Share the room ID with others to invite them
4. Start your video call!

## Technologies Used

- **Frontend**: React, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebRTC, Socket.IO
- **Styling**: CSS
