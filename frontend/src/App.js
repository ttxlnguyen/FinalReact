import React, { useState, useEffect } from 'react';
import AppJSX from './App.jsx';
import useAppData from './hooks/useAppData';
import { checkAuthStatus, logout } from './services/auth';

function App() {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  // Custom hook for app data
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

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      console.log('Auth status on app load:', authStatus);
      setIsLoggedIn(authStatus.isAuthenticated);
      setCurrentUser(authStatus.currentUser);
    };
    checkAuth();
  }, []);

  // Fetch channels when user is logged in
  useEffect(() => {
    if (isLoggedIn && currentUser && currentUser.username) {
      fetchPublicChannels(currentUser.username);
      fetchPrivateChannels(currentUser.username);
    }
  }, [isLoggedIn, currentUser, fetchPublicChannels, fetchPrivateChannels]);

  // Toggle channel list visibility
  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsMessagesOpen(false);
  };

  // Toggle messages visibility
  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
  };

  // Handle channel selection
  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
    setIsMessagesOpen(false);
    if (isLoggedIn) {
      fetchMessages(channelId);
    }
  };

  // Handle input change for message typing
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Handle message submission
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

  // Handle successful login
  const handleLoginSuccess = async () => {
    const authStatus = await checkAuthStatus();
    console.log('Auth status after login:', authStatus);
    setIsLoggedIn(authStatus.isAuthenticated);
    setCurrentUser(authStatus.currentUser);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Render the JSX component with all necessary props
  return (
    <AppJSX
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
      publicChannels={publicChannels}
      privateChannels={privateChannels}
      messages={messages}
      selectedChannelId={selectedChannelId}
      inputMessage={inputMessage}
      isChannelListOpen={isChannelListOpen}
      isMessagesOpen={isMessagesOpen}
      loading={loading}
      error={error}
      toggleChannelList={toggleChannelList}
      toggleMessages={toggleMessages}
      handleChannelSelect={handleChannelSelect}
      handleInputChange={handleInputChange}
      handleMessageSubmit={handleMessageSubmit}
      handleLoginSuccess={handleLoginSuccess}
      handleLogout={handleLogout}
    />
  );
}

export default App;
