import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages, getMessagesByChannel, postMessage, getUserProfile } from '../services/api';
import { isAuthenticated } from '../services/auth';

function useAppData() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async () => {
    try {
      const channelsData = await getChannels();
      setChannels(channelsData);
    } catch (err) {
      setError('Failed to fetch channels: ' + err.message);
    }
  }, []);

  const fetchMessages = useCallback(async (channelId = null) => {
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
  }, []);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const profileData = await getUserProfile(userId);
      setUserProfile(profileData);
    } catch (err) {
      setError('Failed to fetch user profile: ' + err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchChannels();
      fetchMessages();
      // Assuming you have a way to get the current user's ID
      const currentUserId = 1; // Replace this with the actual way to get the current user's ID
      fetchUserProfile(currentUserId);
    }
  }, [fetchChannels, fetchMessages, fetchUserProfile]);

  useEffect(() => {
    if (selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [selectedChannelId, fetchMessages]);

  const selectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  const sendMessage = async (content) => {
    try {
      const newMessage = await postMessage({ content, channelId: selectedChannelId });
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