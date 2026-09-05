import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logon() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');
    setIsLoggingOn(true);
    const response = await login(email, password);
    if (!response.success) {
      setAuthError(response.error);
    }
    setIsLoggingOn(false);
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

export default Logon;
