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
  
  const localVideoRef = useRef();
  const peerConnectionsRef = useRef(new Map());

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

  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]); // Add localStream dependency for cleanup

  // Join room when socket is connected
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join-room', roomId, Date.now().toString(), username);
      
      // Listen for room participants
      socket.on('room-participants', (participants) => {
        setParticipants(participants);
        participants.forEach(participant => {
          createPeerConnection(participant.socketId);
        });
      });

      // Listen for new user joining
      socket.on('user-joined', (user) => {
        setParticipants(prev => [...prev, user]);
        createPeerConnection(user.socketId);
      });

      // Listen for user leaving
      socket.on('user-left', (user) => {
        setParticipants(prev => prev.filter(p => p.userId !== user.userId));
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

    // Add local stream tracks
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
        socket.emit('ice-candidate', {
          target: peerId,
          candidate: event.candidate
        });
      }
    };

    peerConnectionsRef.current.set(peerId, pc);

    // Create and send offer if we're the initiator
    if (participants.length > 0) {
      createOffer(pc, peerId);
    }
  }, [localStream, participants.length, socket, createOffer]);



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
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
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

  return (
    <div className="video-room">
      <div className="room-header">
        <h2>Room: {roomId}</h2>
        <p>Participants: {participants.length + 1}</p>
      </div>

      <div className="video-container">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
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
