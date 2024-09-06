import axios from 'axios';
import { getAuthToken, getCurrentUser } from './auth';

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

const handleApiError = (error, errorMessage) => {
  console.error(errorMessage, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  }
  throw error;
};

export const getMessages = async () => {
  try {
    const response = await axiosInstance.get('/messages');
    return response.data;
    // return [];
  } catch (error) {
    handleApiError(error, 'Error fetching messages:');
  }
};

export const getMessagesByChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/messages/channels/${channelId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching messages for channel ${channelId}:`);
  }
};

export const postMessage = async (messageData) => {
  try {
    console.log("Im in postMessage");
    console.log("Channel ID: ", messageData.channelId);
    console.log(messageData);
   
    const response = await axiosInstance.post('/messages/channels/' + messageData.channelId, messageData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error posting message:');
  }
};

export const getChannels = async () => {
  try {
    const response = await axiosInstance.get('/channels');
    return response.data;
    // return null;
  } catch (error) {
    handleApiError(error, 'Error fetching channels:');
  }
};

export const getChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/channels/${channelId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching channel ${channelId}:`);
  }
};

export const getUserProfile = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.username) {
      console.log('No current user found, skipping profile fetch');
      return null;
    }console.log('Current' + currentUser.username); 
    const response = await axiosInstance.get(`/user-profiles/username/${currentUser.username}`);
    return response.data;
    // return null; // Placeholder, replace with actual API call
  } catch (error) {
    handleApiError(error, 'Error fetching user profile:');
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

/**
 * Changes made to address authentication issues:
 * 1. Kept the axios interceptor using Bearer token authentication.
 * 2. Ensured all API calls use the axiosInstance with the correct headers.
 * 3. Kept improved error handling and logging for API requests.
 */
