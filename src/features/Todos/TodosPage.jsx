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
        throw new Error('Failed to add todo');
      }
    } catch (error) {
      // remove the failed todo from the list and set an error message
      setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
      setError(error);
    } finally {
      setIsTodoListLoading(false);
    }
  }

  async function completeTodo(id) {
    let originalTodo;
    setTodoList((previousTodoList) => {
      return previousTodoList.map((todo) => {
        if (todo.id === id) {
          originalTodo = todo;
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: true }),
        headers: {
          'X-CSRF-TOKEN': token,
        },
      });
      if (response.status !== 200) {
        throw new Error('Error completing todo');
      }
    } catch (error) {
      // on failure to PATCH todo as completed, rollback to the original todo and set error message
      setTodoList((previousTodoList) => {
        return previousTodoList.map((todo) => {
          if (todo.id === originalTodo.id) {
            return { ...todo, isCompleted: false };
          }
          return todo;
        });
      });
      setError(error);
    }
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
