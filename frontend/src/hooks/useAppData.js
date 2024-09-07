import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages, getMessagesByChannel, postMessage, getUserProfile, getPublicChannelsByUsername, getPrivateChannelsByUsername } from '../services/api';
import { getCurrentUser } from '../services/auth';

function useAppData(isLoggedIn) {
  const [channels, setChannels] = useState([]);
  // State for storing public channels
  const [publicChannels, setPublicChannels] = useState([]);
  // State for storing private channels
  const [privateChannels, setPrivateChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Function to fetch public channels for a specific user
  const fetchPublicChannels = useCallback(async (username) => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      // Call the API function to get public channels
      const publicChannelsData = await getPublicChannelsByUsername(username);
      // Update the state with the fetched public channels
      setPublicChannels(publicChannelsData);
    } catch (err) {
      setError('Failed to fetch public channels: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Function to fetch private channels for a specific user
  const fetchPrivateChannels = useCallback(async (username) => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      // Call the API function to get private channels
      const privateChannelsData = await getPrivateChannelsByUsername(username);
      // Update the state with the fetched private channels
      setPrivateChannels(privateChannelsData);
    } catch (err) {
      setError('Failed to fetch private channels: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

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

  const fetchUserProfile = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (err) {
      setError('Failed to fetch user profile: ' + err.message);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchChannels();
      fetchMessages();
      fetchUserProfile();
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.username) {
        // Fetch both public and private channels when the user is logged in
        fetchPublicChannels(currentUser.username);
        fetchPrivateChannels(currentUser.username);
      }
    }
  }, [isLoggedIn, fetchChannels, fetchMessages, fetchUserProfile, fetchPublicChannels, fetchPrivateChannels]);

  useEffect(() => {
    if (isLoggedIn && selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [isLoggedIn, selectedChannelId, fetchMessages]);

  const selectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  const sendMessage = async (content, channelId = null) => {
    if (!isLoggedIn) return;
    console.log(channelId);
    try {
      if(selectedChannelId != undefined) {
        channelId = selectedChannelId;}
      const newMessage = await postMessage({ content, channelId });
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    }
  };

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