# React Todo App

This project is a React version of the original Todo List app. It keeps the same core behavior while restructuring the interface into reusable components and using React state to manage updates efficiently.

## Application Architecture

The app follows a lightweight component-driven structure:

- App is the state owner and handles todo creation, toggling, deletion, and persistence.
- AddTodo renders the input form and validation message.
- TodoList displays the list or the empty-state message when no tasks exist.
- TodoItem represents a single task row with a checkbox and delete action.
- Button is a shared reusable button component used by the add and delete actions.

### Component Flow

1. The app loads the list from localStorage when it mounts.
2. The user enters a new todo in the AddTodo form.
3. App validates the value before adding it to the state.
4. A new todo object is created and prepended to the list.
5. TodoList maps the array and renders each TodoItem.
6. The user can toggle completion or delete a todo from the item row.
7. App updates state and saves the new array back to localStorage.
8. The UI re-renders automatically to reflect the latest list.

## Project Structure

```bash
todo-react-app/
├── src/
│   ├── components/
│   │   ├── AddTodo.jsx
│   │   ├── Button.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoList.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── setupTests.js
│   └── __mocks__/
│       └── styleMock.js
├── babel.config.cjs
├── jest.config.cjs
├── package.json
├── vite.config.js
├── index.html
├── README.md
├── Sequence.mmd
└── todo-react-project-rubric.md
```

## State and Data Flow

The App component manages the application state:

- todos: array of todo objects
- todoInput: current text in the input field
- error: validation message displayed to the user

Each todo is stored as an object like this:

```js
{
  id: 'unique-id',
  text: 'Task text',
  completed: false,
}
```

The app uses the storage key "todos" to persist data across browser refreshes.

## Features

- Add new todo items
- Validate empty and short inputs
- Display inline error feedback
- Mark items as complete or incomplete
- Delete individual tasks
- Show an empty-state message when no todos exist
- Persist the list in localStorage
- Use reusable UI components
- Test app and component behaviors with Jest + React Testing Library

## Setup Instructions

### 1. Open the project folder

```bash
cd React-Todo-App/todo-react-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
npm run dev -- --host 0.0.0.0
```

Vite will start the app and print a local URL in the terminal. Open that address in the browser to use the app.

### 4. Build for production

```bash
npm run build
```

### 5. Run tests

```bash
npm test -- --runInBand
```

## Validation Rules

The app prevents invalid todo entries by checking:

- empty input after trimming whitespace
- values shorter than 3 characters

If validation fails, the app shows a visible error message and does not add the item.

## Notes

This project demonstrates a clean React architecture with:

- single responsibility components
- centralized state management
- prop-based communication between parent and child components
- reusable styling and button logic
- persistence using browser storage

## Summary

This React Todo app is a small but complete implementation that shows how a list-based UI can be broken into clear components while keeping the flow easy to understand and test.
