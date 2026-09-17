import { useState, useRef } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import { MAX_TODO_LENGTH } from '../../utils/constants.js';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    inputRef.current.focus();
  };

  return (
    <form className={styles.todoForm} onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId={'todoTitle'}
        labelText={'Todo'}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        ref={inputRef}
        value={workingTodoTitle}
        placeholder='I need to...'
        maxLength={MAX_TODO_LENGTH}
      />
      <button
        className={styles.addBtn}
        type='submit'
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
