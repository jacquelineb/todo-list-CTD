import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './Header.module.css';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <div className={styles.header}>
      <h1>Todo List</h1>
      <div className={styles.spaceBetween}>
        <Navigation />
        {isAuthenticated ? <Logoff /> : null}
      </div>
    </div>
  );
}

export default Header;
