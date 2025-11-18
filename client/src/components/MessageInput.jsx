import { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onTyping, selectedUser, onDeselectUser }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && selectedUser) {
      onDeselectUser();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  return (
    <div className="input-area">
      {selectedUser && (
        <div style={{ marginBottom: '5px', color: '#666' }}>
          Replying to {selectedUser.username} (Press Escape to cancel)
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={selectedUser ? `Private message to ${selectedUser.username}...` : "Type a message..."}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageInput;