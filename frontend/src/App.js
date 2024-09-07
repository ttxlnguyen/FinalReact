import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.js';
import Channels from './components/channels/Channels.js';
import Messages from './components/messages/Messages.js';
import MessageList from './components/MessageList';
import Typingbar from './components/typingbar/Typingbar.js';
import Login from './components/loginpage/Login.jsx';
import useAppData from './hooks/useAppData';
import { checkAuthStatus, logout } from './services/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { 
    publicChannels,
    privateChannels,
    messages,
    setMessages, 
    loading, 
    error, 
    selectChannel, 
    selectedChannelId,
    setSelectedChannelId, 
    sendMessage, 
    fetchMessages,
    fetchPublicChannels,
    fetchPrivateChannels
  } = useAppData(isLoggedIn);

  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      console.log('Auth status on app load:', authStatus);
      setIsLoggedIn(authStatus.isAuthenticated);
      setCurrentUser(authStatus.currentUser);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser && currentUser.username) {
      fetchPublicChannels(currentUser.username);
      fetchPrivateChannels(currentUser.username);
    }
  }, [isLoggedIn, currentUser, fetchPublicChannels, fetchPrivateChannels]);

  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsMessagesOpen(false);
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
   // setSelectedChannelId(null); // UNCOMMENT IF BREAKS
  };

  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
    setIsMessagesOpen(false);
    if (isLoggedIn) {
      fetchMessages(channelId);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && isLoggedIn) {
      console.log('Sending message:', inputMessage);
      await sendMessage(inputMessage, selectedChannelId);
      setInputMessage('');
      if (selectedChannelId) {
        console.log('Channel selected:', selectedChannelId);
        fetchMessages(selectedChannelId);
      } else {
        fetchMessages();
      }
    }
  };

  const handleLoginSuccess = async () => {
    const authStatus = await checkAuthStatus();
    console.log('Auth status after login:', authStatus);
    setIsLoggedIn(authStatus.isAuthenticated);
    setCurrentUser(authStatus.currentUser);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
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
        onLogout={handleLogout}
        user={currentUser}
      />

      {isChannelListOpen && (
        <Channels 
          publicChannels={publicChannels}
          handleChannelSelect={handleChannelSelect}
        />
      )}

      {isMessagesOpen && (
        <Messages 
          privateChannels={privateChannels}
          handleChannelSelect={handleChannelSelect}
        />
      )}

      <div className="main-content">
        <header className="main-header">
          <h1>
            {selectedChannelId 
              ? `${privateChannels.find(c => c.id === selectedChannelId) ? '@' : '#'} ${
                  publicChannels.find(c => c.id === selectedChannelId)?.name || 
                  privateChannels.find(c => c.id === selectedChannelId)?.name
                }`
              : 'Select a channel'
            }
          </h1>
        </header>
        
        <MessageList 
          messages={messages}
          selectedChannelId={selectedChannelId}
        />
        <Typingbar
          inputMessage={inputMessage}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
        />
      </div>
    </div>
  );
}

export default App;
