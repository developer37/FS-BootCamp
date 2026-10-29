// Authentication Routes
// This file defines routes for authentication (register and login)

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require('../middleware/auth');

// POST /register - Register a new user
router.post("/register", authController.register);

// POST /login - Login an existing user
router.post("/login", authController.login);

// GET /me - Get current user info
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
