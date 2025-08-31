import React, { useState } from 'react';
import './JoinRoom.css';

const JoinRoom = ({ onJoinRoom }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [errors, setErrors] = useState({});

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!roomId.trim()) {
      newErrors.roomId = 'Room ID is required';
    }

    if (Object.keys(newErrors).length === 0) {
      onJoinRoom(roomId.trim(), username.trim());
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="join-room">
      <div className="join-room-card">
        <h2>Join a Video Call</h2>
        <p>Enter your details to start or join a video call</p>
        
        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="username">Your Name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="roomId">Room ID</label>
            <div className="room-id-input">
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className={errors.roomId ? 'error' : ''}
              />
              <button 
                type="button" 
                onClick={generateRoomId}
                className="generate-btn"
              >
                Generate
              </button>
            </div>
            {errors.roomId && <span className="error-text">{errors.roomId}</span>}
          </div>

          <button type="submit" className="join-btn">
            Join Room
          </button>
        </form>

        <div className="join-info">
          <h3>How it works:</h3>
          <ol>
            <li>Enter your name</li>
            <li>Enter a room ID or generate a new one</li>
            <li>Share the room ID with others to invite them</li>
            <li>Start your video call!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
