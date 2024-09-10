import React from 'react';

// Notifications component
// This component displays a list of notifications
// It receives the notifications data as a prop from the parent component (App.js)
function Notifications({ notifications }) {
  return (
    <div className="notifications-list">
      <h2>Notifications</h2>
      <ul>
        {/* 
          Map through the notifications array and render each notification
          Each notification is expected to have an 'id' and a 'message' property
          The 'key' prop is important for React's reconciliation process
        */}
        {notifications.map(notification => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
      {/* 
        After MVP we should consider:
        - A "Mark all as read" button
        - Notification categories or filters
        - Timestamp for each notification
      */}
    </div>
  );
}

export default Notifications;

// Wish List:
// - Pagination or infinite scrolling for large numbers of notifications
// - Ability to dismiss individual notifications
// - Different styling for read vs unread notifications
// - Grouping notifications by type or source