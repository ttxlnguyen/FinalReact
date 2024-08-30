import React from 'react';

// MessageList component
// This component displays the list of messages in the current conversation
// It also shows appropriate system messages based on the selected channel or direct message
function MessageList({ messages, selectedChannel, selectedDirectMessage }) {
  return (
    <div className="message-list">
      {/* Display messages */}
      {messages.map(message => (
        <div key={message.id} className="message">
          <strong>{message.sender}:</strong> {message.text}
          <span className="timestamp">{message.timestamp}</span>
        </div>
      ))}
      {/* Display a message when there are no messages in a selected channel or direct message */}
      {messages.length === 0 && (selectedChannel || selectedDirectMessage) && (
        <div className="message">
          <strong>System:</strong> No messages yet. Start the conversation!
        </div>
      )}
      {/* Display a message when no channel or direct message is selected */}
      {!selectedChannel && !selectedDirectMessage && (
        <div className="message">
          <strong>System:</strong> Select a channel or direct message to view the conversation.
        </div>
      )}
    </div>
  );
}

export default MessageList;