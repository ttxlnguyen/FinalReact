import React, { useState, useEffect } from 'react';
import { getMessages } from '../services/api';

// Messages component
// This component fetches and displays a list of messages and allows the user to select a conversation
function Messages({ handleDirectMessageSelect }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await getMessages();
        setMessages(fetchedMessages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error loading messages: {error}</p>;
  if (messages.length === 0) return <p>No messages available</p>;

  return (
    <div className="messages-list">
      <h2>Messages</h2>
      <ul>
        {/* 
          Map through the messages array and render each message as a clickable list item
          Each message is expected to have an 'id', 'content', and 'sentAt' property
          The 'key' prop is important for React's reconciliation process
          When a message is clicked, it calls the handleDirectMessageSelect function passed from the parent
        */}
        {messages.map(message => (
          <li key={message.id} onClick={() => handleDirectMessageSelect(message)}>
            <strong>{message.content.substring(0, 30)}...</strong>
            <br />
            Sent at: {new Date(message.sentAt).toLocaleString()}
          </li>
        ))}
      </ul>
      {/* 
          TODO:
          - Add the ability to start a new conversation

        After MVP we should consider:
        - Add a search functionality for messages
        - Group messages by conversation or channel
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