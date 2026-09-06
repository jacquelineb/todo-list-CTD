import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname;
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from } }); // not sure if state object in options is correct
    }
  }, [isAuthenticated, navigate, from]);
  return <>{!isAuthenticated ? <div>Loading...</div> : children}</>;
}

export default RequireAuth;
