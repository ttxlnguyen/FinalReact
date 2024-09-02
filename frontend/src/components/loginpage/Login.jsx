import React from 'react';
import { useLogin } from './Login';
import './Login.css';

function Login({ onLoginSuccess }) {
  const { username, setUsername, password, setPassword, error, handleSubmit } = useLogin(onLoginSuccess);

  return (
    <div className="login-container">
      <table className="login-table">
        <tbody>
          <tr>
            <td colSpan="2">
              <h2>Login</h2>
              {error && <p className="error-message">{error}</p>}
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
                <button type="submit" onClick={handleSubmit}>Login</button>
                <button type="button" className="register-button">Register</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Login;