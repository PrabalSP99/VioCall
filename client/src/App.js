import React, { useState } from 'react';
import './App.css';
import JoinRoom from './components/JoinRoom';
import VideoRoom from './components/VideoRoom';
import { SocketProvider } from './context/SocketContext';

function App() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);

  const handleJoinRoom = (roomId, username) => {
    setRoomId(roomId);
    setUsername(username);
    setIsInRoom(true);
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomId('');
    setUsername('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meet Video</h1>
        <p>High-quality video calling made simple</p>
      </header>
      
      <main>
        {!isInRoom ? (
          <JoinRoom onJoinRoom={handleJoinRoom} />
        ) : (
          <SocketProvider>
            <VideoRoom 
              roomId={roomId} 
              username={username} 
              onLeaveRoom={handleLeaveRoom} 
            />
          </SocketProvider>
        )}
      </main>
    </div>
  );
}

export default App;
