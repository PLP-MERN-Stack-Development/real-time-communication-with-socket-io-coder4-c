# Marion APP - Real-Time Chat Application with Socket.io

A fully functional real-time chat application built with Socket.io, React, and Node.js. This application demonstrates bidirectional communication between clients and server, featuring live messaging, user presence, private messaging, and advanced chat features.

## 🚀 Features

### Core Functionality
- **Real-time messaging**: Instant message delivery using Socket.io
- **Auto-join**: Automatically generates a username and connects users to the chat
- **Online user presence**: See who's online in real-time
- **Message timestamps**: All messages include sender and timestamp
- **Responsive design**: Works on both desktop and mobile devices

### Advanced Features
- **Private messaging**: Send direct messages to individual users
- **Typing indicators**: See when other users are typing
- **Message reactions**: React to messages with emojis (👍 ❤️ 😂 😮 😢)
- **Browser notifications**: Get notified of new messages when the tab is not active
- **Auto-scroll**: Messages automatically scroll to the bottom
- **Reconnection handling**: Automatic reconnection on disconnection

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Styling**: CSS3 with responsive design

## 📁 Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── UserList.jsx
│   │   ├── socket/
│   │   │   └── socket.js   # Socket.io client setup
│   │   ├── App.jsx         # Main application component
│   │   ├── App.css         # Application styles
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Node.js back-end
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd real-time-communication-with-socket-io
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   - Client: http://localhost:5173
   - Server: http://localhost:5000

## 🎯 How to Use

1. **Join the chat**: The app automatically generates a username and connects you to the chat room
2. **Send messages**: Type in the input field and press Enter
3. **Private messaging**: Click on a username in the sidebar to send private messages
4. **React to messages**: Click the reaction buttons below any message
5. **Notifications**: Grant notification permission for browser alerts

## 🔧 API Endpoints

- `GET /api/messages` - Retrieve message history
- `GET /api/users` - Get list of online users
- `GET /` - Server status

## 📡 Socket Events

### Client to Server
- `user_join` - User joins the chat
- `send_message` - Send a public message
- `private_message` - Send a private message
- `typing` - Indicate typing status
- `react_message` - React to a message

### Server to Client
- `receive_message` - New public message
- `private_message` - New private message
- `user_list` - Updated user list
- `user_joined` - User joined notification
- `user_left` - User left notification
- `typing_users` - Current typing users
- `message_updated` - Message updated (reactions)

## 🎨 Features in Detail

### Real-time Communication
- Uses Socket.io for WebSocket connections
- Automatic fallback to HTTP polling if WebSockets unavailable
- Reconnection logic with exponential backoff

### User Interface
- Clean, modern design with intuitive layout
- Message history with sender identification
- Typing indicators for better UX
- Responsive layout for mobile devices

### Advanced Features
- **Private Messaging**: Click any username to start a private conversation
- **Message Reactions**: Express yourself with emoji reactions
- **Browser Notifications**: Stay updated even when not viewing the chat
- **Typing Indicators**: See when others are composing messages

## 🔒 Security Considerations

- Input sanitization for usernames and messages
- CORS configuration for secure cross-origin requests
- No persistent data storage (messages are in-memory only)

## 🚀 Deployment

### Server Deployment
The server can be deployed to services like:
- Render
- Railway
- Heroku
- DigitalOcean App Platform

### Client Deployment
The client can be deployed to:
- Vercel
- Netlify
- GitHub Pages

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
CLIENT_URL=http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues, please check the Socket.io documentation or create an issue in the repository.

## 📝 Development Notes

This Marion APP was developed as a Week 5 assignment for real-time communication with Socket.io. The application includes:

- **Initial Setup**: Created Node.js server with Express and Socket.io, React client with Vite
- **Core Features**: Implemented real-time messaging, user presence, and basic chat functionality
- **Advanced Features**: Added private messaging, typing indicators, message reactions, and browser notifications
- **UX Improvements**: Auto-scroll, responsive design, reconnection handling
- **Auto-Join Feature**: Modified to automatically generate usernames and connect users instantly for easy access

## 🚀 Quick Start

1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Open http://localhost:5173 in multiple browser tabs to test multi-user chat

---

**Note**: This application stores messages in memory only. Messages will be lost when the server restarts. For production use, consider adding a database for message persistence.