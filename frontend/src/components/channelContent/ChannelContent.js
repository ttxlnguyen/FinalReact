import React, { useRef, useEffect } from 'react';

function ChannelContent({ messages, selectedChannelId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages.filter(message => !message.isDeleted);

  if (filteredMessages.length === 0) {
    return <div className="message-list">No messages to display.</div>;
  }

  const messageListStyle = {
    height: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const renderMessages = (messagesToRender) => {
    return [...messagesToRender].reverse().map(message => (
      <p key={message.id}>
        <h4>{message.userProfile?.username + ": " || 'Unknown User: '}
          <span className="timestamp">{new Date(message.sentAt).toLocaleString()}</span>
        </h4>
        <small>{message.content}</small>
      </p>
    ));
  };

  if (selectedChannelId) {
    return (
      <div className="message-list" style={messageListStyle}>
        <h2>Messages</h2>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderMessages(filteredMessages)}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  } else {
    //Show message content and userProfile username
    return (
      <div className="message-list" style={messageListStyle}>
        <h2>Messages</h2>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderMessages(messages)}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
}

export default ChannelContent;