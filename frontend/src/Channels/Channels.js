import React from 'react';

// Channels component
// This component displays a list of channels and allows the user to select a channel
// It receives the channels data and a channel selection handler as props from the parent component (App.js)
function Channels({ channels, handleChannelSelect }) {
  return (
    <div className="channel-list">
      <h2>Channels</h2>
      <ul>
        {/* 
          Map through the channels array and render each channel as a clickable list item
          Each channel is expected to have an 'id' and a 'name' property
          The 'key' prop is important for React's reconciliation process
          When a channel is clicked, it calls the handleChannelSelect function passed from the parent
        */}
        {channels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelSelect(channel)}>
            # {channel.name}
          </li>
        ))}
      </ul>
      {/* 
        Possible improvements:
        - Add a search or filter functionality for channels
        - Show unread message count for each channel
        - Add the ability to create new channels
        - Group channels by categories or teams
      */}
    </div>
  );
}

export default Channels;

// Note: In a more advanced application, you might want to consider:
// - Implementing virtualization for large lists of channels (e.g., react-window)
// - Adding drag-and-drop functionality to reorder channels
// - Implementing channel favoriting or pinning
// - Showing additional metadata for each channel (e.g., member count, last activity)
// - Adding right-click context menu for channel management options