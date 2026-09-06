import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, token } = useAuth();

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const result = await response.json();
        const todos = result.tasks;

        // Calculate statistics
        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <h2>Welcome back, {email}</h2>
              <section>
                <h3>Statistics</h3>
                <ul>
                  <li>Total Todos: {todoStats.total}</li>
                  <li>Completed Todos: {todoStats.completed}</li>
                  <li>Active Todos: {todoStats.active}</li>
                </ul>
                {todoStats.total > 0 && (
                  <p>
                    `Completion Percentage: ${(todoStats.completed / todoStats.total) * 100}%`
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ProfilePage;
