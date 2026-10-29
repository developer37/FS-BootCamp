// Role Controller
// Exposes the list of roles and their permissions so students can
// inspect what each role is actually allowed to do.

const Role = require('../models/Role');

// Get all roles (public - helpful for the UI and tutorials)
function getAllRoles(request, response) {
  try {
    const roles = Role.getAll();

    response.json({
      count: roles.length,
      roles: roles
    });

  } catch (error) {
    console.error('Get roles error:', error);
    response.status(500).json({ error: 'Failed to get roles' });
  }
}

// Export controller functions
module.exports = {
  getAllRoles
};
