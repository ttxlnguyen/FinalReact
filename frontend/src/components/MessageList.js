import React from 'react';

function MessageList({ messages, selectedMessageId }) {
  const filteredMessages = messages.filter(message => !message.isDeleted);

  if (filteredMessages.length === 0) {
    return <div>No messages to display.</div>;
  }

  if (selectedMessageId) {
    const selectedMessage = filteredMessages.find(message => message.id === selectedMessageId);
    if (!selectedMessage) {
      return <div>Message not found or has been deleted.</div>;
    }
    
    // Find all messages in the conversation
    const conversationMessages = filteredMessages.filter(
      message => message.senderId === selectedMessage.senderId || message.receiverId === selectedMessage.senderId
    );

    return (
      <div className="message-conversation">
        <h2>Conversation</h2>
        <ul>
          {conversationMessages.map(message => (
            <li key={message.id} className={message.senderId === selectedMessage.senderId ? 'received' : 'sent'}>
              <p>{message.content}</p>
              <small>{new Date(message.sentAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="message-list">
      <h2>Select a message to view its details</h2>
    </div>
  );
}

export default MessageList;