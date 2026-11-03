# React Todo App - Assessment Rubric

## Project Overview

This rubric evaluates the React Todo App project based on React fundamentals, component architecture, state management, event handling, and form processing covered. Students will build a complete todo list application using React patterns instead of the vanilla JavaScript DOM manipulation one that was built in the Vanilla JS Section (see Week 7 Session 3)

---

## **Must Have (Required for Completetion):**

### Review plain JS Todo List Application**

- Review Screenshots in file todo-app-v2-individual-version-project/ScreenShots of existing Todo JS application and create Functional React commponent as follows

### **React Components and JSX**

- [ ] **Functional Components** - Uses functional components throughout the application
- [ ] **JSX Syntax** - Proper JSX syntax with correct JavaScript expression embedding
- [ ] **Component Hierarchy** - Creates organized component structure (App, TodoList, TodoItem, AddTodo components, or others at your discretion )
- [ ] **Component Reusability** - TodoItem component is reusable for multiple todo instances
- [ ] **Props Implementation** - Effectively passes data between parent and child components

### **State Management with useState**

- [ ] **useState Hook** - Proper implementation of useState hook for managing todo list state
- [ ] **Todo State Array** - Manages array of todo objects with id, text, and completed properties
- [ ] **State Updates** - Correctly updates state using setter functions while maintaining immutability
- [ ] **Multiple State Variables** - Manages form input state separate from todo list state

### **Event Handling and User Interaction**

- [ ] **onClick Handlers** - Implements click event handlers for toggle, delete, and add actions
- [ ] **onChange Handlers** - Handles form input changes for adding new todos
- [ ] **Form Submission** - Handles form submission for adding todos with preventDefault()
- [ ] **Event Handler Functions** - Uses arrow function syntax and passes handlers as props
- [ ] **State Updates on Events** - Updates component state based on user interactions

### **Form Processing and Validation**

- [ ] **Form Submission Handling** - Prevents default form submission and processes todo creation
- [ ] **Input Validation** - Validates required fields and prevents empty todo creation
- [ ] **Form Reset** - Clears input field after successful todo addition
- [ ] **User Feedback** - Displays validation messages or handles empty states appropriately

### **List Rendering and Conditional Logic**

- [ ] **Dynamic List Rendering** - Uses .map() to render array of todo components
- [ ] **React Keys** - Uses unique, stable keys for list items (todo IDs)
- [ ] **Conditional Rendering** - Shows different content based on todo completion status
- [ ] **Empty State Handling** - Handles empty todo list with appropriate messaging
- [ ] **Toggle Functionality** - Allows users to mark todos as complete/incomplete

---

### **Could Have (Bonus Points):**

### **Enhanced Features**

- [ ] **State Lifting** - Lifts state to appropriate parent component for sharing between components
- [ ] **Controlled Components** - Uses controlled form inputs with React state (https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
- [ ] **Todo Editing** - Allows inline editing of existing todo items
- [ ] **Todo Filtering** - Provides filters for all/active/completed todos with count indicators
- [ ] **Data Persistence** - Saves todo data to localStorage for persistence across sessions
- [ ] **Professional Styling** - Modern, responsive CSS design with smooth animations and transitions
- [ ] **Advanced Functionality** - Implements bulk operations, categories, or priority levels with visual indicators

---

## Submission Requirements

### **Technical Requirements:**

- [ ] **Working React Application** - Complete functional todo app with all core features
- [ ] **Component-Based Architecture** - Well-organized components following React best practices
  - One component per jsx file
  - Have a components folder where your components live
- [ ] **State Management** - Proper useState implementation for managing todo data and form inputs
- [ ] **Event Handling** - Full user interaction support for adding, toggling, and deleting todos
- [ ] **Form Processing** - Complete form handling for todo creation with validation

### **User Interface Requirements:**

- [ ] **Add Todo Form** - Input field and submit functionality for creating new todos
- [ ] **Todo List Display** - Clear display of all todos with completion status
- [ ] **Todo Actions** - Toggle complete/incomplete and delete functionality for each todo
- [ ] **Empty State** - Appropriate messaging when no todos exist
- [ ] **Responsive Design** - Application works on desktop and mobile devices

### **Code Quality Requirements:**

- [ ] **Clean Code** - Well-formatted, readable code with consistent naming conventions
  - Prettier helps with most of this along with eslint
  - Don't put everything in one component
- [ ] **Proper JSX** - Correct JSX syntax with appropriate key props and className usage
- [ ] **Component Organization** - Logical component structure with single responsibility principle
- [ ] **Documentation** - Clear README with setup instructions and feature descriptions

**Due Date:** By next project
**Submission Method:** Github Repo link on #project-showcase channel
