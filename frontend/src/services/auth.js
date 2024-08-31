import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = response.data.id_token;
    if (token) {
      localStorage.setItem('jhi-authenticationToken', token);
      return token;
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  login,
  logout,
  getAuthToken,
  isAuthenticated
};