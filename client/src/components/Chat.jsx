import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../socket/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import TypingIndicator from './TypingIndicator';

const Chat = ({ username }) => {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    reactMessage,
  } = useSocket();

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [availableRooms, setAvailableRooms] = useState(['general']);
  const [newRoomName, setNewRoomName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connect(username, currentRoom);
    return () => disconnect();
  }, [username, currentRoom]);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show notifications for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender !== username && !lastMessage.system && document.hidden) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`New message from ${lastMessage.sender}`, {
          body: lastMessage.message,
          icon: '/vite.svg',
        });
      }
    }
  }, [messages, username]);

  const handleSendMessage = (message) => {
    if (selectedUser) {
      sendPrivateMessage(selectedUser.id, message);
    } else {
      sendMessage({ message });
    }
  };

  const handleTyping = (isTyping) => {
    setTyping(isTyping);
  };

  const handleRoomSwitch = (room) => {
    if (room !== currentRoom) {
      setCurrentRoom(room);
      // Reconnect with new room
      disconnect();
      connect(username, room);
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim() && !availableRooms.includes(newRoomName.trim())) {
      const roomName = newRoomName.trim();
      setAvailableRooms(prev => [...prev, roomName]);
      setNewRoomName('');
      handleRoomSwitch(roomName);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="messages">
          <MessageList messages={messages} currentUser={username} onReact={reactMessage} />
          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          selectedUser={selectedUser}
          onDeselectUser={() => setSelectedUser(null)}
        />
      </div>
      <div className="chat-sidebar">
        <div className="room-section">
          <h3>Current Room: {currentRoom}</h3>
          <div className="room-controls">
            <input
              type="text"
              placeholder="New room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
          </div>
          <div className="room-list">
            <h4>Available Rooms:</h4>
            {availableRooms.map(room => (
              <button
                key={room}
                className={`room-button ${currentRoom === room ? 'active' : ''}`}
                onClick={() => handleRoomSwitch(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
        <h3>Online Users ({users.length})</h3>
        <UserList
          users={users}
          currentUser={username}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default Chat;