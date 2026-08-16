import { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
      try {
        const params = new URLSearchParams({
          limit: 100,
        });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        const result = await response.json();
        if (response.status === 200) {
          setTodoList(result.tasks);
        } else if (response.status === 401) {
          throw new Error(response.status);
        } else {
          throw new Error('Error fetching todos.');
        }
      } catch (error) {
        setError(`Error: ${error.name} | ${error.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };
    setTodoList((previous) => [newTodo, ...previous]);
    setIsTodoListLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (response.status === 201) {
        const result = await response.json();
        // replace the temp todo with the real todo from the server response
        setTodoList((previous) => {
          return previous.map((todo) => {
            if (todo.id === newTodo.id) {
              return result;
            }
            return todo;
          });
        });
      } else {
        // remove the failed todo from the list and set an error message
        setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
        setError('Failed to add todo');
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsTodoListLoading(false);
    }
  }

  function completeTodo(id) {
    setTodoList((previousTodoList) => {
      return previousTodoList.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
    });
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  );
}

export default TodosPage;
