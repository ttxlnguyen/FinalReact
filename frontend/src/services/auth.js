import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    console.log('Attempting login with username:', username);
    const response = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    console.log('Login response:', response);
    const token = response.data.id_token;
    if (token) {
      localStorage.setItem('jhi-authenticationToken', token);
      console.log('Login successful, token stored');
      return token;
    } else {
      console.error('Authentication failed: No token received');
      throw new Error('Authentication failed: No token received');
    }
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
  console.log('Logged out, token removed');
};

export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Updated registration function with more logging
export const register = async (username, email, password) => {
  try {
    console.log('Attempting registration with username:', username, 'and email:', email);
    const response = await axios.post(`${API_BASE_URL}/register`, {
      login: username,
      email: email,
      password: password,
      langKey: 'en' // Set the language key to English by default
    });
    console.log('Registration response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default {
  login,
  logout,
  getAuthToken,
  isAuthenticated,
  register
};