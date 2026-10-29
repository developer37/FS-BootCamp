// Task Model
// This file manages task data in memory

// In-memory storage for tasks
const tasks = [];

// ID counter for generating unique post IDs
let taskIdCounter = 1;

// Task model object with methods to interact with task data
const Task = {
  reset() {
    tasks.length = 0;
    taskIdCounter = 1;
    return tasks;
  },

  // Get all tasks
  getAll() {
    return tasks;
  },

  // Get all posts sorted by creation date (newest first)
  getAllSorted() {
    return tasks.slice().sort((a, b) => b.createdAt - a.createdAt);
  },

  // Filter, search, and sort tasks using query parameters like status, priority, and sortBy.
  filterAndSort(taskList, { status, priority, search, sortBy = 'createdAt', order = 'desc' } = {}) {
    const normalizedStatus = status ? String(status).trim().toLowerCase() : '';
    const normalizedPriority = priority ? String(priority).trim().toLowerCase() : '';
    const normalizedSearch = search ? String(search).trim().toLowerCase() : '';
    const normalizedSortBy = ['dueDate', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt';
    const normalizedOrder = order === 'asc' ? 'asc' : 'desc';

    let filtered = taskList.filter((task) => {
      const matchesStatus = !normalizedStatus || (task.status || '').toLowerCase() === normalizedStatus;
      const matchesPriority = !normalizedPriority || (task.priority || '').toLowerCase() === normalizedPriority;
      const matchesSearch = !normalizedSearch ||
        (task.title || '').toLowerCase().includes(normalizedSearch) ||
        (task.description || '').toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesPriority && matchesSearch;
    });

    filtered = filtered.slice().sort((a, b) => {
      const left = normalizedSortBy === 'dueDate' ? new Date(a.dueDate || 0).getTime() : new Date(a.createdAt || 0).getTime();
      const right = normalizedSortBy === 'dueDate' ? new Date(b.dueDate || 0).getTime() : new Date(b.createdAt || 0).getTime();

      return normalizedOrder === 'asc' ? left - right : right - left;
    });

    return filtered;
  },

  // Find post by ID
  findById(taskId) {
    return tasks.find((task) => task.id === taskId);
  },

  // Find all posts by a specific author
  findByUser(userId) {
    const userTasks = tasks.filter((task) => task.userId === userId);
    return userTasks.sort((a, b) => b.createdAt - a.createdAt);
  },

  // Count tasks by author
  countByUser(authorId) {
   return tasks.filter((task) => task.userId === authorId).length;
  },

  // Create a new post
  create(taskData) {
    const newTask = {
      id: taskIdCounter++,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      userId: taskData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    return newTask;
  },

  // Update task by ID
  updateById(taskId, updateData) {
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return null;
    }

    // Update task properties
    if (updateData.title) task.title = updateData.title;
    if (updateData.description) task.description = updateData.description;
    if (updateData.status) task.status = updateData.status;
    if (updateData.priority) task.priority = updateData.priority;
    if (updateData.dueDate) task.dueDate = updateData.dueDate;
    task.updatedAt = new Date();

    return task;
  },

  // Delete post by ID
  deleteById(taskId) {
    const taskIndex = tasks.findIndex((p) => p.id === taskId);

    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  },

  // Check if user owns a post
  isOwner(taskId, userId) {
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return false;
    }

    return task.userId === userId;
  },
};

// Export the Task model
module.exports = Task;
