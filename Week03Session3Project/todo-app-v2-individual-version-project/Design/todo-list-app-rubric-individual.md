# Simple Todo List App - Assessment Rubric

## Project Overview

This rubric evaluates the Simple Todo List App project based on fundamental JavaScript concepts, DOM manipulation, event handling, form processing, and local storage.

---

## **Must Have (Required for Passing):**

### **DOM Selection and Manipulation**

- [ ] **DOM Selection Methods** - Uses querySelector() appropriately to select form, input, list, and count elements
- [ ] **Element Content Manipulation** - Changes content using textContent and innerHTML
- [ ] **Attribute Manipulation** - Modifies attributes programmatically (data-id, aria-label)
- [ ] **CSS Class Management** - Uses classList methods (add, remove) for styling changes
- [ ] **DOM Structure Manipulation** - Creates, appends, and removes elements dynamically

### **Event Handling and Bubbling**

- [ ] **Event Listeners** - Implements addEventListener() for user interactions (submit, click, change)
- [ ] **Event Object Usage** - Accesses event.target and uses event.preventDefault() appropriately
- [ ] **Event Delegation** - Uses event delegation patterns for dynamically created todo items
- [ ] **Multiple Event Types** - Handles click, change, and submit events
- [ ] **Event Bubbling Control** - Demonstrates understanding of event propagation with closest()

### **Form Processing and Validation**

- [ ] **Form Element Access** - Selects and accesses form inputs correctly
- [ ] **Form Submission Handling** - Prevents default form submission and processes data
- [ ] **Input Validation** - Validates required fields (not empty, minimum 3 characters)
- [ ] **User Feedback** - Displays validation messages and user guidance

### **Local Storage Implementation**

- [ ] **Data Storage** - Uses localStorage.setItem() to save todos
- [ ] **Data Retrieval** - Uses localStorage.getItem() to load todos on page refresh
- [ ] **Data Management** - Handles localStorage operations appropriately
- [ ] **Data Persistence** - Maintains todo state across browser sessions

### **Core Todo Functionality**

- [ ] **Add Todo** - Creates new todo with unique ID and adds to array
- [ ] **Display Todos** - Renders todos from array to DOM
- [ ] **Toggle Complete** - Marks todos as complete/incomplete via checkbox
- [ ] **Delete Todo** - Removes todos from array and DOM

---

## **Code Quality Standards:**

### **Code Organization**

- [ ] **Clear Variable Names** - Uses descriptive variable names (e.g., `todoText`, `todoId`, `activeTodos`)
- [ ] **Intermediate Variables** - Breaks complex operations into named steps for clarity
- [ ] **Function Organization** - Separates concerns into focused functions
- [ ] **Conversational Comments** - Includes comments explaining "why" not just "what"

### **Best Practices**

- [ ] **Prevents XSS** - Uses textContent for user input to prevent script injection
- [ ] **Data-First Approach** - Updates data array first, then renders UI
- [ ] **Consistent Updates** - Uses helper function to keep UI and storage in sync
- [ ] **Event Delegation** - Avoids attaching individual listeners to dynamic elements

---

## **Submission Requirements**

**Due Date:** Start of Next Project (1 Week from today)
**Submission Method:** Github Repo link on #projects-showcase channel
