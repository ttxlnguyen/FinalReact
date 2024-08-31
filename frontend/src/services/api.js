import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// API call for channels
export const getChannels = async () => {
  try {
    const response = await api.get('/channels/1', {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNDk4NDk0MiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzI0ODk4NTQyfQ.xffQj9bQh9rFQOJU8wrxauBNYNDyGHESffSVUUduYg4tcv84_P1NyFsKt0BvCUBmOQJrghsKp0vS2aTvpBtmAQ'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};











// TODO: Update these functions to use real API calls when ready
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

export default api;




// The getChannels function now fetches data from the local JHipster backend.
// TODO: 
// Update getNotifications and getDirectMessages to use real API calls when endpoints are ready.
// Implement error handling and potentially retry logic for failed requests.