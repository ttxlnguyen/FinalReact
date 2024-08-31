import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages } from '../services/api';
import { isAuthenticated } from '../services/auth';

function useAppData() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
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

  const fetchMessages = useCallback(async (channelId) => {
    if (!channelId) return;
    try {
      const messagesData = await getMessages(channelId);
      setMessages(messagesData);
    } catch (err) {
      setError('Failed to fetch messages: ' + err.message);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchChannels().finally(() => setLoading(false));
  }, [fetchChannels]);

  useEffect(() => {
    if (selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [selectedChannelId, fetchMessages]);

  const selectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  return { 
    channels, 
    messages, 
    loading, 
    error, 
    selectChannel,
    selectedChannelId
  };
}

export default useAppData;