import React from 'react';
import './UserProfile.css';
import { getCurrentUser } from '../../services/auth';

// UserProfile component
// This component displays the user's profile information in a popup
function UserProfile({ onClose }) {
  // Get the current user's information
  const currentUser = getCurrentUser();

  return (
    <div className="user-profile-popup">
      <div className="user-profile-header">
        <h2>User Profile</h2>
        <button onClick={onClose} className="close-button">X</button>
      </div>
      <div className="user-profile-info">
        <p><strong>Name:</strong> {currentUser ? currentUser.username : 'N/A'}</p>
        {currentUser && currentUser.email && (
          <p><strong>Email:</strong> {currentUser.email}</p>
        )}
        {currentUser && currentUser.password && (
          <p><strong>Password:</strong> {currentUser.password}</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
