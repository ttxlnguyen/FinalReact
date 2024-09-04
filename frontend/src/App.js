import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.js';
import Channels from './components/channels/Channels.js';
import Messages from './components/messages/Messages.js';
import MessageList from './components/MessageList';
import Typingbar from './components/typingbar/Typingbar.js';
import Login from './components/loginpage/Login.jsx';
import useAppData from './hooks/useAppData';
import { isAuthenticated } from './services/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
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
  } = useAppData();

  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
    }
  }, [isLoggedIn, fetchMessages]);

  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsMessagesOpen(false);
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
    setSelectedChannelId(null);
    setSelectedMessageId(null);
    fetchMessages();
  };

  const handleChannelSelect = (channelId) => {
    selectChannel(channelId);
    setIsChannelListOpen(false);
    fetchMessages(channelId);
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
    if (inputMessage.trim() !== '') {
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
        onLogout={() => setIsLoggedIn(false)}
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
        <div className=''>
          <Typingbar
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleMessageSubmit={handleMessageSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
