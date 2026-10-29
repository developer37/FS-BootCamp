// Authorization Middleware
// This middleware checks what a logged-in user is allowed to do.
// Authorization = "what are you allowed to do?" (permission check)
//
// IMPORTANT: authorize middleware always runs AFTER authenticateToken.
// The route guard checks a user's role and denies access when the role is not
// in the allowed list or the required permission is missing.
// That means request.user is already populated by the JWT.

const Role = require('../models/Role');

// requireRole takes a list of allowed role names and returns a middleware
// function. Any route that uses this middleware will only let users through
// if their role is one of the allowed ones.
//
// Example usage in a route file:
//   router.get('/admin-only', authenticateToken, requireRole('admin'), handler);
//   router.post('/posts', authenticateToken, requireRole('admin', 'author'), handler);
function requireRole(...allowedRoles) {
  // Return the actual middleware function
  return function (request, response, next) {
    // Make sure the user was actually authenticated first
    if (!request.user) {
      return response.status(401).json({
        error: 'You must be logged in to access this route'
      });
    }

    // Look up the user's role by the roleId stored in the JWT token
    const userRole = Role.findById(request.user.roleId);

    if (!userRole) {
      return response.status(403).json({
        error: 'Your account does not have a valid role assigned'
      });
    }

    // Check if the user's role is in the list of allowed roles
    const isAllowed = allowedRoles.includes(userRole.name);

    if (!isAllowed) {
      return response.status(403).json({
        error: `Access denied. This action requires one of these roles: ${allowedRoles.join(', ')}`,
        yourRole: userRole.name
      });
    }

    // The user has an allowed role - continue to the route handler
    next();
  };
}

// requirePermission checks for a specific permission string on the user's role.
// This is a more fine-grained alternative to requireRole.
//
// Example:
//   router.delete('/posts/:id', authenticateToken, requirePermission('post:delete-any'), handler);
function requirePermission(permission) {
  return function (request, response, next) {
    if (!request.user) {
      return response.status(401).json({
        error: 'You must be logged in to access this route'
      });
    }

    const hasPermission = Role.hasPermission(request.user.roleId, permission);

    if (!hasPermission) {
      return response.status(403).json({
        error: `Access denied. Missing required permission: ${permission}`
      });
    }

    next();
  };
}

// Export both helpers so route files can import whichever they need
module.exports = {
  requireRole,
  requirePermission
};
