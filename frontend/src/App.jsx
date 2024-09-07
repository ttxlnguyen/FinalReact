import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.js';
import Channels from './components/channels/Channels.js';
import Messages from './components/messages/Messages.js';
import MessageList from './components/MessageList';
import Typingbar from './components/typingbar/Typingbar.js';
import Login from './components/loginpage/Login.jsx';

// Component to render the main content
const MainContent = ({ selectedChannelId, publicChannels, privateChannels, messages, inputMessage, handleInputChange, handleMessageSubmit }) => (
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
);

// Main App component
const App = ({
  isLoggedIn,
  currentUser,
  publicChannels,
  privateChannels,
  messages,
  selectedChannelId,
  inputMessage,
  isChannelListOpen,
  isMessagesOpen,
  loading,
  error,
  toggleChannelList,
  toggleMessages,
  handleChannelSelect,
  handleInputChange,
  handleMessageSubmit,
  handleLoginSuccess,
  handleLogout
}) => {
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

      <MainContent 
        selectedChannelId={selectedChannelId}
        publicChannels={publicChannels}
        privateChannels={privateChannels}
        messages={messages}
        inputMessage={inputMessage}
        handleInputChange={handleInputChange}
        handleMessageSubmit={handleMessageSubmit}
      />
    </div>
  );
};

export default App;