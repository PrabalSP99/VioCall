import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

const ChatPanel = ({ messages, onSendMessage, username }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>Chat</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.username === username ? 'own-message' : ''}`}
          >
            <div className="message-header">
              <span className="message-username">{msg.username}</span>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
