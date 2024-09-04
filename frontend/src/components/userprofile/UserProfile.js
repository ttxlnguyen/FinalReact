import React from 'react';
import './UserProfile.css';

// UserProfile component
// This component displays the user's profile information in a popup
function UserProfile({ user, onClose }) {
  return (
    <div className="user-profile-popup">
      <div className="user-profile-header">
        <h2>User Profile</h2>
        <button onClick={onClose} className="close-button">X</button>
      </div>
      <div className="user-profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Password:</strong> {user.password}</p>
      </div>
    </div>
  );
}

export default UserProfile;
