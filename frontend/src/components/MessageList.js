import React from 'react';

function MessageList({ messages, currentUser, selectedUser }) {
  if (!selectedUser || !messages) {
    return null;
  }

  const filteredMessages = messages.filter(message => 
    ((message.senderId === selectedUser.id && message.receiverId === currentUser.id) ||
    (message.senderId === currentUser.id && message.receiverId === selectedUser.id)) &&
    !message.deleted
  );

  return (
    <div className="message-list">
      <h2>Conversation with {selectedUser.username}</h2>
      <ul>
        {filteredMessages.map(message => (
          <li key={message.id} className={message.senderId === currentUser.id ? 'sent' : 'received'}>
            <strong>{message.senderId === currentUser.id ? 'You' : selectedUser.username}</strong>
            <p>{message.content}</p>
            <small>{new Date(message.sentAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;