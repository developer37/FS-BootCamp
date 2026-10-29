// User Routes
// This file defines routes for user operations.
// Some of these routes are now admin-only to show off role-based access.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/authorize');

// GET /me - Get the logged-in user's own profile (any authenticated user)
router.get('/me', authenticateToken, userController.getProfile);

// Backwards-compatible alias
router.get('/profile', authenticateToken, userController.getProfile);

// GET /users - List all users
// Uses requireRole - the simpler "is your role in this list?" check.
router.get(
  '/users',
  authenticateToken,
  requireRole('admin'),
  userController.getAllUsers
);

// PATCH /users/:userId/role - Change a user's role
// Uses requirePermission instead of requireRole. This is the more
// granular pattern: instead of asking "are you an admin?", it asks
// "does your role include the user:assign-role permission?".
// Both happen to gate the same users right now (only admin has that
// permission), but if we ever add a "moderator" role that can assign
// roles, we wouldn't need to touch this route - just give the new
// role the user:assign-role permission.
// Body: { "roleName": "author" }
router.patch(
  '/users/:userId/role',
  authenticateToken,
  requirePermission('user:assign-role'),
  userController.updateUserRole
);

// Export the router
module.exports = router;
