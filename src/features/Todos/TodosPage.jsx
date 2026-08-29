import { useState, useEffect, useCallback, useReducer } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { TODO_ACTIONS, initialTodoState, todoReducer } from '../../reducers/todoReducer.js';

function TodosPage({ token }) {
  // const [todoList, setTodoList] = useState([]);
  // const [error, setError] = useState('');
  // const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  // const [sortBy, setSortBy] = useState('createdAt');
  // const [sortDirection, setSortDirection] = useState('desc');
  // const [filterTerm, setFilterTerm] = useState('');
  // const [dataVersion, setDataVersion] = useState(0);
  // const [filterError, setFilterError] = useState('');
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    async function fetchTodos() {
      // setIsTodoListLoading(true);
      dispatch({ type: TODO_ACTIONS.FETCH_START });
      try {
        const paramsObject = { sortBy, sortDirection, limit: 100 };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        const result = await response.json();
        if (response.status === 200) {
          // setTodoList(result.tasks);
          // setFilterError('');
          dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: result.tasks } });
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else {
          throw new Error('Error fetching todos.');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          // setFilterError(`Error filtering/sorting todos: ${error.message}`);
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error filtering/sorting todos: ${error.message}`,
              isFilterError: true,
            },
          });
        } else {
          // setError(`Error fetching todos: ${error.message}`);
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error fetching todos: ${error.message}`,
              isFilterError: false,
            },
          });
        }
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  function handleFilterChange(newFilterTerm) {
    setFilterTerm(newFilterTerm);
  }

  const invalidateCache = useCallback(() => {
    // Logic for invalidating memo cache due to mutation would go here
    setDataVersion((prev) => prev + 1);
  }, []);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };
    // setTodoList((previous) => [newTodo, ...previous]);
    // setIsTodoListLoading(true);
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { newTodo } });
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
        // setTodoList((previous) => {
        //   return previous.map((todo) => {
        //     if (todo.id === newTodo.id) {
        //       return result;
        //     }
        //     return todo;
        //   });
        // });
        // invalidateCache();
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            newTodoId: newTodo.id,
            addedTodo: result,
          },
        });
      } else {
        throw new Error('Failed to add todo');
      }
    } catch (error) {
      // remove the failed todo from the list and set an error message
      // setTodoList((previous) => previous.filter((todo) => todo.id !== newTodo.id));
      // setError(error.message);
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          newTodoId: newTodo.id,
          message: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    let originalTodo;
    setTodoList((previousTodoList) => {
      return previousTodoList.map((todo) => {
        if (todo.id === id) {
          originalTodo = { ...todo };
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });

      if (response.status !== 200) {
        throw new Error('Error completing todo');
      }
      invalidateCache();
    } catch (error) {
      // on failure to PATCH todo as completed, rollback to the original todo and set error message
      setTodoList((previousTodoList) => {
        return previousTodoList.map((todo) => {
          if (todo.id === originalTodo.id) {
            return { ...originalTodo };
          }
          return todo;
        });
      });
      setError(error.message);
    }
  }

  async function updateTodo(editedTodo) {
    let originalTodo;
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        originalTodo = { ...todo };
        return { ...editedTodo };
      }
      return todo;
    });
    setTodoList(updatedTodos);

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (response.status !== 200) {
        throw new Error('Unable to update todo');
      }
      invalidateCache();
    } catch (error) {
      setTodoList((previous) => {
        return previous.map((todo) => {
          if (todo.id === originalTodo.id) {
            return { ...originalTodo };
          }
          return todo;
        });
      });
      setError(error.message);
    }
  }

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
          <button type='button' onClick={() => setError('')}>
            Clear Error
          </button>
        </div>
      ) : null}

      {filterError ? (
        <div>
          <p>{filterError}</p>
          <button type='button' onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>
          <button
            type='button'
            onClick={() => {
              setFilterTerm('');
              setSortBy('createdAt');
              setSortDirection('desc');
              setFilterError('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      {isTodoListLoading ? <div>Loading todo list...</div> : null}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;
