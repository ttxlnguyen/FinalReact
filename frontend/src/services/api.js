import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function to make authenticated API calls
const authenticatedGet = async (endpoint) => {
  try {
    const response = await api.get(endpoint, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNDk4NDk0MiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzI0ODk4NTQyfQ.xffQj9bQh9rFQOJU8wrxauBNYNDyGHESffSVUUduYg4tcv84_P1NyFsKt0BvCUBmOQJrghsKp0vS2aTvpBtmAQ'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// API call for channels
export const getChannels = () => authenticatedGet('/channels/1');

// API call for notifications (placeholder for future implementation)
export const getNotifications = async () => {
  // TODO: Replace with actual API call when endpoint is ready
  console.log('Notifications API call not yet implemented');
  return [];
};

// API call for messages (placeholder for future implementation)
export const getMessages = async () => {
  // TODO: Replace with actual API call when endpoint is ready
  console.log('Messages API call not yet implemented');
  return [];
};

export default api;

// When we have the .jsx files for messages and notifications:
// Update the getNotifications and getMessages functions to use authenticatedGet with the appropriate endpoints.

// TODO: 
// Implement proper token management instead of hardcoding the token.
// Add error handling and potentially retry logic for failed requests.
// Consider adding an interceptor to refresh the token if it expires.