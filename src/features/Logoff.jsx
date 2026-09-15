import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './Logoff.module.css';

function Logoff() {
  const [error, setError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);
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
    <>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.logoffBtn} type='button' onClick={handleLogoff}>
        <span>Log Off</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
        >
          <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
          <path d='M9 12h12l-3 -3' />
          <path d='M18 15l3 -3' />
        </svg>
      </button>
    </>
  );
}

export default Logoff;
