import React, { useState } from 'react';
import './Messages.css';

function Messages({ privateChannels, handleChannelSelect, createNewPrivateChannel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitedUsername, setInvitedUsername] = useState('');
  const [error, setError] = useState(null);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (invitedUsername.trim()) {
      try {
        const newChannel = await createNewPrivateChannel(invitedUsername.trim());
        if (newChannel) {
          setInvitedUsername('');
          setIsModalOpen(false);
          setError(null);
        } else {
          setError('Failed to create private channel. Please try again.');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="messages-list">
      <h2>Messages
        <button className='add-channel-btn' onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 2 24 24" width="20px" fill="#e8eaed">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </button>
      </h2>
      <h3>Private Messages</h3>
      <ul>
        {privateChannels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel.id, 'private')}>
            @ {channel.name} 
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create A Private Message</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleCreateChannel}>
              <input
                type="text"
                value={invitedUsername}
                onChange={(e) => setInvitedUsername(e.target.value)}
                placeholder="Enter username to invite"
                required
              />
              <div className="button-container">
                <button type="submit">Create</button>
                <button type="button" onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
