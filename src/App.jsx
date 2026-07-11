import TodoForm from './TodoForm';
import TodoList from './TodoList';
import './App.css';

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
