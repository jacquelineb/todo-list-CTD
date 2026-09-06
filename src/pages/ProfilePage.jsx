import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email } = useAuth();

  return (
    <div>
      <p>Welcome back, {email}</p>
      <p>
        TODO: fetch todo statistics from API to display total/completed/active accounts. Will
        probably need token from useAuth Then display this information on page
      </p>
    </div>
  );
}

export default ProfilePage;
