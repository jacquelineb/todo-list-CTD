import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <h2>Error 404 - Page not found.</h2>
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
    </div>
  );
}

export default NotFoundPage;
