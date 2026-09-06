import { Link } from 'react-router';
function NotFoundPage() {
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
      </ul>
    </div>
  );
}

export default NotFoundPage;
