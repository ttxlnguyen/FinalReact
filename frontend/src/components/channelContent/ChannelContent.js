import React from 'react';

function ChannelContent({ messages, selectedChannelId }) {
  const filteredMessages = messages.filter(message => !message.isDeleted);

  if (filteredMessages.length === 0) {
    return <div>No messages to display.</div>;
  }

  if (selectedChannelId) {
    return (
      <div className="message-list">
        <h2>Messages</h2>
        <ul>
          {filteredMessages.map(message => (
            <li key={message.id}>
              <p>{message.content}</p>
              <small>{new Date(message.sentAt).toLocaleString()}</small>
              <small>{message.userProfile?.username || 'Unknown User'}</small>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    //Show message content and userProfile username
    return (
      <div className="message-list">
        <h2>Messages</h2>
        <ul>
        {messages.map(message => (
            <li key={message.id} >
              <p>{message.content}</p>
              <small>{new Date(message.sentAt).toLocaleString()}</small>
              <small>  {message.userProfile?.username || 'Unknown User'}</small>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="message-list">
      <h2>Select a channel to view its messages</h2>
    </div>
  );
}

export default ChannelContent;