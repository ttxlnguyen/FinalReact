import React from 'react';

// MessageInput component
// This component renders the input field for typing messages and the send button
function MessageInput({ inputMessage, handleInputChange, handleMessageSubmit }) {
  return (
    <form onSubmit={handleMessageSubmit} className="message-input">
      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;

// Note: This component doesn't require any backend .jsx file as it's purely a frontend component.
// It receives the necessary props from its parent component (App.js) to handle the input state and submission.