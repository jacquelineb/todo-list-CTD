import { Link } from 'react-router';
function NotFoundPage() {
  return (
    <div>
      <h2>Error 404 - Page not found.</h2>
      <div>
        <Link to='/'>Return to homepage</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
