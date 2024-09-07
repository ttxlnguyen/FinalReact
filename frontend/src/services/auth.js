import axios from 'axios';
import { validateAndRefreshToken } from './tokenManager';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Authenticates a user and retrieves their profile
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns {Promise<{token: string, userProfile: object}>} The authentication token and user profile
 */
export const login = async (username, password) => {
  try {
    // Send a POST request to the authentication endpoint
    const authResponse = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = authResponse.data.id_token;

    // Store the token in local storage
    localStorage.setItem('jhi-authenticationToken', token);

    // Fetch the user's profile using the token
    const userProfileResponse = await axios.get(`${API_BASE_URL}/user-profiles/username/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const userProfile = userProfileResponse.data;

    // Store the user profile in local storage
    localStorage.setItem('currentUser', JSON.stringify(userProfile));

    return { token, userProfile };
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Registers a new user and logs them in
 * @param {string} username - The user's desired username
 * @param {string} email - The user's email address
 * @param {string} password - The user's desired password
 * @returns {Promise<{token: string, userProfile: object}>} The authentication token and user profile
 */
export const register = async (username, email, password) => {
  try {
    // Register the user with JHipster's User entity
    await axios.post(`${API_BASE_URL}/register`, { login: username, email, password });

    // After successful registration, log in to get the token
    const authResponse = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = authResponse.data.id_token;

    // Store the token in local storage
    localStorage.setItem('jhi-authenticationToken', token);

    // Create a UserProfile
    const userProfileResponse = await axios.post(`${API_BASE_URL}/user-profiles`, 
      { username, email, password },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const userProfile = userProfileResponse.data;

    // Store the user profile in local storage
    localStorage.setItem('currentUser', JSON.stringify(userProfile));

    return { token, userProfile };
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    // If the error is due to the user already existing, try to log in
    if (error.response && error.response.status === 400 && error.response.data.title === 'Login name already used!') {
      try {
        const { token, userProfile } = await login(username, password);
        return { token, userProfile };
      } catch (loginError) {
        console.error('Login after registration failed:', loginError.response ? loginError.response.data : loginError.message);
        throw loginError;
      }
    }
    throw error;
  }
};

/**
 * Logs out the current user by removing their token and profile from local storage
 */
export const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
  localStorage.removeItem('currentUser');
};

/**
 * Checks if a user is currently authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('jhi-authenticationToken') && !!localStorage.getItem('currentUser');
};

/**
 * Retrieves the current authentication token from local storage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

/**
 * Retrieves the current user's profile from local storage
 * @returns {object|null} The user profile object or null if not found
 */
export const getCurrentUser = () => {
  const userString = localStorage.getItem('currentUser');
  return userString ? JSON.parse(userString) : null;
};

/**
 * Checks the current authentication status and refreshes the token if needed
 * @returns {Promise<{isAuthenticated: boolean, currentUser: object|null}>} The current authentication status and user profile
 */
export const checkAuthStatus = async () => {
  const { isValid, token, userProfile } = await validateAndRefreshToken();
  return { isAuthenticated: isValid, currentUser: userProfile };
};