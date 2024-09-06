import React from 'react';
import './Channels.css';
import MessageList from '../MessageList.js'

function Channels({ channels, handleChannelSelect }) {
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
      <ul>
        {channels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel.id)}>
            # {channel.name} 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Channels;