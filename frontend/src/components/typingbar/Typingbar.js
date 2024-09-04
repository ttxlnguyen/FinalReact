import React from 'react';
import './Typingbar.css';

// Typingbar component
// This component renders the input field for typing messages and the send button
function Typingbar({ inputMessage, handleInputChange, handleMessageSubmit }) {
  return (
    <div className="typing-bar">
      <form onSubmit={handleMessageSubmit} className="typing-bar">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="  Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Typingbar;