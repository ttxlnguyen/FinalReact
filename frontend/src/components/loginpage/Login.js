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

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData({ ...formData, [name]: value });
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
   try {
     // The login function now returns both token and userProfile
     const { token, userProfile } = await login(formData.username, formData.password);
     
     // You can use the userProfile data here if needed
     console.log('User profile:', userProfile);
     
     // Call onLoginSuccess with the user profile data
     onLoginSuccess(userProfile);
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
     const errorMessage = error.response && error.response.data && error.response.data.detail
       ? error.response.data.detail
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
   handleChange,
   isRegistering,
   setIsRegistering,
   registrationError,
   handleRegister,
   toggleRegistration
 };
}

// Add comments to explain the changes
/**
 * Changes made to address the user profile login issue:
 * 1. Updated the handleSubmit function to destructure the return value of the login function,
 *    which now includes both the token and the userProfile.
 * 2. Added a console.log to demonstrate how to access the userProfile data after login.
 * 3. Modified the onLoginSuccess call to include the userProfile data, allowing the parent
 *    component to access and use this information as needed.
 * 
 * These changes ensure that the user profile data is properly fetched and made available
 * upon successful login, addressing the issue of not being able to use user-profile data for login.
 */
