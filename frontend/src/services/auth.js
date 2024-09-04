import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    // First, authenticate to get the JWT token
    const authResponse = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = authResponse.data.id_token;

    // Store the JWT token
    localStorage.setItem('jhi-authenticationToken', token);

    // Now, fetch the user profile using the token
    const userProfileResponse = await axios.get(`${API_BASE_URL}/user-profiles/username/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const userProfile = userProfileResponse.data;

    // Store the user profile
    localStorage.setItem('currentUser', JSON.stringify(userProfile));

    return { token, userProfile };
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
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
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('jhi-authenticationToken') && !!localStorage.getItem('currentUser');
};

export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('currentUser');
  return userString ? JSON.parse(userString) : null;
};

export const checkAuthStatus = () => {
  const token = getAuthToken();
  const currentUser = getCurrentUser();
  console.log('Auth Token:', token);
  console.log('Current User:', currentUser);
  return { isAuthenticated: isAuthenticated(), currentUser };
};

/**
 * 1. Updated login function to first authenticate and get a JWT token.
 * 2. Using the JWT token to fetch the user profile.
 * 3. Storing both the JWT token and the full user profile in localStorage.
 * 4. Kept improved error logging in login and register functions.
 */
