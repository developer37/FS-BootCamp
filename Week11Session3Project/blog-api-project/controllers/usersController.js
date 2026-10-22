// In-memory user list used as the app's simple data source.
let users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "author",
    createdAt: new Date('2024-01-12').toISOString()
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    role: "author",
    createdAt: new Date('2024-01-14').toISOString()
  }
];

// Tracks the next ID so new users are assigned a unique value.
let nextId = 4;

// GET /api/users: return all users or a filtered role-based subset.
const getAllUsers = (req, res) => {
  try {
    const { role } = req.query;
    let filteredUsers = users;

    if (role) {
      filteredUsers = users.filter(user => user.role.toLowerCase() === role.toLowerCase());
    }

    res.json({
      users: filteredUsers,
      count: filteredUsers.length,
      totalUsers: users.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
};

// GET /api/users/:id: find the matching user and return 404 when absent.
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user exists with ID ${id}`
      });
    }

    res.json({
      user: user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
};

// POST /api/users: validate name, email, and role before creating a record.
const createUser = (req, res) => {
  try {
    const { name, email, role = 'author' } = req.body;

    // Missing required data is rejected early with a 400 response.
    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and email are required',
        received: { name, email, role }
      });
    }

    // Ensure the email format is valid before saving the user.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide a valid email address'
      });
    }

    // Prevent duplicate accounts using the same email address.
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
        message: 'A user with this email address already exists'
      });
    }

    const validRoles = ['admin', 'author', 'reader'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid role',
        message: `Role must be one of: ${validRoles.join(', ')}`
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name must be at least 2 characters long'
      });
    }

    const newUser = {
      id: nextId++,
      name,
      email,
      role: role.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    // Store the new user so future reads and updates can find it.
    users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
};

// PUT /api/users/:id: update fields only when they are provided and valid.
const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user exists with ID ${id}`
      });
    }

    if (name !== undefined && name.length < 2) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name must be at least 2 characters long'
      });
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Please provide a valid email address'
        });
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== parseInt(id));
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already exists',
          message: 'A user with this email address already exists'
        });
      }
    }

    if (role !== undefined) {
      const validRoles = ['admin', 'author', 'reader'];
      if (!validRoles.includes(role.toLowerCase())) {
        return res.status(400).json({
          error: 'Invalid role',
          message: `Role must be one of: ${validRoles.join(', ')}`
        });
      }
    }

    // Use object spread to merge the existing user with only the fields to update.
    const updatedUser = {
      ...users[userIndex],
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(role !== undefined && { role: role.toLowerCase() })
    };

    users[userIndex] = updatedUser;

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
};

// DELETE /api/users/:id: remove the matching user and send back the deleted record.
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user exists with ID ${id}`
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
      remainingUsers: users.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};