import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import VideoParticipant from './VideoParticipant';
import ChatPanel from './ChatPanel';
import Controls from './Controls';
import './VideoRoom.css';

const VideoRoom = ({ roomId, username, onLeaveRoom }) => {
  const { socket, isConnected } = useSocket();
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connectionLost, setConnectionLost] = useState(false);
  const [showMediaStoppedNotification, setShowMediaStoppedNotification] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  
  const localVideoRef = useRef();
  const peerConnectionsRef = useRef(new Map());

  // Cleanup function to stop all media tracks
  const cleanupMediaTracks = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped media track:', track.kind);
      });
      setLocalStream(null);
      
      // Show notification that media access was stopped
      setShowMediaStoppedNotification(true);
      setTimeout(() => setShowMediaStoppedNotification(false), 5000); // Hide after 5 seconds
    }
    
    // Clear video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => {
      pc.close();
      console.log('Closed peer connection');
    });
    peerConnectionsRef.current.clear();
    
    console.log('Media tracks and peer connections cleaned up');
  }, [localStream]);

  // Retry media access
  const retryMediaAccess = useCallback(async () => {
    try {
      setIsLoadingMedia(true);
      setMediaError(null);
      console.log('Retrying media access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log('Media stream obtained on retry:', stream.getTracks().map(t => t.kind));
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsLoadingMedia(false);
    } catch (error) {
      console.error('Error retrying media access:', error);
      setMediaError(error.message);
      setIsLoadingMedia(false);
    }
  }, []);

  // Handle connection loss
  useEffect(() => {
    if (!isConnected && socket) {
      setConnectionLost(true);
      cleanupMediaTracks();
      setParticipants([]);
      setMessages([]);
    } else if (isConnected && connectionLost) {
      setConnectionLost(false);
    }
  }, [isConnected, socket, connectionLost, cleanupMediaTracks]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupMediaTracks();
    };
  }, [cleanupMediaTracks]);

  // Ensure video element gets stream when localStream changes
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log('Video element updated with stream');
    }
  }, [localStream]);

  // Define functions with useCallback to avoid dependency issues
  const createOffer = useCallback(async (pc, peerId) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit('offer', {
        target: peerId,
        offer: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [socket]);

  const handleOffer = useCallback(async (data) => {
    const pc = peerConnectionsRef.current.get(data.from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit('answer', {
          target: data.from,
          answer: answer
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    }
  }, [socket]);

  const handleAnswer = useCallback(async (data) => {
    const pc = peerConnectionsRef.current.get(data.from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  const handleIceCandidate = useCallback(async (data) => {
    const pc = peerConnectionsRef.current.get(data.from);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  const removePeerConnection = useCallback((peerId) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(peerId);
    }
  }, []);

  // Initialize local media stream only after joining room
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        setIsLoadingMedia(true);
        setMediaError(null);
        console.log('Requesting media permissions...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log('Media stream obtained:', stream.getTracks().map(t => t.kind));
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsLoadingMedia(false);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setMediaError(error.message);
        setIsLoadingMedia(false);
        alert('Unable to access camera/microphone. Please check permissions and try again.');
      }
    };

    // Only initialize media when connected and in room
    if (isConnected && socket) {
      initializeMedia();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isConnected, socket]); // Depend on connection status

  // Handle peer connections when localStream becomes available
  useEffect(() => {
    if (localStream && participants.length > 0) {
      console.log('Creating peer connections for existing participants:', participants.length);
      participants.forEach(participant => {
        // Only create if we don't already have a connection
        if (!peerConnectionsRef.current.has(participant.socketId)) {
          createPeerConnection(participant.socketId);
        }
      });
    }
  }, [localStream, participants, createOffer]);

  // Join room when socket is connected
  useEffect(() => {
    if (socket && isConnected) {
      console.log('Joining room:', roomId);
      socket.emit('join-room', roomId, Date.now().toString(), username);
      
      // Listen for room participants
      socket.on('room-participants', (participants) => {
        console.log('Room participants received:', participants);
        setParticipants(participants);
        // Don't create peer connections here - wait for localStream
      });

      // Listen for new user joining
      socket.on('user-joined', (user) => {
        console.log('User joined:', user);
        setParticipants(prev => [...prev, user]);
        // Only create peer connection if we have localStream
        if (localStream) {
          createPeerConnection(user.socketId);
        }
      });

      // Listen for user leaving
      socket.on('user-left', (user) => {
        console.log('User left:', user);
        setParticipants(prev => prev.filter(p => p.socketId !== user.socketId));
        removePeerConnection(user.socketId);
      });

      // WebRTC signaling
      socket.on('offer', handleOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidate);

      // Chat messages
      socket.on('chat-message', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('room-participants');
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
        socket.off('chat-message');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, roomId, username, handleOffer, handleAnswer, handleIceCandidate]);

  const createPeerConnection = useCallback((peerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks if available
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      const peerVideo = document.getElementById(`video-${peerId}`);
      if (peerVideo) {
        peerVideo.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', {
          target: peerId,
          candidate: event.candidate
        });
      }
    };

    peerConnectionsRef.current.set(peerId, pc);

    // Create and send offer if we have a local stream
    if (localStream) {
      createOffer(pc, peerId);
    }
  }, [localStream, socket, createOffer]);



  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('chat-message', {
        roomId,
        message: message.trim(),
        username
      });
      setMessages(prev => [...prev, {
        message: message.trim(),
        username,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleLeaveRoom = () => {
    cleanupMediaTracks();
    onLeaveRoom();
  };

  if (!isConnected) {
    return (
      <div className="video-room">
        <div className="connection-status">
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (connectionLost) {
    return (
      <div className="video-room">
        <div className="connection-status">
          <h3>Connection Lost</h3>
          <p>Your connection to the server has been lost. Camera and microphone access has been stopped for privacy.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="reconnect-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingMedia) {
    return (
      <div className="video-room">
        <div className="connection-status">
          <h3>Setting Up Media</h3>
          <p>Please allow camera and microphone access when prompted...</p>
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #667eea', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (mediaError) {
    return (
      <div className="video-room">
        <div className="connection-status">
          <h3>Media Access Error</h3>
          <p>Unable to access camera/microphone: {mediaError}</p>
          <p>Please check your browser permissions and try again.</p>
          <button 
            onClick={retryMediaAccess} 
            className="reconnect-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-room">
      {showMediaStoppedNotification && (
        <div 
          className="media-notification"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#ff9800',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <strong>🔒 Media Access Stopped</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Camera and microphone access has been stopped due to connection loss.
          </p>
        </div>
      )}
      
      <div className="room-header">
        <h2>Room: {roomId}</h2>
        <div className="room-info">
          <p>Participants: {participants.length + 1}</p>
          <div className="connection-indicator">
            <span 
              className="connection-dot"
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4CAF50' : '#f44336',
                marginRight: '8px'
              }}
            ></span>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        {/* Debug info */}
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#666', 
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '4px'
        }}>
          Debug: Stream: {localStream ? '✅' : '❌'} | 
          Video Ref: {localVideoRef.current ? '✅' : '❌'} | 
          Loading: {isLoadingMedia ? '🔄' : '✅'}
          {!localStream && (
            <button 
              onClick={retryMediaAccess}
              style={{
                marginLeft: '1rem',
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Refresh Camera
            </button>
          )}
        </div>
      </div>

      <div className="video-container">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              backgroundColor: '#1a1a1a'
            }}
          />
          {!localStream && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
              <div>Camera not available</div>
            </div>
          )}
          <div className="video-label">You ({username})</div>
        </div>

        {participants.map((participant) => (
          <VideoParticipant
            key={participant.socketId}
            participant={participant}
            peerId={participant.socketId}
          />
        ))}
      </div>

      <Controls
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onLeaveRoom={handleLeaveRoom}
        isChatOpen={isChatOpen}
      />

      {isChatOpen && (
        <ChatPanel
          messages={messages}
          onSendMessage={sendMessage}
          username={username}
        />
      )}
    </div>
  );
};

export default VideoRoom;
