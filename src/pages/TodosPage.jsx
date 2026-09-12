import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import useDebounce from '../utils/useDebounce.js';
import { TODO_ACTIONS, initialTodoState, todoReducer } from '../reducers/todoReducer.js';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
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

  // Get status filter from URL, default to 'all'
  const statusFilter = searchParams.get('status') || 'all';

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
          throw new Error('Unauthorized. Please sign back in and try again.');
        } else {
          throw new Error('An unknown error occurred while fetching todos.');
        }
      } catch (error) {
        if (
          debouncedFilterTerm ||
          ['createdAt', 'title'].indexOf(sortBy) === -1 ||
          ['desc', 'asc'].indexOf(sortDirection) === -1
        ) {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: 'An error occurred while filtering or sorting the todo list.',
              isFilterError: true,
            },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: error.message,
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
        newTodo,
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
            tempTodoId: newTodo.id,
            addedTodo: result,
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
          newTodoId: newTodo.id,
          message: error.message,
        },
      });
    }
  }

  async function deleteTodo(id) {
    const deletedTodoIndex = todoList.findIndex((todo) => todo.id === id);
    const originalTodo = todoList[deletedTodoIndex];
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
      payload: { deletedTodoId: id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (response.status !== 200) {
        throw new Error(`Failed to delete todo: "${originalTodo.title}"`);
      }
      dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          deletedTodo: originalTodo,
          deletedTodoIndex,
          message: error.message,
        },
      });
    }
  }

  async function toggleTodoCompletion(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    dispatch({
      type: TODO_ACTIONS.TOGGLE_TODO_COMPLETION_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: !originalTodo.isCompleted }),
      });

      if (response.status !== 200) {
        throw new Error('An error occurred while setting todo completion status');
      }
      dispatch({ type: TODO_ACTIONS.TOGGLE_TODO_COMPLETION_SUCCESS });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.TOGGLE_TODO_COMPLETION_ERROR,
        payload: {
          originalTodo,
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
        editedTodo,
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
          originalTodo,
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
          <button
            type='button'
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
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
              sortDirection,
            },
          });
        }}
        onSortDirectionChange={(newSortDirection) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortDirection: newSortDirection,
              sortBy,
            },
          });
        }}
      />
      <StatusFilter />
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
        // onCompleteTodo={completeTodo}
        onToggleTodoCompletion={toggleTodoCompletion}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
