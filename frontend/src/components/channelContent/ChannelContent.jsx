import React from 'react';

// Component to render a single message
const MessageItem = ({ message }) => (
  <li key={message.id}>
    <p>{message.content}</p>
    <small>{new Date(message.sentAt).toLocaleString()}</small>
    <small>{message.userProfile?.username || 'Unknown User'}</small>
  </li>
);

// Component to render the list of messages
const MessageListContent = ({ messages }) => (
  <div className="channel-content">
    <h2>Messages</h2>
    <ul>
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  </div>
);

// Main ChannelContent component
const ChannelContent = ({ messages, selectedChannelId }) => {
  // Filter messages based on the selected channel and remove deleted messages
  const filteredMessages = messages.filter(message => 
    message.channelId === selectedChannelId && !message.isDeleted
  );

  if (!selectedChannelId) {
    return (
      <div className="channel-content">
        <h2>Select a channel to view its messages</h2>
      </div>
    );
  }

  if (filteredMessages.length === 0) {
    return <div>No messages in this channel.</div>;
  }

  return <MessageListContent messages={filteredMessages} />;
};

export default ChannelContent;