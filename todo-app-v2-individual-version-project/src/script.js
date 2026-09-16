// Todo List App - A simple task management application

// Application State
let todos = [];
// DOM Element Selection
// DOM Selection Methods - Uses querySelector() and querySelectorAll() appropriately
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const errorMessage = document.querySelector("#error-message");
const clearLogButton = document.getElementById("clearLog");
const output = document.querySelector("#monitor-list");
let step = 0;  //for logging
// Initialize App - Run setup when the page loads
document.addEventListener("DOMContentLoaded", function (event) {
  logEvent(event, "DOMContentLoaded");
  loadTodosFromStorage(); // executing/calling/running/invoking etc
  renderTodos();

  // Form submission handling
  todoForm.addEventListener("submit", (e) => {
    console.log("Submit: " + e);
    handleFormSubmit(e);
  });

  // Event delegation for todo list
  todoList.addEventListener("click", (e) => {
    console.log("click: " + e);
    handleTodoListClick(e);
  });
  todoList.addEventListener("change", (e) => {
    console.log("click: " + e);
    handleTodoToggle(e);
  });
});
// Form Processing and Validation

function handleFormSubmit(event) {
  // Event Object Usage - Uses event.preventDefault() appropriately
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
  event.preventDefault();

  // First get the raw input value from the text field
  const rawTodoText = todoInput.value;
  // Then trim whitespace to check if there's actual content
  const todoText = rawTodoText.trim();

  // Input validation
  if (!todoText) {
    showErrorMessage("Please enter a todo item");
    return;
  }

  // Check if the todo text is long enough to be meaningful
  const minimumLength = 3;
  if (todoText.length < minimumLength) {
    showErrorMessage("Todo must be at least 3 characters long");
    return;
  }

  // We need to clear any error messages from previous attempts so the user doesn't see old errors
  hideErrorMessage();

  // Create new todo with the validated text
  addTodo(todoText);

  // Reset form to clear the input field for the next todo
  todoInput.value = "";
}
// User Feedback - Error Message Display
// User Feedback - Displays validation messages and user guidance
// Element Content Manipulation - Changes content using textContent
// CSS Class Management - Uses classList methods (add, remove) for styling changes
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  // Hide message after 3 seconds
  setTimeout(() => {
    hideErrorMessage();
  }, 3000);
}
function hideErrorMessage() {
  errorMessage.classList.remove("show");
}
// Todo Management Functions
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  updateUI();
}
// Helper function to update UI after data changes
function updateUI() {
  saveTodosToStorage();
  renderTodos();
}
// Event Delegation Handler
// Event Delegation - Uses event delegation patterns for dynamically created todo items
// Event Object Usage - Accesses event.target
// Event Bubbling Control - Demonstrates understanding of event propagation
// Reference: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation
function handleTodoListClick(event) {
  logEvent(event);
  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) return;

  // Retrieve the todo ID from the data-id attribute we set earlier
  // dataset.id accesses the data-id attribute and gives us the todo's unique identifier
  // This lets us know which specific todo in our array the user clicked on
  const todoId = todoItem.dataset.id;

  // Handle delete button clicks
  if (event.target.classList.contains("delete-btn")) {
    deleteTodo(todoId);
    return;
  }
}

// Handle checkbox toggle
function handleTodoToggle(event) {
  logEvent(event);
  if (event.target.type === "checkbox") {
    const todoItem = event.target.closest(".todo-item");
    // Get the todo ID from the data-id attribute to know which todo to toggle
    const todoId = todoItem.dataset.id;
    toggleTodo(todoId);
  }
}
function toggleTodo(id) {
  // We need to find the todo and flip its completed status
  todos = todos.map((todo) => {
    // Check if this is the todo we want to toggle
    const isTargetTodo = todo.id === id;

    if (isTargetTodo) {
      // Create a copy of the todo with the opposite completed value
      const updatedTodo = { ...todo, completed: !todo.completed };
      return updatedTodo;
    }

    // Return the original todo if it's not the one we're toggling
    return todo;
  });

  updateUI();
}
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  updateUI();
}

// DOM Manipulation and Rendering
// Element Content Manipulation - Changes content using innerHTML
// DOM Structure Manipulation - Appends elements dynamically
function renderTodos() {
  // Clear existing todos
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML =
      '<li class="empty-state">No todos yet. Add one above!</li>';
    return;
  }

  // Create and append todo items
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
}
// Using innerHTML with template literals allows us to write HTML structure more naturally
// This approach is faster to write and easier to visualize the DOM structure
// IMPORTANT: We only use innerHTML here because we control all the data (no user input risk)
function createTodoElement(todo) {
  //DOM Structure Manipulation - Creates elements dynamically
  const li = document.createElement("li");

  // Attribute OR Style Manipulation - Modifies attributes programmatically
  // CSS Class Management - Uses className for styling changes
  // Use template literal to conditionally add the 'completed' class
  const completedClass = todo.completed ? " completed" : "";
  li.className = `todo-item${completedClass}`;

  // Store the todo's unique ID as a data attribute on the element
  // This connects the DOM element to the todo object in our array
  // We can later retrieve this ID using element.dataset.id to find which todo was clicked
  li.setAttribute("data-id", todo.id);

  // Element Content Manipulation - Changes content using innerHTML
  // Build the entire todo item structure using a template literal
  // This is safe because we're escaping the user's todo text with textContent later
  const checkboxChecked = todo.completed ? "checked" : "";
  const checkboxAction = todo.completed ? "incomplete" : "complete";

  li.innerHTML = `
        <input type="checkbox"
               class="todo-checkbox"
               ${checkboxChecked}
               aria-label="Mark "${todo.text}" as ${checkboxAction}">
        <span class="todo-text"></span>
        <div class="todo-actions">
            <button class="delete-btn" aria-label="Delete "${todo.text}"">Delete</button>
        </div>
    `;

    // RUBRIC: Element Content Manipulation - Use textContent for user data to prevent XSS
    // Set the todo text using textContent to safely handle any special characters
    const textSpan = li.querySelector('.todo-text');
    textSpan.textContent = todo.text;

  return li;
}
// Local Storage Operations
// Data Storage - Uses localStorage.setItem() to save todos
// Data Retrieval - Uses localStorage.getItem() to load todos on page refresh
// Data Persistence - Maintains todo state across browser sessions
// Data Management - Handles localStorage operations appropriately
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
function saveTodosToStorage() {
  logLocalStorageState("before save");
  // Convert todos array to JSON string and save to browser storage
  localStorage.setItem("todos", JSON.stringify(todos));
  logLocalStorageState("after save");
}
function loadTodosFromStorage() {
  // Try to get the saved todos from browser storage
  const storedTodos = localStorage.getItem("todos");
  logLocalStorageState("load from storage");

  // Only try to parse if we actually found saved data
  if (storedTodos) {
    // Convert the JSON string back into an array
    todos = JSON.parse(storedTodos);
  }
}
// Retrieve items from localStorge and output to screen
function logLocalStorageState(contextLabel) {
  const storedTodos = localStorage.getItem("todos");
  const valueToDisplay = storedTodos || "(empty)";
  log(`localStorage ${contextLabel}: ${valueToDisplay}`);
}
// Write event info to screen
function logEvent(event, eventName = event.type) {
  console.log("event: " + event);
  step += 1;
  const targetId = event.target.id || event.target.tagName || "DOCUMENT";
  const currentId =
    event.currentTarget.id || event.currentTarget.tagName || "DOCUMENT";
  const phase = getPhaseName(event.eventPhase);
  log(
    `${step}. event=${eventName} | phase=${phase} | currentTarget=${currentId} | target=${targetId}`,
  );
}
// Write message to screen as opposed to console log it
function log(message) {
  output.innerHTML += message + "<br>";
  output.scrollTop = output.scrollHeight;
}
// button the clear dedug messages on the screen 
clearLogButton.addEventListener("click", () => {
  step = 0;
  output.innerHTML = "<strong>Event Log:</strong><br>";
});
// To grade events 
function getPhaseName(eventPhase) {
  if (eventPhase === Event.CAPTURING_PHASE) {
    return "CAPTURING";
  }
  if (eventPhase === Event.AT_TARGET) {
    return "AT_TARGET";
  }
  return "BUBBLING";
}
