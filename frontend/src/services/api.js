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
    }
    console.log('Current user:', currentUser.username);
    const response = await axiosInstance.get(`/user-profiles/username/${currentUser.username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error fetching user profile:');
  }
};

// Function to fetch public channels for a specific user
// This function makes a GET request to the /channels/user-profile/{username} endpoint
// It returns an array of public channels accessible to the user
export const getPublicChannelsByUsername = async (username) => { 
  try {
    const response = await axiosInstance.get(`/channels/user-profile/${username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching public channels for user ${username}:`);
  }
};

// Function to fetch private channels for a specific user
// This function makes a GET request to the /channels/userdms/{username} endpoint
// It returns an array of private channels (direct messages) for the user
export const getPrivateChannelsByUsername = async (username) => { 
  try {
    const response = await axiosInstance.get(`/channels/userdms/${username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching private channels for user ${username}:`);
  }
};

export default {
  getMessages,
  getMessagesByChannel,
  postMessage,
  getChannels,
  getChannel,
  getUserProfile,
  getPublicChannelsByUsername,
  getPrivateChannelsByUsername,
};
