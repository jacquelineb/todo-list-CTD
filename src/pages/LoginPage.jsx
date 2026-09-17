import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from location state, default to /todos
  const from = location.state?.from || '/todos';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');
    setIsLoggingOn(true);
    try {
      const response = await login(email, password);
      if (!response.success) {
        setAuthError(response.error);
      }
    } catch (error) {
      setAuthError(`Error: ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <h2>Log In</h2>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor='user-email'>Email</label>
          <input
            type='email'
            id='user-email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength='254'
            required
          />
        </div>
        <div>
          <label htmlFor='user-password'>Password</label>
          <input
            type='password'
            id='user-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength='100'
            required
          />
        </div>
        <button type='submit' disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
      {authError ? <div className={styles.loginError}>{authError}</div> : null}
    </div>
  );
}

export default LoginPage;
