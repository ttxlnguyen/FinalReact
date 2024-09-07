import React from 'react';
import './Channels.css';
import MessageList from '../MessageList.js'

function Channels({ channels, publicChannels, privateChannels, handleChannelSelect }) {
  return (
    <div className="channel-list">
      <h2>Channels
        <button className='add-channel-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 2 24 24" width="20px" fill="#e8eaed">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </button>
      </h2>
      {/* Display public channels */}
      <h3>Public Channels</h3>
      <ul>
        {/* Map through publicChannels array and create a list item for each channel */}
        {publicChannels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel.id, 'public')}>
            # {channel.name} 
          </li>
        ))}
      </ul>
      {/* Display private channels */}
      <h3>Private Channels</h3>
      <ul>
        {/* Map through privateChannels array and create a list item for each channel */}
        {privateChannels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel.id, 'private')}>
            @ {channel.name} 
          </li>
        ))}
      </ul>
      {/* Commented out All Channels section
      <h3>All Channels</h3>
      <ul>
        {channels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel.id, 'all')}>
            # {channel.name} 
          </li>
        ))}
      </ul>
      */}
    </div>
  );
}

export default Channels;