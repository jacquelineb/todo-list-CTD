import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onToggleTodoCompletion, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  function handleDelete() {
    onDeleteTodo(todo.id);
  }

  return (
    <li>
      <form className={styles.listItemForm} onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={todo.id + '-input'}
              labelText={''}
              value={workingTitle}
              onChange={handleEdit}
            />
            <button type='button' onClick={handleCancel}>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleUpdate}
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
            <button type='button' onClick={handleDelete}>
              Delete
            </button>
          </>
        ) : (
          <>
            <input
              type='checkbox'
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onToggleTodoCompletion(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
