import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email } = useAuth();

  // TODO: fetch todo statistics from API to display total/completed/active accounts. Will probably need token from useAuth
  // Then display this information on page

  return (
    <div>
      <p>Welcome back, {email}</p>
    </div>
  );
}

export default ProfilePage;
