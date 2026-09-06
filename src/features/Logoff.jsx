import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const [error, setError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState('false');
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }
  return (
    <button type='button' onClick={handleLogoff}>
      Log Off
    </button>
  );
}

export default Logoff;
