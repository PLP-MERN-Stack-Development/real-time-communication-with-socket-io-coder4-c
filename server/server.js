// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages per room
const rooms = {
  'general': {
    users: {},
    messages: [],
    typingUsers: {}
  }
};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  let currentRoom = 'general';

  // Handle user joining a room
  socket.on('user_join', ({ username, room = 'general' }) => {
    // Leave current room if different
    if (currentRoom && currentRoom !== room) {
      socket.leave(currentRoom);
      if (rooms[currentRoom] && rooms[currentRoom].users[socket.id]) {
        delete rooms[currentRoom].users[socket.id];
        delete rooms[currentRoom].typingUsers[socket.id];
        io.to(currentRoom).emit('user_list', Object.values(rooms[currentRoom].users));
        io.to(currentRoom).emit('typing_users', Object.values(rooms[currentRoom].typingUsers));
      }
    }

    currentRoom = room;

    // Create room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = {
        users: {},
        messages: [],
        typingUsers: {}
      };
    }

    // Join the room
    socket.join(room);
    rooms[room].users[socket.id] = { username, id: socket.id };

    // Send room data to user
    socket.emit('room_joined', {
      room,
      messages: rooms[room].messages,
      users: Object.values(rooms[room].users)
    });

    // Notify others in room
    socket.to(room).emit('user_list', Object.values(rooms[room].users));
    socket.to(room).emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined room: ${room}`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    if (!rooms[currentRoom] || !rooms[currentRoom].users[socket.id]) return;

    const message = {
      ...messageData,
      id: Date.now(),
      sender: rooms[currentRoom].users[socket.id].username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
    };

    rooms[currentRoom].messages.push(message);

    // Limit stored messages to prevent memory issues
    if (rooms[currentRoom].messages.length > 100) {
      rooms[currentRoom].messages.shift();
    }

    io.to(currentRoom).emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (rooms[currentRoom] && rooms[currentRoom].users[socket.id]) {
      const username = rooms[currentRoom].users[socket.id].username;

      if (isTyping) {
        rooms[currentRoom].typingUsers[socket.id] = username;
      } else {
        delete rooms[currentRoom].typingUsers[socket.id];
      }

      io.to(currentRoom).emit('typing_users', Object.values(rooms[currentRoom].typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    if (!rooms[currentRoom] || !rooms[currentRoom].users[socket.id]) return;

    const messageData = {
      id: Date.now(),
      sender: rooms[currentRoom].users[socket.id].username,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle message reactions
  socket.on('react_message', ({ messageId, reaction }) => {
    if (!rooms[currentRoom]) return;

    const message = rooms[currentRoom].messages.find(m => m.id === messageId);
    if (message && rooms[currentRoom].users[socket.id]) {
      if (!message.reactions) message.reactions = {};
      if (!message.reactions[reaction]) message.reactions[reaction] = [];
      if (!message.reactions[reaction].includes(rooms[currentRoom].users[socket.id].username)) {
        message.reactions[reaction].push(rooms[currentRoom].users[socket.id].username);
      }
      io.to(currentRoom).emit('message_updated', message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (rooms[currentRoom] && rooms[currentRoom].users[socket.id]) {
      const { username } = rooms[currentRoom].users[socket.id];
      socket.to(currentRoom).emit('user_left', { username, id: socket.id });
      console.log(`${username} left room: ${currentRoom}`);
    }

    if (rooms[currentRoom]) {
      delete rooms[currentRoom].users[socket.id];
      delete rooms[currentRoom].typingUsers[socket.id];

      io.to(currentRoom).emit('user_list', Object.values(rooms[currentRoom].users));
      io.to(currentRoom).emit('typing_users', Object.values(rooms[currentRoom].typingUsers));
    }
  });
});

// API routes
app.get('/api/messages/:room?', (req, res) => {
  const room = req.params.room || 'general';
  res.json(rooms[room]?.messages || []);
});

app.get('/api/users/:room?', (req, res) => {
  const room = req.params.room || 'general';
  res.json(Object.values(rooms[room]?.users || {}));
});

app.get('/api/rooms', (req, res) => {
  res.json(Object.keys(rooms));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 