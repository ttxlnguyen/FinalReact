import React, { useState, useEffect } from 'react';
import './App.css';
// Import components
import Sidebar from './components/Sidebar';
import Channels from './Channels/Channels';
import Messages from './Messages/Messages';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Login from './components/Login';
// Import custom hook and auth functions
import useAppData from './hooks/useAppData';
import { isAuthenticated, logout } from './services/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  // Use custom hook to manage app data
  const {
    channels,
    messages,
    loading,
    error,
    selectChannel,
    selectedChannelId
  } = useAppData();

  // Local state
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  // Toggle functions for sidebar items
  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsMessagesOpen(false);
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
  };

  // Function to handle channel selection
  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
  };

  // Function to handle direct message selection
  const handleDirectMessageSelect = (message) => {
    // TODO: Implement direct message selection
    console.log('Selected message:', message);
    setIsMessagesOpen(false);
  };

  // Function to handle input change in the message input field
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Function to handle message submission
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      // TODO: Implement actual message sending logic when backend is ready
      console.log('Sending message:', inputMessage);
      setInputMessage('');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <Sidebar
        toggleChannelList={toggleChannelList}
        toggleMessages={toggleMessages}
      />

      <button onClick={handleLogout}>Logout</button>

      {isChannelListOpen && <Channels channels={channels} handleChannelSelect={handleChannelSelect} />}
      {isMessagesOpen && <Messages handleDirectMessageSelect={handleDirectMessageSelect} />}

      <div className="main-content">
        <header className="main-header">
          <h1>{selectedChannelId ? `# ${channels.find(c => c.id === selectedChannelId)?.name}` : 'Select a channel'}</h1>
          <p>{selectedChannelId ? 'Channel chat' : 'Please select a channel to start chatting'}</p>
        </header>
        
        {selectedChannelId && (
          <>
            <MessageList
              messages={messages}
            />
            
            <MessageInput
              inputMessage={inputMessage}
              handleInputChange={handleInputChange}
              handleMessageSubmit={handleMessageSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
