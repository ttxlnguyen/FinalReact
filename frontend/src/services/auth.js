import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    const authResponse = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = authResponse.data.id_token;

    localStorage.setItem('jhi-authenticationToken', token);

    const userProfileResponse = await axios.get(`${API_BASE_URL}/user-profiles/username/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const userProfile = userProfileResponse.data;

    localStorage.setItem('currentUser', JSON.stringify(userProfile));

    return { token, userProfile };
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    // First, register the user with JHipster's User entity
    await axios.post(`${API_BASE_URL}/register`, { login: username, email, password });

    // After successful registration, log in to get the token
    const authResponse = await axios.post(`${API_BASE_URL}/authenticate`, { username, password });
    const token = authResponse.data.id_token;

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
 * Changes made to fix registration:
 * 1. Updated register function to handle the creation of both User and UserProfile more explicitly.
 * 2. Added error handling to attempt login if the user already exists.
 * 3. Removed the separate login call and integrated it into the register function.
 * 4. Added more detailed error logging for registration and login failures.
 */
