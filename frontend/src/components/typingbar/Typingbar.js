import React, { useRef, useEffect } from 'react';
import './Typingbar.css';

// Typingbar component
// This component renders the input field for typing messages and the send button
function Typingbar({ inputMessage, handleInputChange, handleMessageSubmit }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current.focus();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    handleMessageSubmit(e);
    // Refocus the input field after submitting
    inputRef.current.focus();
  };

  return (
    <div className="typing-bar">
      <form onSubmit={onSubmit} className="typing-bar-form">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="message-input" // Added class for styling
        />
        <button type="submit" className="send-button">Send</button> // Added class for styling
      </form>
    </div>
  );
}

export default Typingbar;
