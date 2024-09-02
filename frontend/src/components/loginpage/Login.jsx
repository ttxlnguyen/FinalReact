import React from 'react';
import { useLogin } from './Login';
import './Login.css';

function Login({ onLoginSuccess }) {
  const {
    formData,
    setFormData,
    error,
    isRegistering,
    registrationError,
    handleSubmit,
    handleRegister,
    toggleRegistration
  } = useLogin(onLoginSuccess);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
                    <button type="button" onClick={toggleRegistration}>Back to Login</button>
                  </>
                ) : (
                  <>
                    <button type="submit" onClick={handleSubmit}>Login</button>
                    <button type="button" onClick={toggleRegistration}>Register</button>
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