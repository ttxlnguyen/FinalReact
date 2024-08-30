import React from 'react';

// Sidebar component
// This component renders the sidebar with navigation icons
// It receives toggle functions as props to control the visibility of different sections
function Sidebar({ toggleNotifications, toggleChannelList, toggleMessages }) {
  return (
    <div className="sidebar">
      {/* Notifications icon */}
      <div className="sidebar-item" onClick={toggleNotifications}>
        <i className="icon">🔔</i>
        <span>Notifications</span>
      </div>
      {/* Channels icon */}
      <div className="sidebar-item" onClick={toggleChannelList}>
        <i className="icon">🏠</i>
        <span>Channels</span>
      </div>
      {/* Messages icon */}
      <div className="sidebar-item" onClick={toggleMessages}>
        <i className="icon">💬</i>
        <span>Messages</span>
      </div>
      {/* Profile icon */}
      <div className="sidebar-item profile">
        <i className="icon">👤</i>
        <span>Profile</span>
      </div>
    </div>
  );
}

export default Sidebar;