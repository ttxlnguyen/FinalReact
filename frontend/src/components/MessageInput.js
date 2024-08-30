import React from 'react';

// MessageInput component
// This component renders the input field for typing messages and the send button
// It receives the current input message, change handler, and submit handler as props
function MessageInput({ inputMessage, handleInputChange, handleMessageSubmit }) {
  return (
    <form onSubmit={handleMessageSubmit} className="message-input">
      {/* Input field for typing messages */}
      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        placeholder="Type your message here..."
      />
      {/* Send button */}
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;