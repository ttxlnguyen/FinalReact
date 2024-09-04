import { useState } from 'react';
import { login, register, checkAuthStatus } from '../../services/auth';

export function useLogin(onLoginSuccess) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await register(formData.username, formData.email, formData.password);
        alert('Registration successful! Please log in with your new credentials.');
        setIsRegistering(false);
      } else {
        console.log('Attempting login with:', formData);
        const token = await login(formData.username, formData.password);
        console.log('Login successful, token:', token);
        const authStatus = await checkAuthStatus();
        console.log('Auth status after login:', authStatus);
        onLoginSuccess(token);
      }
    } catch (err) {
      setError(isRegistering ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.');
      console.error('Login/Register error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
    }
  };

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return {
    formData,
    setFormData,
    error,
    handleSubmit,
    handleChange,
    isRegistering,
    setIsRegistering,
    toggleRegistration
  };
}

/**
 * Changes made for debugging:
 * 1. Added more detailed logging in the handleSubmit function to see the exact form data being submitted.
 * 2. Included more comprehensive error logging to capture different types of errors.
 * 3. Kept the async nature of checkAuthStatus call.
 */
