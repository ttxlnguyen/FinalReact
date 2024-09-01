import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for CORS with credentials
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Received response from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API call error:', error.response.data);
    } else {
      console.error('API call error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Simple function to make API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const config = {
      method,
      url: endpoint,
    };

    if (body) {
      config.data = body;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error('API call error:', error.message);
    throw error;
  }
};

// API functions
export const getAccount = () => apiCall('/account');
export const getChannels = () => apiCall('/channels');
export const getChannel = (id) => apiCall(`/channels/${id}`);
export const getMessages = () => apiCall('/messages');
export const getMessage = (id) => apiCall(`/messages/${id}`);
export const getChannelMessages = (channelId) => apiCall(`/messages?channelId=${channelId}`);
export const sendMessage = (channelId, content) => apiCall('/messages', 'POST', { channelId, content });
export const getUsers = () => apiCall('/users');

export default {
  getAccount,
  getChannels,
  getChannel,
  getMessages,
  getMessage,
  getChannelMessages,
  sendMessage,
  getUsers,
};