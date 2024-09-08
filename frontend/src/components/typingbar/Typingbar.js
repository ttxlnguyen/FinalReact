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
      <form onSubmit={onSubmit} className="typing-bar">
        <input
          ref={inputRef}
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