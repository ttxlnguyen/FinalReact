import React, { useState } from 'react';
import './App.css';
// Import components
import Sidebar from './components/Sidebar';
import Notifications from './Notifications/Notifications';
import Channels from './Channels/Channels';
import Messages from './Messages/Messages';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
// Import custom hook
import useAppData from './hooks/useAppData';

function App() {
  // Use custom hook to manage app data
  const {
    channels,
    notifications,
    messages,
  } = useAppData();

  // Local state
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDirectMessage, setSelectedDirectMessage] = useState(null);
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  // Toggle functions for sidebar items
  const toggleChannelList = () => {
    setIsChannelListOpen(!isChannelListOpen);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsChannelListOpen(false);
    setIsMessagesOpen(false);
  };

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsChannelListOpen(false);
    setIsNotificationsOpen(false);
  };

  // Function to handle channel selection
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setSelectedDirectMessage(null);
  };

  // Function to handle direct message selection
  const handleDirectMessageSelect = (message) => {
    setSelectedDirectMessage(message);
    setSelectedChannel(null);
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

  return (
    <div className="App">
      <Sidebar
        toggleNotifications={toggleNotifications}
        toggleChannelList={toggleChannelList}
        toggleMessages={toggleMessages}
      />

      {isChannelListOpen && <Channels channels={channels} handleChannelSelect={handleChannelSelect} />}
      {isNotificationsOpen && <Notifications notifications={notifications} />}
      {isMessagesOpen && <Messages messages={messages} handleDirectMessageSelect={handleDirectMessageSelect} />}

      <div className="main-content">
        <header className="main-header">
          <h1>{selectedChannel ? `# ${selectedChannel.name}` : selectedDirectMessage ? `${selectedDirectMessage.sender}` : 'Select a channel or message'}</h1>
          <p>{selectedChannel ? 'Channel chat' : selectedDirectMessage ? 'Direct message' : 'Please select a channel or direct message to start chatting'}</p>
        </header>
        
        <MessageList
          messages={messages}
          selectedChannel={selectedChannel}
          selectedDirectMessage={selectedDirectMessage}
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

// App.js uses data from useAppData, but keeps message handling local.
// When we integrate with the backend we need to:
// 1. Implement a sendMessage function in useAppData and update handleMessageSubmit to use it.
// 2. Add loading and error states from useAppData when they're implemented.
// 3. Update the Channels, Notifications, and Messages components as needed.
// 4. Implement proper error handling and loading states in the UI as needed.

