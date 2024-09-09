import React, { useState, useEffect } from 'react';
import AppJSX from './App.jsx';
import useAppData from './hooks/useAppData';
import { checkAuthStatus, logout } from './services/auth';

function App() {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks user's login status
  const [currentUser, setCurrentUser] = useState(null); // Stores current user's information
  const [isChannelListOpen, setIsChannelListOpen] = useState(false); // Controls visibility of channel list
  const [isMessagesOpen, setIsMessagesOpen] = useState(false); // Controls visibility of messages
  const [inputMessage, setInputMessage] = useState(''); // Stores the current message being typed

  // Custom hook for managing app data (channels, messages, etc.)
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
    fetchPrivateChannels,
    createNewPrivateChannel,
    createNewPublicChannel
  } = useAppData(isLoggedIn);

  // Check authentication status when the component mounts
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
    // Removed: setIsChannelListOpen(false);
    setIsMessagesOpen(true);
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
      setInputMessage(''); // Clear the input after sending
      if (selectedChannelId) {
        console.log('Channel selected:', selectedChannelId);
        fetchMessages(selectedChannelId); // Refresh messages for the selected channel
      } else {
        fetchMessages(); // Fetch all messages if no channel is selected
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

  // Handle creating a new private channel
  const handleCreatePrivateChannel = async (invitedUsername) => {
    if (isLoggedIn && currentUser) {
      const newChannel = await createNewPrivateChannel(invitedUsername);
      if (newChannel) {
        handleChannelSelect(newChannel.id);
      }
    }
  };

  // Handle creating a new public channel
  const handleCreatePublicChannel = async (channelName) => {
    if (isLoggedIn && currentUser) {
      const newChannel = await createNewPublicChannel(channelName);
      if (newChannel) {
        handleChannelSelect(newChannel.id);
      }
    }
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
      createNewPrivateChannel={handleCreatePrivateChannel}
      createNewPublicChannel={handleCreatePublicChannel}
    />
  );
}

export default App;
