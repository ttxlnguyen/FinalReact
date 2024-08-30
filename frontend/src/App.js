import React, { useState, useEffect } from 'react';
import './App.css';
// Import API functions from the api.js file
import { getChannels, getNotifications, getDirectMessages } from './services/api';

function App() {
  // State variables to control the visibility of each sidebar list
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  // State variables to store data fetched from API
  const [channels, setChannels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);

  // State variables for selected channel or direct message
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDirectMessage, setSelectedDirectMessage] = useState(null);

  // New state variable for the input field
  const [inputMessage, setInputMessage] = useState('');

  // New state variable to store messages
  const [messages, setMessages] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      // API call to get channels
      const channelsData = await getChannels();
      // API call to get notifications
      const notificationsData = await getNotifications();
      // API call to get direct messages
      const directMessagesData = await getDirectMessages();

      // Update state with fetched data
      setChannels(channelsData);
      setNotifications(notificationsData);
      setDirectMessages(directMessagesData);

      // Set default selected channel to the first channel
      if (channelsData.length > 0) {
        setSelectedChannel(channelsData[0]);
      }
    };

    fetchData();
  }, []);

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

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Function to handle message submission
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
      {/* Sidebar with icons for different sections */}
      <div className="sidebar">
        <div className="sidebar-item" onClick={toggleNotifications}>
          <i className="icon">🔔</i>
          <span>Notifications</span>
        </div>
        <div className="sidebar-item" onClick={toggleChannelList}>
          <i className="icon">🏠</i>
          <span>Channels</span>
        </div>
        <div className="sidebar-item" onClick={toggleMessages}>
          <i className="icon">💬</i>
          <span>Messages</span>
        </div>
        <div className="sidebar-item profile">
          <i className="icon">👤</i>
          <span>Profile</span>
        </div>
      </div>

      {/* Channel list - visible when isChannelListOpen is true */}
      {isChannelListOpen && (
        <div className="channel-list">
          <h2>Channels</h2>
          <ul>
            {/* Map through channels data from API to display channel list */}
            {channels.map(channel => (
              <li key={channel.id} onClick={() => handleChannelSelect(channel)}>
                # {channel.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notifications list - visible when isNotificationsOpen is true */}
      {isNotificationsOpen && (
        <div className="notifications-list">
          <h2>Notifications</h2>
          <ul>
            {/* Map through notifications data from API to display notifications */}
            {notifications.map(notification => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Messages list - visible when isMessagesOpen is true */}
      {isMessagesOpen && (
        <div className="messages-list">
          <h2>Direct Messages</h2>
          <ul>
            {/* Map through directMessages data from API to display direct messages */}
            {directMessages.map(message => (
              <li key={message.id} onClick={() => handleDirectMessageSelect(message)}>
                {message.name} {message.unread > 0 && `(${message.unread})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main content area */}
      <div className="main-content">
        <header className="main-header">
          <h1>{selectedChannel ? `# ${selectedChannel.name}` : selectedDirectMessage ? `${selectedDirectMessage.name}` : 'Select a channel or message'}</h1>
          <p>{selectedChannel ? 'Channel chat' : selectedDirectMessage ? 'Direct message' : 'Please select a channel or direct message to start chatting'}</p>
        </header>
        <div className="message-list">
          {/* Display messages */}
          {messages.map(message => (
            <div key={message.id} className="message">
              <strong>{message.sender}:</strong> {message.text}
              <span className="timestamp">{message.timestamp}</span>
            </div>
          ))}
          {messages.length === 0 && (selectedChannel || selectedDirectMessage) && (
            <div className="message">
              <strong>System:</strong> No messages yet. Start the conversation!
            </div>
          )}
          {!selectedChannel && !selectedDirectMessage && (
            <div className="message">
              <strong>System:</strong> Select a channel or direct message to view the conversation.
            </div>
          )}
        </div>
        {/* Message input field */}
        {(selectedChannel || selectedDirectMessage) && (
          <form onSubmit={handleMessageSubmit} className="message-input">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
