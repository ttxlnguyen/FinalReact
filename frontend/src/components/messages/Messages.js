import React, { useEffect, useState } from 'react';
import { getMessages } from '../../services/api';
import './Messages.css'

function Messages({ onSelectMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('Fetching messages');
      try {
        const fetchedMessages = await getMessages();
        const filteredMessages = fetchedMessages.filter(message => !message.isDeleted);
        setMessages(filteredMessages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="messages-list">
      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id} onClick={() => onSelectMessage(message.id)}>
            <p>{message.content.substring(0, 50)}...</p>
            <small>Sent at: {new Date(message.sentAt).toLocaleString()}</small>
           
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Messages;