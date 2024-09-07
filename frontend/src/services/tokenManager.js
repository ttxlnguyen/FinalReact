import axios from 'axios';
import { getAuthToken, getCurrentUser, login, logout } from './auth';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Validates the current token and refreshes it if needed
 * @returns {Promise<{isValid: boolean, token: string|null, userProfile: object|null}>}
 */
export const validateAndRefreshToken = async () => {
  try {
    // Get the current token and user from local storage
    const token = getAuthToken();
    const currentUser = getCurrentUser();

    // If there's no token or user, they're not authenticated
    if (!token || !currentUser) {
      console.log('User is not authenticated. Please log in.');
      return { isValid: false, token: null, userProfile: null };
    }

    // Attempt to use the token to fetch user data
    try {
      const response = await axios.get(`${API_BASE_URL}/user-profiles/username/${currentUser.username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // If the request is successful, the token is still valid
      console.log('Token is valid');
      return { isValid: true, token, userProfile: response.data };
    } catch (error) {
      // If we get a 401 error, the token is invalid or expired
      if (error.response && error.response.status === 401) {
        console.log('Token is invalid or expired. Attempting to refresh...');

        // Attempt to refresh the token by re-authenticating
        try {
          const { token: newToken, userProfile } = await login(currentUser.username, currentUser.password);
          console.log('Token refreshed successfully');
          return { isValid: true, token: newToken, userProfile };
        } catch (loginError) {
          console.error('Failed to refresh token:', loginError);
          // If we can't refresh the token, log the user out
          logout();
          return { isValid: false, token: null, userProfile: null };
        }
      } else {
        // If we get any other error, consider it an authentication failure
        console.error('Error validating token:', error);
        return { isValid: false, token: null, userProfile: null };
      }
    }
  } catch (error) {
    console.error('Error in validateAndRefreshToken:', error);
    return { isValid: false, token: null, userProfile: null };
  }
};

/**
 * Token Manager Process:
 * 1. validateAndRefreshToken is called to check the current authentication status.
 * 2. It retrieves the current token and user from local storage.
 * 3. If there's no token or user, it returns an invalid status.
 * 4. It attempts to use the token to fetch the user's profile.
 * 5. If successful, it returns a valid status with the current token and user profile.
 * 6. If it receives a 401 error (unauthorized), it attempts to refresh the token:
 *    a. It calls the login function with the stored credentials.
 *    b. If successful, it returns a valid status with the new token and user profile.
 *    c. If unsuccessful, it logs the user out and returns an invalid status.
 * 7. For any other errors, it returns an invalid status.
 * 
 * This process ensures that the token is always valid when the user is interacting with the application,
 * automatically refreshing it if it expires, and logging the user out if it can't be refreshed.
 */
