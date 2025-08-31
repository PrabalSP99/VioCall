import React from 'react';
import './Controls.css';

const Controls = ({
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onToggleChat,
  onLeaveRoom,
  isChatOpen
}) => {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button
          onClick={onToggleVideo}
          className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
          title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
        >
          {isVideoEnabled ? '📹' : '🚫'}
        </button>

        <button
          onClick={onToggleAudio}
          className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? '🎤' : '🔇'}
        </button>

        <button
          onClick={onToggleChat}
          className={`control-btn ${isChatOpen ? 'active' : ''}`}
          title={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          💬
        </button>

        <button
          onClick={onLeaveRoom}
          className="control-btn leave-btn"
          title="Leave room"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default Controls;
