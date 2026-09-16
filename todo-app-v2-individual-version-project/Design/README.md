# Todo App V2 (Individual Version)

## Application Flow

This app is a browser-based todo list that stores data in LocalStorage and updates the UI after every change.

1. Page load

- The browser loads index.html.
- script.js runs after HTML parsing because the script tag uses defer.
- DOMContentLoaded fires.
- logEvent logs the DOMContentLoaded event to the on-screen monitor.
- loadTodosFromStorage reads LocalStorage key todos.
- loadTodosFromStorage also prints the storage snapshot to the on-screen monitor.
- renderTodos displays either the empty state or todo items.

2. User submits a new todo

- submit event is captured on the form.
- handleFormSubmit prevents default form reload.
- Input is trimmed and validated.
- If invalid, an error message is shown.
- If valid, addTodo creates a todo object and pushes it into the todos array.
- updateUI is called.
- updateUI calls saveTodosToStorage, then renderTodos.
- saveTodosToStorage logs LocalStorage before save and after save.

3. User toggles a todo checkbox

- change event is handled through event delegation on the todo list.
- handleTodoToggle finds the target todo id.
- toggleTodo updates completed for the matching item.
- updateUI saves and re-renders.
- Storage snapshots are printed before and after save.

4. User deletes a todo

- click event is handled through event delegation on the todo list.
- handleTodoListClick checks for delete button clicks.
- deleteTodo removes the matching item from the array.
- updateUI saves and re-renders.
- Storage snapshots are printed before and after save.

5. Event monitor logging

- logEvent prints event details including:
  - event name
  - phase (capturing, at_target, bubbling)
  - currentTarget
  - target
- log appends lines into the monitor area on screen.
- Clear Log button resets step count and clears monitor output.

## Data Model

Each todo is stored as:

- id: string (timestamp)
- text: string
- completed: boolean
- createdAt: ISO datetime string

## LocalStorage

- Key: todos
- Value: JSON stringified array of todo objects




