import { useState, useEffect } from 'react';
import { getNotifications, getDirectMessages } from '../services/api';

// Custom hook for managing application data
// This hook fetches and manages notifications and direct messages
function useAppData() {
  // State for storing fetched data
  const [notifications, setNotifications] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);

  // State for selected channel and direct message
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDirectMessage, setSelectedDirectMessage] = useState(null);

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Fetch notifications and direct messages from the API
      const notificationsData = await getNotifications();
      const directMessagesData = await getDirectMessages();

      // Update state with fetched data
      setNotifications(notificationsData);
      setDirectMessages(directMessagesData);
    };

    fetchData();
  }, []);

  // Return the state and setter functions
  return {
    notifications,
    directMessages,
    selectedChannel,
    setSelectedChannel,
    selectedDirectMessage,
    setSelectedDirectMessage,
  };
}

export default useAppData;

// Note: This hook no longer manages channels data, as that's now handled directly in the Channels component.
// When integrating with the JHipster backend:
// 1. Ensure that the getNotifications and getDirectMessages functions in api.js are updated to use real API calls.
// 2. Add any necessary error handling or loading states as needed.
// 3. Consider adding pagination or infinite scrolling for large datasets.