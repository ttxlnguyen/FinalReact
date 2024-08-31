import { useState, useEffect } from 'react';
import { getChannels, getNotifications, getMessages } from '../services/api';

function useAppData() {
  const [channels, setChannels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const channelsData = await getChannels();
        const notificationsData = await getNotifications();
        const messagesData = await getMessages();

        setChannels(channelsData);
        setNotifications(notificationsData);
        setMessages(messagesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { channels, notifications, messages, loading, error };
}

export default useAppData;

// The useAppData hook prepares the structure for fetching channels, notifications, and messages.
// When our backend endpoints are ready:
// 1. Update the API functions in api.js to make real API calls.
// 2. The data will automatically be fetched and stored in the respective state variables.
// 3. You can then use this data in your components by calling useAppData().