import './App.css';
import ToDoList from './components/toDoList/ToDoList';
import AddToDoItem from './components/addToDoItem/AddToDoItem';

function App() {
  return (
    <div className="App">
      <h1>Todo list</h1>
      <ToDoList/>
      <h2>Add a new business</h2>
      <AddToDoItem/>
    </div>
  );
}

export default App;