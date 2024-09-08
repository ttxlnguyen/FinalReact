import React from 'react';

function ChannelContent({ messages, selectedChannelId }) {
  const filteredMessages = messages.filter(message => !message.isDeleted);

  if (filteredMessages.length === 0) {
    return <div className="message-list">No messages to display.</div>;
  }

  if (selectedChannelId) {
    return (
      <div className="message-list">
        <h2>Messages</h2>
        <ul>
          {filteredMessages.map(message => (
            <p key={message.id}>
              <h4>{message.userProfile?.username + ": " + new Date(message.sentAt).toLocaleString() || 'Unknown User'}</h4>
              <small>{message.content}</small>
            </p>
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
            <p key={message.id} >
              <h4>{message.userProfile?.username + ": " + new Date(message.sentAt).toLocaleString()|| 'Unknown User: '}</h4>
              <small>{message.content}</small>
            </p>
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