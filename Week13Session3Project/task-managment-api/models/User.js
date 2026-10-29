// User Model
// This file manages user data in memory
// Each user now has a roleId which references a record in the Role model.
// In a real database this would be a foreign key to a "roles" table.

const Role = require('./Role');

// In-memory storage for users
const users = [];

// ID counter for generating unique user IDs
let userIdCounter = 1;

// User model object with methods to interact with user data
const User = {
  reset() {
    users.length = 0;
    userIdCounter = 1;
    return users;
  },

  // Get all users
  getAll() {
    return users;
  },

  // Find user by ID
  findById(userId) {
    return users.find((user) => user.id === userId);
  },

  // Find user by username
  findByUsername(username) {
    return users.find((user) => user.username === username);
  },

  // Find user by email
  findByEmail(email) {
    return users.find((user) => user.email === email);
  },

  // Find user by username or email
  findByUsernameOrEmail(username, email) {
    return users.find(
      (user) => user.username === username || user.email === email,
    );
  },

  // Create a new user
  // Note: roleId defaults to the "author" role if none is provided,
  // because those are the only two roles (admin and author) and admin
  // must be granted deliberately.
  create(userData) {
    let roleId = userData.roleId;

    // If no role was provided, default to the "author" role
    if (!roleId) {
      const authorRole = Role.findByName('author');
      roleId = authorRole ? authorRole.id : null;
    }

    const newUser = {
      id: userIdCounter++,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      roleId: roleId,
      createdAt: new Date()
    };

    users.push(newUser);
    return newUser;
  },

  // Update user by ID
  updateById(userId, updateData) {
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return null;
    }

    // Update user properties
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) user.password = updateData.password;
    if (updateData.roleId) user.roleId = updateData.roleId;

    return user;
  },

  // Delete user by ID
  deleteById(userId) {
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    return true;
  },

  // Get user without password field
  getSafeUser(user) {
    const role = Role.findById(user.roleId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      roleName: role ? role.name : 'unknown',
      createdAt: user.createdAt
    };
  }
};

// Export the User model
module.exports = User;
