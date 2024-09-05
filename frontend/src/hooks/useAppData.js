import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages, getMessagesByChannel, postMessage, getUserProfile } from '../services/api';
import { getCurrentUser } from '../services/auth';

function useAppData(isLoggedIn) {
  const [channels, setChannels] = useState([]);
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
    }
  }, [isLoggedIn, fetchChannels, fetchMessages, fetchUserProfile]);

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
    messages, 
    userProfile,
    loading, 
    error, 
    selectChannel,
    selectedChannelId,
    setSelectedChannelId,
    sendMessage,
    fetchMessages
  };
}

export default useAppData;

/**
 * Changes made to address authentication issues:
 * 1. Added isLoggedIn as a parameter to useAppData.
 * 2. Added isLoggedIn checks before performing any API calls.
 * 3. Removed the isAuthenticated import and rely on the isLoggedIn prop.
 * 4. Updated the fetchUserProfile function to use the getUserProfile from api.js.
 * 5. Set initial loading state to false to prevent unnecessary loading indicators.
 */