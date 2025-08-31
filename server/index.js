const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Store active rooms and users
const rooms = new Map();
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('join-room', (roomId, userId, username) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    rooms.get(roomId).add(socket.id);
    users.set(socket.id, { roomId, userId, username });
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, username, socketId: socket.id });
    
    // Send current room participants to the new user
    const participants = Array.from(rooms.get(roomId))
      .filter(id => id !== socket.id)
      .map(id => users.get(id));
    
    socket.emit('room-participants', participants);
    
    console.log(`User ${username} joined room ${roomId}`);
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const roomId = user.roomId;
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        
        // Remove room if empty
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        } else {
          // Notify others that user left
          socket.to(roomId).emit('user-left', { userId: user.userId, username: user.username, socketId: socket.id });
        }
      }
      users.delete(socket.id);
      console.log(`User ${user.username} disconnected from room ${roomId}`);
    }
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    socket.to(data.roomId).emit('chat-message', {
      message: data.message,
      username: data.username,
      timestamp: new Date().toISOString()
    });
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Video calling server is running' });
});

app.get('/api/rooms/:roomId/participants', (req, res) => {
  const { roomId } = req.params;
  if (rooms.has(roomId)) {
    const participants = Array.from(rooms.get(roomId)).map(id => users.get(id));
    res.json({ participants });
  } else {
    res.json({ participants: [] });
  }
});

// Serve React app for all other routes (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Video calling server is running' });
  });
}


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
