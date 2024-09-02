import { useState } from 'react';
import { login, register } from '../../services/auth';

export function useLogin(onLoginSuccess) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.username, formData.password);
      onLoginSuccess();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    try {
      await register(formData.username, formData.email, formData.password);
      setIsRegistering(false);
      setFormData(prevData => ({ ...prevData, email: '' }));
      alert('Registration successful! Please log in with your new credentials.');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Registration failed. Please try again.';
      setRegistrationError(errorMessage);
    }
  };

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setRegistrationError('');
  };

  return {
    formData,
    setFormData,
    error,
    handleSubmit,
    isRegistering,
    setIsRegistering,
    registrationError,
    handleRegister,
    toggleRegistration
  };
}
