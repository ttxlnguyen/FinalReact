// This file will be used for setting up API calls to the JHipster backend in the future.
// When you're ready to integrate with JHipster, uncomment and modify the code below as needed.

/*
import axios from 'axios';

// TODO: Update this with your JHipster backend URL when ready
const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Example API calls - modify these to match your JHipster API endpoints
export const getChannels = () => api.get('/channels');
export const getNotifications = () => api.get('/notifications');
export const getDirectMessages = () => api.get('/messages');

export default api;
*/

// For now, you can use this file to define mock data or placeholder functions
// that will be replaced with actual API calls in the future.

export const getChannels = () => {
  // Return mock data for now
  return Promise.resolve([
    { id: 1, name: 'general' },
    { id: 2, name: 'random' },
    { id: 3, name: 'project-a' },
    { id: 4, name: 'project-b' },
  ]);
};

export const getNotifications = () => {
  // Return mock data for now
  return Promise.resolve([
    { id: 1, message: 'New message in #general' },
    { id: 2, message: '@mention in #project-a' },
    { id: 3, message: 'New direct message from Tim' },
    { id: 4, message: 'Reply in thread #random' },
  ]);
};

export const getDirectMessages = () => {
  // Return mock data for now
  return Promise.resolve([
    { id: 1, name: 'Tim', unread: 2 },
    { id: 2, name: 'Corye', unread: 0 },
    { id: 3, name: 'Will', unread: 0 },
    { id: 4, name: 'Ian', unread: 1 },
  ]);
};

// TODO: When ready to integrate with JHipster:
// 1. Install axios: npm install axios
// 2. Uncomment the axios import and API setup code at the top of this file
// 3. Update the API_BASE_URL to match your JHipster backend URL
// 4. Modify the API call functions to match your JHipster API endpoints
// 5. Remove the mock data functions and use the actual API calls in your components