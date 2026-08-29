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
          dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { todos: result.tasks } });
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else {
          throw new Error('Error fetching todos.');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error filtering/sorting todos: ${error.message}`,
              isFilterError: true,
            },
          });
        } else {
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

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        todos: [newTodo, ...todoList], // optimistically add todo to current todoList
      },
    });
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
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            // replace the temp todo from the optimistic update with the real todo (action.payload.addedTodo) from the server response
            todos: todoList.map((todo) => {
              todo.id === newTodo.id ? result : todo;
            }),
          },
        });
      } else {
        throw new Error('Failed to add todo');
      }
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          // remove the todo that was optimistically added since it failed to be added on server side
          todos: todoList.filter((todo) => todo.id !== newTodo.id),
          message: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        todos: todoList.map((todo) => {
          todo.id === id ? { ...todo, isCompleted: true } : todo;
        }),
      },
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
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          // on failure to PATCH todo as completed, rollback to the original todo and set error message
          todos: todoList.map((todo) => {
            todo.id === originalTodo.id ? originalTodo : todo;
          }),
          message: error.message,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        todos: todoList.map((todo) => {
          todo.id === editedTodo.id ? editedTodo : todo;
        }),
      },
    });

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
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          todos: todoList.map((todo) => {
            todo.id === originalTodo.id ? originalTodo : todo;
          }),
          message: error.message,
        },
      });
    }
  }

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
          <button type='button' onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
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
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
            },
          });
        }}
        onSortDirectionChange={(newSortDirection) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT_DIRECTION,
            payload: {
              sortDirection: newSortDirection,
            },
          });
        }}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={(newFilterTerm) => {
          dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newFilterTerm } });
        }}
      />
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
