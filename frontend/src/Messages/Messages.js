import React from 'react';

// Messages component
// This component displays a list of direct messages and allows the user to select a conversation
// It receives the directMessages data and a message selection handler as props from the parent component (App.js)
function Messages({ directMessages, handleDirectMessageSelect }) {
  return (
    <div className="messages-list">
      <h2>Direct Messages</h2>
      <ul>
        {/* 
          Map through the directMessages array and render each message as a clickable list item
          Each message is expected to have an 'id', 'name', and 'unread' property
          The 'key' prop is important for React's reconciliation process
          When a message is clicked, it calls the handleDirectMessageSelect function passed from the parent
        */}
        {directMessages.map(message => (
          <li key={message.id} onClick={() => handleDirectMessageSelect(message)}>
            {message.name} {message.unread > 0 && `(${message.unread})`}
          </li>
        ))}
      </ul>
      {/* 
        Possible improvements:
        - Add a search functionality for direct messages
        - Show online/offline status for each user
        - Add the ability to start a new direct message
        - Show the last message preview for each conversation
      */}
    </div>
  );
}

export default Messages;

// Note: In a more advanced application, you might want to consider:
// - Implementing virtualization for large lists of messages (e.g., react-window)
// - Adding the ability to group direct messages (e.g., favorites, recent)
// - Implementing message threading or replies within a direct message
// - Adding rich media support (e.g., emoji reactions, file attachments)
// - Implementing real-time updates for new messages or status changes