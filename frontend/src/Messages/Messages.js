import React from 'react';

// Messages component
// This component displays a list of messages and allows the user to select a conversation
// It receives the messages data and a message selection handler as props from the parent component (App.js)
function Messages({ messages, handleDirectMessageSelect }) {
  return (
    <div className="messages-list">
      <h2>Messages</h2>
      <ul>
        {/* 
          Map through the messages array and render each message as a clickable list item
          Each message is expected to have an 'id', 'sender', and 'text' property
          The 'key' prop is important for React's reconciliation process
          When a message is clicked, it calls the handleDirectMessageSelect function passed from the parent
        */}
        {messages.map(message => (
          <li key={message.id} onClick={() => handleDirectMessageSelect(message)}>
            <strong>{message.sender}:</strong> {message.text.substring(0, 30)}...
          </li>
        ))}
      </ul>
      {/* 

          TODO:
          - Add the ability to start a new conversation

        After MVP we should consider:
        - Add a search functionality for messages
        - Group messages by conversation or channel
        - Show timestamps for each message
        - Implement infinite scrolling for large message lists
      */}
    </div>
  );
}

export default Messages;




















// Wish List:
// - Implementing virtualization for large lists of messages (e.g., react-window)
// - Adding the ability to filter messages (e.g., by date, sender, or content)
// - Implementing message threading or replies
// - Adding rich media support (e.g., emoji reactions, file attachments)
// - Implementing real-time updates for new messages
// - Adding read/unread status for messages