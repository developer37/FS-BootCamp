// Role Model
// This file manages role data in memory
// A role represents what a user is allowed to do in the application.
// In a real database this would be its own "roles" table that the
// users table references by foreign key (roleId).

// In-memory storage for roles (acts like a "roles" table)
const roles = [];

// ID counter for generating unique role IDs
let roleIdCounter = 1;

// Role model object with methods to interact with role data
const Role = {
  reset() {
    roles.length = 0;
    roleIdCounter = 1;
    return roles;
  },

  // Get all roles
  getAll() {
    return roles;
  },

  // Find a role by its ID
  findById(roleId) {
    return roles.find(role => role.id === roleId);
  },

  // Find a role by its name (e.g. "admin", "author")
  findByName(name) {
    return roles.find(role => role.name === name);
  },

  // Create a new role with a name and a list of permissions
  create(roleData) {
    const newRole = {
      id: roleIdCounter++,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions || [],
      createdAt: new Date()
    };

    roles.push(newRole);
    return newRole;
  },

  // Check if a role has a specific permission string
  hasPermission(roleId, permission) {
    const role = roles.find(r => r.id === roleId);

    if (!role) {
      return false;
    }

    return role.permissions.includes(permission);
  }
};

// Export the Role model
module.exports = Role;
