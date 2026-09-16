import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './NotFound.module.css';

function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <div className={styles.notFoundPage}>
      <h2>Error 404</h2>
      <h3>Page not found</h3>
      <p className={styles.description}>
        The requested URL <span className={styles.pathname}>{location.pathname}</span> does not
        exist.
      </p>
      <p>Here are some helpful links to get back on task.</p>
      <nav>
        <ul>
          <li>
            <Link to='/'>Return Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to='/todos'>Todos</Link>
              </li>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to='/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NotFoundPage;
