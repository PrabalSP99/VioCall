import React from 'react';
import './VideoParticipant.css';

const VideoParticipant = ({ participant, peerId }) => {
  return (
    <div className="video-participant">
      <video
        id={`video-${peerId}`}
        autoPlay
        playsInline
        className="video-element"
        onError={(e) => {
          console.error('Video error for participant:', participant.username, e);
        }}
      />
      <div className="video-label">{participant.username}</div>
    </div>
  );
};

export default VideoParticipant;
