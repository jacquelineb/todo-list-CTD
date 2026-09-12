import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

function navLinkStyle({ isActive }) {
  return isActive
    ? { fontWeight: 'bold', textDecoration: 'underline' }
    : { textDecoration: 'none' };
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={styles.navigation}>
      <ul>
        <li>
          <NavLink to='/about' style={navLinkStyle}>
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to='/todos' style={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to='/profile' style={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to='/login' style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
