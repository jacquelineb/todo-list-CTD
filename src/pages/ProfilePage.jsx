import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, token } = useAuth();
  const name = email;

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

        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, options);

        if (response.status === 401) {
          throw new Error('Unauthorized. Please sign back in and try again.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todo list.');
        }

        const result = await response.json();
        const todos = (Array.isArray(result) ? result : result.tasks) || [];

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

  const completionPercentage =
    todoStats.total > 0 ? (todoStats.completed / todoStats.total) * 100 : 0;

  return (
    <div>
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
                <h3>Account Information</h3>
                <p>Name: {name}</p>
                <p>Account Status: Active</p>
              </section>
              <section>
                <h3>Statistics</h3>
                <ul>
                  <li>Total Todos: {todoStats.total}</li>
                  <li>Completed Todos: {todoStats.completed}</li>
                  <li>Active Todos: {todoStats.active}</li>
                </ul>
                <p>Completion Percentage: {completionPercentage.toFixed(1)}%</p>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
