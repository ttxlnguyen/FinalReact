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
    messages,
    setMessages, 
    loading, 
    error, 
    selectChannel, 
    selectedChannelId, 
    setSelectedChannelId, 
    sendMessage, 
    fetchMessages,
    fetchMessagesByUser
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

  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
    if (isLoggedIn) {
      fetchMessages(channelId);
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
      await sendMessage(inputMessage, selectedChannelId);
      setInputMessage('');
      if (selectedChannelId) {
        fetchMessages(selectedChannelId);
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

      {isChannelListOpen && <Channels channels={channels} handleChannelSelect={handleChannelSelect} />}
      {isMessagesOpen && <Messages messages={messages} onSelectMessage={handleMessageSelect} />}

      <div className="main-content">
        <header className="main-header">
          <h1>
            {selectedChannelId 
              ? `# ${channels.find(c => c.id === selectedChannelId)?.name}`
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

/**
 * Changes made to address login state update issues:
 * 1. Added a currentUser state to store the logged-in user's information.
 * 2. Updated the initial useEffect to use an async function for checking auth status.
 * 3. Modified handleLoginSuccess to be an async function and update both isLoggedIn and currentUser states.
 * 4. Updated handleLogout to clear both isLoggedIn and currentUser states.
 * 5. Passed currentUser to the Sidebar component instead of calling checkAuthStatus() directly.
 */
