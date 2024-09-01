import React from 'react';

function Channels({ channels, handleChannelSelect }) {
  return (
    <div className="channel-list">
      <h2>Channels</h2>
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