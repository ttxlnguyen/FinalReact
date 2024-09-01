import { useState, useEffect, useCallback } from 'react';
import { getChannels, getMessages, getChannelMessages, sendMessage as apiSendMessage, getUsers } from '../services/api';
import { isAuthenticated } from '../services/auth';

function useAppData() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
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

  const fetchMessages = useCallback(async (channelId = null) => {
    try {
      setLoading(true);
      let messagesData;
      if (channelId) {
        messagesData = await getChannelMessages(channelId);
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

  const fetchUsers = useCallback(async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchChannels();
      fetchMessages();
      fetchUsers();
    }
  }, [fetchChannels, fetchMessages, fetchUsers]);

  useEffect(() => {
    if (selectedChannelId) {
      fetchMessages(selectedChannelId);
    }
  }, [selectedChannelId, fetchMessages]);

  const selectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  const sendMessage = async (channelId, content) => {
    try {
      const newMessage = await apiSendMessage(channelId, content);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    }
  };

  return { 
    channels, 
    messages, 
    users,
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