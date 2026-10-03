import Button from "./Button.jsx";

// This component renders the task input form and handles validation feedback.
function AddTodo({ value, onChange, onSubmit, error }) {
  return (
    <section className="todo-input-section">
      <form className="todo-form" onSubmit={onSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="todo-input"
            value={value}
            onChange={onChange}
            placeholder="Enter a new todo..."
            aria-label="New todo item"
          />
          <Button
            label="Add Todo"
            type="submit"
            className="add-btn"
          />
        </div>
        {/* Show validation errors only when the parent component sets an error message. */}
        {error && (
          <div className="error-message show" role="alert">
            {error}
          </div>
        )}
      </form>
    </section>
  );
}

export default AddTodo;
