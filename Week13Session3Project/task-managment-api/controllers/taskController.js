// Post Controller
// This file handles all post-related logic

const Task = require("../models/Task");

const VALID_STATUSES = ['todo', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// Filter parsing standardizes query-string inputs so the controller can safely
// process status, priority, search, and sort options from the request URL.
function getTaskFilters(query = {}) {
  const status = query.status ? String(query.status).trim().toLowerCase() : '';
  const priority = query.priority ? String(query.priority).trim().toLowerCase() : '';
  const search = query.search || query.q || query.keyword || '';
  const sortBy = ['dueDate', 'createdAt'].includes(String(query.sortBy || 'createdAt').trim())
    ? String(query.sortBy || 'createdAt').trim()
    : 'createdAt';
  const order = String(query.order || 'desc').trim().toLowerCase();

  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error('Status must be one of: todo, in-progress, completed');
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    throw new Error('Priority must be one of: low, medium, high');
  }

  return {
    status,
    priority,
    search: search ? String(search).trim() : '',
    sortBy,
    order: order === 'asc' ? 'asc' : 'desc',
  };
}

function validateTaskInput(body) {
  const title = body.title ? String(body.title).trim() : '';
  const description = body.description ? String(body.description).trim() : '';
  const status = body.status ? String(body.status).trim() : 'todo';

  if (!title || title.length < 3 || title.length > 100) {
    return { valid: false, error: 'Title is required and must be 3-100 characters long' };
  }

  if (!description || description.length < 10) {
    return { valid: false, error: 'Description is required and must be at least 10 characters long' };
  }

  if (!VALID_STATUSES.includes(status)) {
    return { valid: false, error: 'Status must be one of: todo, in-progress, completed' };
  }

  return { valid: true, title, description, status };
}

function getAllTasks(request, response) {
  try {
    const filters = getTaskFilters(request.query);
    const tasks = Task.filterAndSort(Task.getAll(), filters);

    response.json({
      count: tasks.length,
      filters,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    response.status(400).json({ error: error.message || "Failed to get tasks" });
  }
}

function getTaskById(request, response) {
  try {
    const taskId = parseInt(request.params.taskId ?? request.params.id, 10);

    if (Number.isNaN(taskId)) {
      return response.status(400).json({ error: 'Task ID must be a number' });
    }

    const task = Task.findById(taskId);

    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }

    const isAdmin = request.user.roleName === 'admin';
    const isOwner = task.userId === request.user.userId;

    if (!isAdmin && !isOwner) {
      return response.status(403).json({
        error: 'You can only view your own tasks (or you must be an admin)'
      });
    }

    response.json({ task: task });
  } catch (error) {
    console.error("Get task error:", error);
    response.status(500).json({ error: "Failed to get task" });
  }
}

function createTask(request, response) {
  try {
    const body = request.body || {};
    const validation = validateTaskInput(body);

    if (!validation.valid) {
      return response.status(400).json({ error: validation.error });
    }

    const priority = body.priority ? String(body.priority).trim().toLowerCase() : 'medium';

    if (!VALID_PRIORITIES.includes(priority)) {
      return response.status(400).json({ error: 'Priority must be one of: low, medium, high' });
    }

    const newTask = Task.create({
      title: validation.title,
      description: validation.description,
      status: validation.status,
      priority,
      dueDate: body.dueDate || new Date(),
      userId: request.user.userId,
    });

    response.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    response.status(500).json({ error: "Failed to create task" });
  }
}

function getMyTasks(request, response) {
  try {
    const filters = getTaskFilters(request.query);
    const tasks = Task.filterAndSort(Task.findByUser(request.user.userId), filters);

    response.json({
      count: tasks.length,
      filters,
      tasks,
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    response.status(400).json({ error: error.message || "Failed to get tasks" });
  }
}

function updateTask(request, response) {
  try {
    const taskId = parseInt(request.params.taskId, 10);
    const body = request.body || {};

    if (Number.isNaN(taskId)) {
      return response.status(400).json({ error: 'Task ID must be a number' });
    }

    const task = Task.findById(taskId);

    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }

    const isAdmin = request.user.roleName === 'admin';
    const isOwner = task.userId === request.user.userId;

    if (!isAdmin && !isOwner) {
      return response.status(403).json({
        error: "You can only edit your own tasks (or you must be an admin)"
      });
    }

    const updatePayload = {};

    if (body.title !== undefined) {
      if (!body.title || String(body.title).trim().length < 3 || String(body.title).trim().length > 100) {
        return response.status(400).json({ error: 'Title must be 3-100 characters long' });
      }
      updatePayload.title = String(body.title).trim();
    }

    if (body.description !== undefined) {
      if (!body.description || String(body.description).trim().length < 10) {
        return response.status(400).json({ error: 'Description must be at least 10 characters long' });
      }
      updatePayload.description = String(body.description).trim();
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(String(body.status).trim())) {
        return response.status(400).json({ error: 'Status must be one of: todo, in-progress, completed' });
      }
      updatePayload.status = String(body.status).trim();
    }

    if (body.priority !== undefined) {
      const priority = String(body.priority).trim().toLowerCase();

      if (!VALID_PRIORITIES.includes(priority)) {
        return response.status(400).json({ error: 'Priority must be one of: low, medium, high' });
      }

      updatePayload.priority = priority;
    }

    if (body.dueDate !== undefined) {
      updatePayload.dueDate = body.dueDate;
    }

    const updatedTask = Task.updateById(taskId, updatePayload);

    response.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    response.status(500).json({ error: "Failed to update task" });
  }
}

function deleteTask(request, response) {
  try {
    const taskId = parseInt(request.params.taskId, 10);

    if (Number.isNaN(taskId)) {
      return response.status(400).json({ error: 'Task ID must be a number' });
    }

    const task = Task.findById(taskId);

    if (!task) {
      return response.status(404).json({ error: "Task not found" });
    }

    const isAdmin = request.user.roleName === 'admin';
    const isOwner = task.userId === request.user.userId;

    if (!isAdmin && !isOwner) {
      return response.status(403).json({
        error: "You can only delete your own tasks (or you must be an admin)",
      });
    }

    Task.deleteById(taskId);

    response.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    response.status(500).json({ error: "Failed to delete task" });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  getMyTasks,
  updateTask,
  deleteTask
};
