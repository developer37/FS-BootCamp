import { useEffect, useState } from "react";
import "./App.css";
import AddTodo from "./components/AddTodo.jsx";
import TodoList from "./components/TodoList.jsx";

// Shared key used for saving and loading the todo list in localStorage.
const STORAGE_KEY = "todos";

function App() {
  // Maintain the todo list in component state so the UI updates when items change.
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Track the current text typed into the input field.
  const [todoInput, setTodoInput] = useState("");

  // Store validation feedback for empty or invalid entries.
  const [error, setError] = useState("");

  // Save the latest todos whenever the array changes so data persists on refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Validate and add a new task to the todos array.
  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTodo = todoInput.trim();

    if (!trimmedTodo) {
      setError("Please enter a todo item");
      return;
    }

    if (trimmedTodo.length < 3) {
      setError("Todo must be at least 3 characters long");
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: trimmedTodo,
      completed: false,
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
    setTodoInput("");
    setError("");
  };

  // Toggle the completion status of a specific todo item.
  const handleToggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Remove a todo item from the array.
  const handleDeleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <header>
        <h1>My Todo List</h1>
      </header>

      <main>
        {/* The form component is responsible for entering and submitting a new task. */}
        <AddTodo
          value={todoInput}
          onChange={(event) => setTodoInput(event.target.value)}
          onSubmit={handleAddTodo}
          error={error}
        />

        <section className="todo-controls">
          <span id="todo-count">
            {todos.length} item{todos.length === 1 ? "" : "s"}
          </span>
        </section>

        {/* The list component renders each todo and passes actions to the item component. */}
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      </main>
    </>
  );
}

export default App;
