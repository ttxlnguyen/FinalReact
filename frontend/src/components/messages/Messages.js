import React, { useState, useCallback } from 'react';
import './Messages.css';

function Messages({ privateChannels, handleChannelSelect, createNewPrivateChannel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitedUsername, setInvitedUsername] = useState('');
  const [error, setError] = useState(null);

  const handleCreateChannel = useCallback(async (e) => {
    e.preventDefault();
    console.log('Attempting to create channel with username:', invitedUsername);
    if (invitedUsername.trim()) {
      try {
        const newChannel = await createNewPrivateChannel(invitedUsername.trim());
        console.log('New channel created:', newChannel);
        if (newChannel) {
          setInvitedUsername('');
          setIsModalOpen(false);
          setError(null);
        } else {
          setError('Failed to create private channel. Please try again.');
        }
      } catch (err) {
        console.error('Error creating channel:', err);
        setError(`The username "${invitedUsername}" is invalid. Please try again.`);
      }
    }
  }, [invitedUsername, createNewPrivateChannel]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
    setInvitedUsername('');
  }, []);

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
            <form onSubmit={handleCreateChannel}>
              <input
                type="text"
                value={invitedUsername}
                onChange={(e) => setInvitedUsername(e.target.value)}
                placeholder="Enter username to invite"
                required
              />
              {error && (
                <div style={{color: 'red', marginTop: '10px', marginBottom: '10px'}}>
                  {error}
                </div>
              )}
              <div className="button-container">
                <button type="submit">Create</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
