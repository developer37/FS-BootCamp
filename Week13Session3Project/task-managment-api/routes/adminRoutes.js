// Admin Routes
// This file exposes admin-only task and user management views.

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');

// GET /api/admin/tasks - View all tasks (admin only)
router.get('/tasks', authenticateToken, requireRole('admin'), taskController.getAllTasks);

// DELETE /api/admin/tasks/:taskId - Delete any task (admin only)
router.delete('/tasks/:taskId', authenticateToken, requireRole('admin'), taskController.deleteTask);

// GET /api/admin/users - View all users (admin only)
router.get('/users', authenticateToken, requireRole('admin'), userController.getAllUsers);

// DELETE /api/admin/users/:userId - Delete a user and their tasks (admin only)
router.delete('/users/:userId', authenticateToken, requireRole('admin'), userController.deleteUser);

module.exports = router;
