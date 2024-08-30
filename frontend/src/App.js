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
  // Hooks allow us to use state and other React features without writing a class
  // useAppData is a custom hook that fetches and manages channels, notifications, and direct messages
  const {
    channels,
    notifications,
    directMessages,
    selectedChannel,
    setSelectedChannel,
    selectedDirectMessage,
    setSelectedDirectMessage,
  } = useAppData();

  // useState is a hook that lets you add React state to function components
  // Here we use it to manage the visibility of sidebar items and the current input message

  // State variables to control the visibility of each sidebar list
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  // State for the current input message
  const [inputMessage, setInputMessage] = useState('');

  // State to store all messages in the current conversation
  const [messages, setMessages] = useState([]);

  // Toggle functions for sidebar items
  // These functions ensure only one list is open at a time
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
  // When a channel is selected, we clear any selected direct message
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setSelectedDirectMessage(null);
  };

  // Function to handle direct message selection
  // When a direct message is selected, we clear any selected channel
  const handleDirectMessageSelect = (message) => {
    setSelectedDirectMessage(message);
    setSelectedChannel(null);
  };

  // Function to handle input change in the message input field
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Function to handle message submission
  // This creates a new message object and adds it to the messages array
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="App">
      {/* Sidebar component - contains navigation icons */}
      <Sidebar
        toggleNotifications={toggleNotifications}
        toggleChannelList={toggleChannelList}
        toggleMessages={toggleMessages}
      />

      {/* Channel list - visible when isChannelListOpen is true */}
      {isChannelListOpen && <Channels channels={channels} handleChannelSelect={handleChannelSelect} />}

      {/* Notifications list - visible when isNotificationsOpen is true */}
      {isNotificationsOpen && <Notifications notifications={notifications} />}

      {/* Messages list - visible when isMessagesOpen is true */}
      {isMessagesOpen && <Messages directMessages={directMessages} handleDirectMessageSelect={handleDirectMessageSelect} />}

      {/* Main content area */}
      <div className="main-content">
        <header className="main-header">
          <h1>{selectedChannel ? `# ${selectedChannel.name}` : selectedDirectMessage ? `${selectedDirectMessage.name}` : 'Select a channel or message'}</h1>
          <p>{selectedChannel ? 'Channel chat' : selectedDirectMessage ? 'Direct message' : 'Please select a channel or direct message to start chatting'}</p>
        </header>
        
        {/* MessageList component - displays all messages in the current conversation */}
        <MessageList
          messages={messages}
          selectedChannel={selectedChannel}
          selectedDirectMessage={selectedDirectMessage}
        />
        
        {/* MessageInput component - allows user to type and send messages */}
        {(selectedChannel || selectedDirectMessage) && (
          <MessageInput
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleMessageSubmit={handleMessageSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default App;
