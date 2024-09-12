import { useState } from 'react';
import { login, register, checkAuthStatus } from '../../services/auth';

export function useLogin(onLoginSuccess) {
  // State for form data, errors, and registration mode
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', formData);
      // Call the login function from auth.js
      const result = await login(formData.username, formData.password);
      console.log('Login successful, user profile:', result.userProfile);
      // Check authentication status after login
      const authStatus = await checkAuthStatus();
      console.log('Auth status after login:', authStatus);
      // Call the onLoginSuccess callback with the token
      onLoginSuccess(result.token);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
      logError(err);
    }
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    try {
      console.log('Attempting registration with:', formData);
      // Call the register function from auth.js
      const result = await register(formData.username, formData.email, formData.password);
      console.log('Registration successful, user profile:', result.userProfile);
      // Check authentication status after registration
      const authStatus = await checkAuthStatus();
      console.log('Auth status after registration:', authStatus);
      // Call the onLoginSuccess callback with the token
      onLoginSuccess(result.token);
    } catch (err) {
      setRegistrationError('Registration failed. Please try again.');
      console.error('Registration error:', err);
      logError(err);
    }
  };

  // New function to handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRegistering) {
        handleRegister(e);
      } else {
        handleSubmit(e);
      }
    }
  };

  // Toggle between login and registration forms
  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setRegistrationError('');
  };

  // Log detailed error information for debugging
  const logError = (err) => {
    if (err.response) {
      console.error('Error response:', err.response.data);
      console.error('Error status:', err.response.status);
      console.error('Error headers:', err.response.headers);
    } else if (err.request) {
      console.error('Error request:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
  };

  // Return all necessary state and functions for the login component
  return {
    formData,
    setFormData,
    error,
    registrationError,
    handleSubmit,
    handleRegister,
    handleChange,
    handleKeyPress,
    isRegistering,
    setIsRegistering,
    toggleRegistration
  };
}

/**
 * Login Process:
 * 1. User enters credentials in the login form.
 * 2. handleSubmit is called when the form is submitted or Enter key is pressed.
 * 3. login function from auth.js is called with the username and password.
 * 4. If login is successful, onLoginSuccess is called with the token.
 * 5. If login fails, an error message is displayed.
 * 
 * Registration Process:
 * 1. User enters details in the registration form.
 * 2. handleRegister is called when the form is submitted or Enter key is pressed.
 * 3. register function from auth.js is called with the username, email, and password.
 * 4. If registration is successful, onLoginSuccess is called with the token.
 * 5. If registration fails, an error message is displayed.
 * 
 * Both processes use checkAuthStatus to verify the authentication state after login/registration.
 */