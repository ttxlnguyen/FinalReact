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
    channels, 
    publicChannels,
    privateChannels,
    messages,
    setMessages, 
    loading, 
    error, 
    selectChannel, 
    selectedChannelId, 
    selectedChannelType,
    setSelectedChannelId, 
    sendMessage, 
    fetchMessages,
    fetchMessagesByUser,
    fetchPublicChannels,
    fetchPrivateChannels
  } = useAppData(isLoggedIn);  // Pass isLoggedIn to useAppData

  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);

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
    setSelectedChannelId(null);
    setSelectedMessageId(null);
    if (isLoggedIn) {
      fetchMessages();
    }
  };

  const handleChannelSelect = (channelId, channelType) => {
    selectChannel(channelId, channelType);
    setIsChannelListOpen(false);
    if (isLoggedIn) {
      fetchMessages(channelId, channelType);
    }
  };

  const handleMessageSelect = (messageId) => {
    setSelectedMessageId(messageId);
    setIsMessagesOpen(false);
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
        fetchMessages(selectedChannelId, selectedChannelType);
      } else if (selectedMessageId) {
        // If a message is selected, fetch the updated conversation
        const updatedMessages = await fetchMessagesByUser(messages.find(m => m.id === selectedMessageId).senderId);
        setMessages(updatedMessages);
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
          channels={channels}
          publicChannels={publicChannels}
          privateChannels={privateChannels}
          handleChannelSelect={handleChannelSelect}
        />
      )}
      {isMessagesOpen && <Messages messages={messages} onSelectMessage={handleMessageSelect} />}

      <div className="main-content">
        <header className="main-header">
          <h1>
            {selectedChannelId 
              ? `# ${channels.find(c => c.id === selectedChannelId)?.name || 
                   publicChannels.find(c => c.id === selectedChannelId)?.name || 
                   privateChannels.find(c => c.id === selectedChannelId)?.name}`
              : 'All Messages'
            }
          </h1>
        </header>
        
        <MessageList 
          messages={messages}
          selectedMessageId={selectedMessageId}
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
