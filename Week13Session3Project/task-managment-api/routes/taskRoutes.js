// Task Routes
// This file defines routes for managing a user's own tasks.

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/auth');

// GET /api/tasks - Get the authenticated user's tasks
router.get('/', authenticateToken, taskController.getMyTasks);

// POST /api/tasks - Create a new task for the authenticated user
router.post('/', authenticateToken, taskController.createTask);

// GET /api/tasks/:id - Get a single task by ID (owner only, unless admin)
router.get('/:id', authenticateToken, taskController.getTaskById);
router.get('/:taskId', authenticateToken, taskController.getTaskById);

// PUT /api/tasks/:taskId - Update a task
router.put('/:taskId', authenticateToken, taskController.updateTask);
router.put('/:id', authenticateToken, taskController.updateTask);

// DELETE /api/tasks/:taskId - Delete a task
router.delete('/:taskId', authenticateToken, taskController.deleteTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
