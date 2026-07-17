function TodoList(props) {
  return (
    <ul>
      {props.todoList.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export default TodoList;
