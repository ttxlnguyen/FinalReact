import React, { useState } from 'react';
import './Sidebar.css';
import UserProfile from '../userprofile/UserProfile';

// Sidebar component
// This component renders the sidebar with navigation icons
// It receives toggle functions as props to control the visibility of different sections
// It also receives onLogout function to handle user logout
function Sidebar({ toggleNotifications, toggleChannelList, toggleMessages, onLogout, user }) {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };
  
  return (
    <div className="sidebar">
      {/* Notifications icon */}
      <div className="sidebar-item" onClick={toggleNotifications}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="#e8eaed">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        <span>Notification</span>
      </div>
      {/* Channels icon */}
      <div className="sidebar-item" onClick={toggleChannelList}>
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="40px" viewBox="0 0 20 20" width="40px" fill="#e8eaed"><g>
          <rect fill="none" height="20" width="20"/></g><g>
          <path d="M15.74,14.39L11.5,8.93V5.87l0.85-1.06C12.61,4.48,12.38,4,11.96,4H8.04C7.62,4,7.39,4.48,7.65,4.81L8.5,5.87v3.05 l-4.24,5.46C3.74,15.04,4.21,16,5.04,16h9.91C15.79,16,16.26,15.04,15.74,14.39z"/></g>
        </svg>
        <span>Channels</span>
      </div>
      {/* Messages icon */}
      <div className="sidebar-item" onClick={toggleMessages}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="#e8eaed">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
        </svg>
        <span>Messages</span>
      </div>
      {/* Profile icon */}
      <div className="sidebar-item-profile" onClick={handleProfileClick}>
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 20 20" height="40px" viewBox="0 0 20 20" width="40px" fill="#e8eaed"><g>
          <rect fill="none" height="20" width="20"/></g><g><g>
          <path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g>
        </svg>
        <span>Profile</span>
      </div>
      {/* Logout icon */}
      <div className="sidebar-item-logout" onClick={onLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="40px" fill="#e8eaed"><path d="M0 0h24v24H0z" fill="none"/>
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        <span>Logout</span>
      </div>
      {/* Render the UserProfile component if showProfile is true */}
      {showProfile && <UserProfile user={user} onClose={handleCloseProfile} />}
    </div>
  );
}

export default Sidebar;
