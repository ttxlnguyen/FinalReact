import axios from 'axios';
import { getAuthToken, getCurrentUser } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add an interceptor to include the auth token in every request
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

// Helper function to handle API errors
const handleApiError = (error, errorMessage) => {
  console.error(errorMessage, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  }
  throw error;
};

// Fetch all messages (seems unused, consider removing if not needed)
export const getMessages = async () => {
  try {
    const response = await axiosInstance.get('/messages');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error fetching messages:');
  }
};

// Fetch messages for a specific channel
export const getMessagesByChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/messages/channels/${channelId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching messages for channel ${channelId}:`);
  }
};

// Post a new message to a channel
export const postMessage = async (messageData) => {
  try {
    console.log("Posting message to channel ID:", messageData.channelId);
    console.log(messageData);

    const response = await axiosInstance.post('/messages/channels/' + messageData.channelId, messageData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error posting message:');
  }
};

// Fetch all channels for the current user (seems unused, consider removing if not needed)
export const getChannels = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.username) {
      console.log('No current user found, skipping channel fetch');
      return null;
    }
    console.log('Current user:', currentUser.username);
    const response = await axiosInstance.get(`/channels/user-profile/${currentUser.username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error fetching channels:');
  }
};

// Fetch a specific channel by ID (seems unused, consider removing if not needed)
export const getChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/channels/${channelId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching channel ${channelId}:`);
  }
};

// Fetch the user profile for the current user
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

// Fetch all public channels
export const getPublicChannels = async () => {
  try {
    const response = await axiosInstance.get('/channels/public');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error fetching public channels:');
  }
};

// Fetch public channels for a specific user
export const getPublicChannelsByUsername = async (username) => { 
  try {
    const response = await axiosInstance.get(`/channels/user-profile/${username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching public channels for user ${username}:`);
  }
};

// Fetch private channels (direct messages) for a specific user
export const getPrivateChannelsByUsername = async (username) => { 
  try {
    const response = await axiosInstance.get(`/channels/userdms/${username}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching private channels for user ${username}:`);
  }
};

// Check if a user exists
export const checkUserExists = async (username) => {
  try {
    const response = await axiosInstance.get(`/user-profiles/username/${username}`);
    return response.status === 200;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    handleApiError(error, `Error checking if user ${username} exists:`);
  }
};

// Create a new private channel and invite another user
export const createPrivateChannel = async (username, invitedUsername) => {
  try {
    console.log(`Creating private channel: ${username} inviting ${invitedUsername}`);
    
    // First, check if the invited user exists
    const userExists = await checkUserExists(invitedUsername);
    if (!userExists) {
      throw new Error(`Invited user ${invitedUsername} does not exist.`);
    }

    // If the invited user exists, proceed with creating the channel
    const channelData = {
      name: invitedUsername,
      privacy: true
    };
    console.log('Sending channel creation request:', channelData);

    const response = await axiosInstance.post(`/channels/username/${username}`, channelData);
    
    console.log('Create Private Channel Response:', response.data);

    // Fetch updated private channels for both users
    const creatorChannels = await getPrivateChannelsByUsername(username);
    const invitedChannels = await getPrivateChannelsByUsername(invitedUsername);

    console.log(`Updated channels for ${username}:`, creatorChannels);
    console.log(`Updated channels for ${invitedUsername}:`, invitedChannels);

    return response.data;
  } catch (error) {
    handleApiError(error, `Error creating private channel for user ${username}:`);
  }
};

// Create a new public channel
export const createPublicChannel = async (username, channelName) => {
  try {
    console.log(`Creating public channel: ${channelName} by user ${username}`);

    const channelData = {
      name: channelName,
      privacy: false
    };
    console.log('Sending public channel creation request:', channelData);

    const response = await axiosInstance.post(`/channels/username/public`, channelData);
    
    console.log('Create Public Channel Response:', response.data);

    // Fetch updated public channels
    const updatedPublicChannels = await getPublicChannels();
    console.log(`Updated public channels:`, updatedPublicChannels);

    return response.data;
  } catch (error) {
    handleApiError(error, `Error creating public channel ${channelName} for user ${username}:`);
  }
};

// Export all functions as a default object
export default {
  getMessages,
  getMessagesByChannel,
  postMessage,
  getChannels,
  getChannel,
  getUserProfile,
  getPublicChannels,
  getPublicChannelsByUsername,
  getPrivateChannelsByUsername,
  createPrivateChannel,
  createPublicChannel,
  checkUserExists,
};