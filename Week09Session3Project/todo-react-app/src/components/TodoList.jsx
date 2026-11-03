import TodoItem from "./TodoItem.jsx";

// This component renders the full todo list and handles the empty-state UI.
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <section className="todo-list-section">
        <ul className="todo-list">
          <li className="empty-state">No todos yet. Add one above!</li>
        </ul>
      </section>
    );
  }

  return (
    <section className="todo-list-section">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}

export default TodoList;
