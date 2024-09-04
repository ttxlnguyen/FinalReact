import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('jhi-authenticationToken');

export const getUserProfileById = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-profiles/username/${username}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': '*/*'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Function to log in a user
export const login = async (username, password) => {
  try {
    // Fetch user profile and authenticate in one step
    const response = await axios.get(`${API_BASE_URL}/user-profiles/username/${username}`, {
      auth: {
        username: username,
        password: password
      }
    });

    const userProfileData = response.data;

    // Use the id from the user profile as the token
    const token = userProfileData.id.toString();

    // Store the token and user profile data
    localStorage.setItem('jhi-authenticationToken', token);
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));

    return { token, userProfile: userProfileData };
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to register a new user
export const register = async (username, email, password) => {
  try {
    if (!username || !email || !password) {
      throw new Error("Missing required fields: username, email, or password");
    }

    const payload = { username, email, password };
    console.log("Register payload:", payload); // For debugging purposes

    const response = await axios.post(`${API_BASE_URL}/register`, payload);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to retrieve the auth token
export const getAuthToken = () => {
  return localStorage.getItem('jhi-authenticationToken');
};

// Function to retrieve the user profile
export const getUserProfile = () => {
  const userProfileString = localStorage.getItem('userProfile');
  return userProfileString ? JSON.parse(userProfileString) : null;
};

// Function to log out a user
export const logout = () => {
  localStorage.removeItem('jhi-authenticationToken');
  localStorage.removeItem('userProfile');
};

