import Button from "./Button.jsx";

// A single todo row contains the checkbox, task text, and delete button.
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      className={`todo-item ${todo.completed ? "completed" : ""}`}
      data-id={todo.id}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        {/* Use the generic button with a specific class and click handler. */}
        <Button
          label="Delete"
          type="button"
          className="delete-btn"
          onClick={() => onDelete(todo.id)}
        />
      </div>
    </li>
  );
}

export default TodoItem;
