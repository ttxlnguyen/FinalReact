import { useState, useEffect } from 'react';
import { getChannels, getNotifications, getDirectMessages } from '../services/api';

// Custom hook for managing application data
// Hooks are functions that let you "hook into" React state and lifecycle features from function components.
// They allow you to use state and other React features without writing a class.
//
// This custom hook (useAppData) encapsulates the logic for fetching and managing 
// channels, notifications, and direct messages. It uses the built-in useState and useEffect hooks.
//
// useState: Allows functional components to manage state.
// useEffect: Allows performing side effects in functional components. It's similar to 
//            componentDidMount, componentDidUpdate, and componentWillUnmount combined.
function useAppData() {
  // useState hook: Creates state variables and their setter functions
  // State for storing fetched data
  const [channels, setChannels] = useState([]); // Initialize channels as an empty array
  const [notifications, setNotifications] = useState([]); // Initialize notifications as an empty array
  const [directMessages, setDirectMessages] = useState([]); // Initialize directMessages as an empty array

  // State for selected channel and direct message
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedDirectMessage, setSelectedDirectMessage] = useState(null);

  // useEffect hook: Performs side effects in functional components
  // This effect runs after the component mounts (similar to componentDidMount)
  useEffect(() => {
    const fetchData = async () => {
      // Fetch channels, notifications, and direct messages from the API
      const channelsData = await getChannels();
      const notificationsData = await getNotifications();
      const directMessagesData = await getDirectMessages();

      // Update state with fetched data using the setter functions
      setChannels(channelsData);
      setNotifications(notificationsData);
      setDirectMessages(directMessagesData);

      // Set default selected channel to the first channel if available
      if (channelsData.length > 0) {
        setSelectedChannel(channelsData[0]);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Return the state and setter functions
  // This allows components using this hook to access and modify the data
  return {
    channels,
    notifications,
    directMessages,
    selectedChannel,
    setSelectedChannel,
    selectedDirectMessage,
    setSelectedDirectMessage,
  };
}

export default useAppData;