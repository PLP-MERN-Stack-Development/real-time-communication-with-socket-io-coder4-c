import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Auto-generate a username for easy joining
    const generatedUsername = `User${Math.floor(Math.random() * 10000)}`;
    setUsername(generatedUsername);
  }, []);

  return (
    <div className="App">
      {username && <Chat username={username} />}
    </div>
  );
}

export default App;