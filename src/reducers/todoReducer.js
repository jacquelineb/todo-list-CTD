export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  // Complete todo operations
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  // Update todo operations
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // UI operations
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.todos,
        isTodoListLoading: false,
        error: '', // not sure if necessary
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: action.payload.error,
        filterError: action.payload.filterError,
      };

    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload.newTodos, ...state.todoList], // optimistically updating the todo
        isTodoListLoading: true,
        error: '',
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          // replace the temp todo from the optimistic update with the real todo (action.payload.addedTodo) from the server response
          todo.id === action.payload.newTodoId ? action.payload.addedTodo : todo;
        }),
        isTodoListLoading: false,
        error: '',
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload.newTodoId), // remove the todo that was optimistically added since it failed to be added on server side
        isTodoListLoading: false,
        error: action.payload.errorMessage,
      };

    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          todo.id === action.payload.id ? { ...todo, isCompleted: true } : todo;
        }),
        error: '',
      };

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          // on failure to PATCH todo as completed, rollback to the original todo
          todo.id === action.payload.originalTodo.id ? action.payload.originalTodo : todo;
        }),
        error: action.payload.error.message,
      };

    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          todo.id === action.payload.editedTodo.id ? action.payload.editedTodo : todo;
        }),
        error: '',
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
