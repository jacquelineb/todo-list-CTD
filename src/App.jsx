import './App.css';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';

function App() {
  return (
    <div>
      <Header />
      <Logon />
      <TodosPage />
    </div>
  );
}

export default App;
