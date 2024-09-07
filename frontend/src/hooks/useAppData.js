import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages, getMessagesByChannel, postMessage, getUserProfile, getPublicChannelsByUsername, getPrivateChannelsByUsername } from '../services/api';
import { getCurrentUser } from '../services/auth';

// Custom hook to manage the application's data
function useAppData(isLoggedIn) {
  // State variables
  const [publicChannels, setPublicChannels] = useState([]); // Public channels
  const [privateChannels, setPrivateChannels] = useState([]); // Private channels
  const [channels, setChannels] = useState([]); // All channels (might be unused)
  const [messages, setMessages] = useState([]); // Messages in the current channel
  const [selectedChannelId, setSelectedChannelId] = useState(null); // Currently selected channel
  const [userProfile, setUserProfile] = useState(null); // User profile information
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const [error, setError] = useState(null); // Error state for async operations

  // Fetch all channels (might be unused)
  const fetchChannels = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const channelsData = await getChannels();
      setChannels(channelsData);
    } catch (err) {
      setError('Failed to fetch channels: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch public channels for a specific user
  const fetchPublicChannels = useCallback(async (username) => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const publicChannelsData = await getPublicChannelsByUsername(username);
      setPublicChannels(publicChannelsData);
    } catch (err) {
      setError('Failed to fetch public channels: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch private channels for a specific user
  const fetchPrivateChannels = useCallback(async (username) => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const privateChannelsData = await getPrivateChannelsByUsername(username);
      setPrivateChannels(privateChannelsData);
    } catch (err) {
      setError('Failed to fetch private channels: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch messages for a specific channel or all messages
  const fetchMessages = useCallback(async (channelId = null) => {
    console.log('Fetching messages from ' + channelId);
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      let messagesData;
      if (channelId) {
        messagesData = await getMessagesByChannel(channelId);
      } else {
        messagesData = await getMessages();
      }
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (err) {
      setError('Failed to fetch user profile: ' + err.message);
    }
  }, [isLoggedIn]);

  // Effect to fetch initial data when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchChannels();
      // fetchMessages(); // Commented out, might be unnecessary
      fetchUserProfile();
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.username) {
        fetchPublicChannels(currentUser.username);
        fetchPrivateChannels(currentUser.username);
      }
    }
  }, [isLoggedIn, fetchChannels, fetchUserProfile, fetchPublicChannels, fetchPrivateChannels]);

  // Effect to fetch messages when a channel is selected
  useEffect(() => {
    if (isLoggedIn && selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [isLoggedIn, selectedChannelId, fetchMessages]);

  // Function to select a channel
  const selectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  // Function to send a message
  const sendMessage = async (content, channelId = null) => {
    if (!isLoggedIn) return;
    console.log(channelId);
    try {
      const actualChannelId = channelId || selectedChannelId;
      if (!actualChannelId) {
        throw new Error('No channel selected');
      }
      const newMessage = await postMessage({ content, channelId: actualChannelId });
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    }
  };

  // Return the hook's API
  return { 
    channels, 
    publicChannels,
    privateChannels,
    messages, 
    userProfile,
    loading, 
    error, 
    selectChannel,
    selectedChannelId,
    setSelectedChannelId,
    sendMessage,
    fetchMessages,
    fetchPublicChannels,
    fetchPrivateChannels
  };
}

export default useAppData;