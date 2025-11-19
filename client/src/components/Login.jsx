import { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Auto-generate a username
    const generatedUsername = `User${Math.floor(Math.random() * 10000)}`;
    setUsername(generatedUsername);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login">
      <h2>Join the Chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Login;