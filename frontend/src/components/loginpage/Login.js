import { useState } from 'react';
import { login, register, checkAuthStatus } from '../../services/auth';

export function useLogin(onLoginSuccess) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', formData);
      const result = await login(formData.username, formData.password);
      console.log('Login successful, user profile:', result.userProfile);
      const authStatus = await checkAuthStatus();
      console.log('Auth status after login:', authStatus);
      onLoginSuccess(result.token);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
      logError(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    try {
      console.log('Attempting registration with:', formData);
      const result = await register(formData.username, formData.email, formData.password);
      console.log('Registration successful, user profile:', result.userProfile);
      const authStatus = await checkAuthStatus();
      console.log('Auth status after registration:', authStatus);
      onLoginSuccess(result.token);
    } catch (err) {
      setRegistrationError('Registration failed. Please try again.');
      console.error('Registration error:', err);
      logError(err);
    }
  };

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setRegistrationError('');
  };

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

  return {
    formData,
    setFormData,
    error,
    registrationError,
    handleSubmit,
    handleRegister,
    handleChange,
    isRegistering,
    setIsRegistering,
    toggleRegistration
  };
}

/**
 * Changes made to fix registration:
 * 1. Added a separate handleRegister function for registration.
 * 2. Added registrationError state to handle registration-specific errors.
 * 3. Updated error handling to set appropriate error messages for login and registration.
 * 4. Kept detailed logging for debugging purposes.
 */
