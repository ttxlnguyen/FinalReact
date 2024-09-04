import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', { username, password });
    const response = await axios.post(`${API_BASE_URL}/authenticate`, { username, password, rememberMe: true });
    console.log('Login response:', response.data);
    const token = response.data.id_token;
    localStorage.setItem('jhi-authenticationToken', token);
    return token;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { login: username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('jhi-authenticationToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }
    const response = await axios.get(`${API_BASE_URL}/account`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  const token = getAuthToken();
  const currentUser = await getCurrentUser();
  console.log('Auth Token:', token);
  console.log('Current User:', currentUser);
  return { isAuthenticated: !!token, currentUser };
};

/**
 * Changes made for debugging:
 * 1. Added more detailed logging in the login function to see the exact request payload and response.
 * 2. Included full error object logging for more comprehensive error information.
 */
