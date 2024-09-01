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
    users,
    loading,
    error,
    selectChannel,
    selectedChannelId,
    setSelectedChannelId,
    sendMessage,
    fetchMessages
  } = useAppData();

  // Local state
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
    }
  }, [isLoggedIn, fetchMessages]);

  // Toggle functions for sidebar items
  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsMessagesOpen(false);
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
    setSelectedChannelId(null);
    setSelectedUserId(null);
    fetchMessages();
  };

  // Function to handle channel selection
  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
    setSelectedUserId(null);
  };

  // Function to handle user selection for direct messages
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setSelectedChannelId(null);
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
      if (selectedChannelId) {
        sendMessage(selectedChannelId, inputMessage);
      } else if (selectedUserId) {
        // TODO: Implement sending direct messages
        console.log('Sending direct message to user:', selectedUserId, 'Message:', inputMessage);
      }
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

  const currentUser = users.find(user => user.id === isAuthenticated());

  return (
    <div className="App">
      <Sidebar
        toggleChannelList={toggleChannelList}
        toggleMessages={toggleMessages}
      />

      <button onClick={handleLogout}>Logout</button>

      {isChannelListOpen && <Channels channels={channels} handleChannelSelect={handleChannelSelect} />}
      {isMessagesOpen && <Messages messages={messages} currentUser={currentUser} onSelectUser={handleUserSelect} />}

      <div className="main-content">
        <header className="main-header">
          <h1>
            {selectedChannelId 
              ? `# ${channels.find(c => c.id === selectedChannelId)?.name}`
              : selectedUserId
                ? `Chat with ${users.find(u => u.id === selectedUserId)?.username}`
                : 'Select a channel or user'
            }
          </h1>
        </header>
        
        <MessageList 
          messages={messages} 
          currentUser={currentUser}
          selectedUser={users.find(u => u.id === selectedUserId)}
        />
        
        <MessageInput
          inputMessage={inputMessage}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
        />
      </div>
    </div>
  );
}

export default App;
