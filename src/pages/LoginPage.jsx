import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

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
    <>
      {authError ? <div>{authError}</div> : null}
      <form onSubmit={handleSubmit}>
        <label htmlFor='user-email'>Email</label>
        <input
          type='text'
          id='user-email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor='user-password'>Password</label>
        <input
          type='password'
          id='user-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit' disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </>
  );
}

export default LoginPage;
