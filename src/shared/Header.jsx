import Logoff from '../features/Logoff.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <h1>Todo List</h1>
      {isAuthenticated ? <Logoff /> : null}
    </>
  );
}

export default Header;
