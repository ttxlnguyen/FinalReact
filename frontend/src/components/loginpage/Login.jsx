import React, { useState } from 'react';
import { useLogin } from './Login';
import { register } from '../../services/auth';
import './Login.css';

function Login({ onLoginSuccess }) {
  const { username, setUsername, password, setPassword, error, handleSubmit } = useLogin(onLoginSuccess);
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Attempting registration...');
    try {
      await register(username, email, password);
      console.log('Registration successful');
      setIsRegistering(false);
      setRegistrationError('');
      alert('Registration successful! Please log in with your new credentials.');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Registration failed. Please try again.';
      setRegistrationError(errorMessage);
    }
  };

  const wrappedHandleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login...');
    try {
      await handleSubmit(e);
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <table className="login-table">
        <tbody>
          <tr>
            <td colSpan="2">
              <h2>{isRegistering ? 'Register' : 'Login'}</h2>
              {error && <p className="error-message">{error}</p>}
              {registrationError && <p className="error-message">{registrationError}</p>}
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="username">Username:</label>
            </td>
            <td>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </td>
          </tr>
          {isRegistering && (
            <tr>
              <td>
                <label htmlFor="email">Email:</label>
              </td>
              <td>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
          )}
          <tr>
            <td>
              <label htmlFor="password">Password:</label>
            </td>
            <td>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="button-container">
                {isRegistering ? (
                  <>
                    <button type="submit" onClick={handleRegister}>Register</button>
                    <button type="button" onClick={() => {
                      setIsRegistering(false);
                      setRegistrationError('');
                    }}>Back to Login</button>
                  </>
                ) : (
                  <>
                    <button type="submit" onClick={wrappedHandleSubmit}>Login</button>
                    <button type="button" onClick={() => {
                      setIsRegistering(true);
                      setRegistrationError('');
                    }}>Register</button>
                  </>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Login;