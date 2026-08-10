import { useEditableTitle } from '../../hooks/useEditableTitle';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const { isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit } =
    useEditableTitle(todo.title);

  function handleEdit(event) {
    updateTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();
    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type='button' onClick={cancelEdit}>
              Cancel
            </button>
            <button
              type='button'
              onClick={handleUpdate}
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type='checkbox'
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={startEditing}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
