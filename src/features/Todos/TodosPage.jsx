import { useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
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
