import React from 'react';

function Messages({ messages, currentUser, onSelectUser }) {
  // Group messages by user and get the last non-deleted message for each
  const conversationPreviews = messages.reduce((acc, message) => {
    if (message.deleted) return acc;

    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    
    if (!acc[otherUserId] || new Date(message.sentAt) > new Date(acc[otherUserId].sentAt)) {
      acc[otherUserId] = message;
    }
    
    return acc;
  }, {});

  return (
    <div className="messages-list">
      <h2>Messages</h2>
      <ul>
        {Object.entries(conversationPreviews).map(([userId, lastMessage]) => {
          const otherUser = lastMessage.senderId === currentUser.id
            ? { id: lastMessage.receiverId, username: lastMessage.receiverUsername }
            : { id: lastMessage.senderId, username: lastMessage.senderUsername };
          
          return (
            <li key={userId} onClick={() => onSelectUser(otherUser.id)}>
              <strong>{otherUser.username}</strong>
              <p>{lastMessage.content.substring(0, 50)}...</p>
              <small>{new Date(lastMessage.sentAt).toLocaleString()}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Messages;