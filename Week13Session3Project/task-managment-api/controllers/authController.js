// Authentication Controller
// This file handles authentication logic (register and login)

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

// Basic input validation keeps malformed registration and login requests from
// reaching the model layer or creating invalid tokens.
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUsername(username) {
  return typeof username === 'string' && username.trim().length >= 3 && username.trim().length <= 20;
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function buildTokenPayload(user) {
  const role = Role.findById(user.roleId);

  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    roleName: role ? role.name : 'unknown'
  };
}

async function getCurrentUser(request, response) {
  try {
    const user = User.findById(request.user.userId);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    response.json({
      user: User.getSafeUser(user)
    });
  } catch (error) {
    console.error("Get current user error:", error);
    response.status(500).json({ error: "Failed to get current user" });
  }
}

async function register(request, response) {
  try {
    const body = request.body || {};
    const username = body.username;
    const email = body.email;
    const password = body.password;

    if (!username || !email || !password) {
      return response.status(400).json({ error: "All fields are required" });
    }

    if (!validateUsername(username)) {
      return response.status(400).json({ error: "Username must be 3-20 characters long" });
    }

    if (!validateEmail(email)) {
      return response.status(400).json({ error: "Please provide a valid email address" });
    }

    if (!validatePassword(password)) {
      return response.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = User.findByUsernameOrEmail(username.trim(), email.trim());

    if (existingUser) {
      return response.status(400).json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const authorRole = Role.findByName('author');

    if (!authorRole) {
      return response.status(500).json({ error: "Default user role is not configured" });
    }

    const newUser = User.create({
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      roleId: authorRole.id
    });

    const token = jwt.sign(buildTokenPayload(newUser), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    response.status(201).json({
      message: 'Registration successful. You have been assigned the author role.',
      token: token,
      user: User.getSafeUser(newUser)
    });
  } catch (error) {
    console.error("Registration error:", error);
    response.status(500).json({ error: "Registration failed" });
  }
}

async function login(request, response) {
  try {
    const body = request.body || {};
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
      return response.status(400).json({ error: "Username and password are required" });
    }

    if (!validateUsername(username)) {
      return response.status(400).json({ error: "Username must be 3-20 characters long" });
    }

    const user = User.findByUsername(username.trim());

    if (!user) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(buildTokenPayload(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    response.json({
      message: "Login successful",
      token: token,
      user: User.getSafeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({ error: "Login failed" });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
};
