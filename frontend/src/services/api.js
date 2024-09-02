import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getMessages = async () => {
  try {
    const response = await axiosInstance.get('/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getMessagesByChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/messages/channels/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for channel ${channelId}:`, error);
    throw error;
  }
};

export const postMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error posting message:', error);
    throw error;
  }
};

export const getChannels = async () => {
  try {
    const response = await axiosInstance.get('/channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

export const getChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/channels/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user-profiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default {
  getMessages,
  getMessagesByChannel,
  postMessage,
  getChannels,
  getChannel,
  getUserProfile,
};