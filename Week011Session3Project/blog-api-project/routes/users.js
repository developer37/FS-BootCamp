// Users routes define the endpoints for managing user records.

const express = require("express");
const usersRouter = express.Router();
const usersController = require("../controllers/usersController");

// GET /api/users - return every user or a filtered subset by role.
usersRouter.get("/", usersController.getAllUsers);

// GET /api/users/:id - retrieve one user by ID.
usersRouter.get("/:id", usersController.getUserById);

// POST /api/users - create a new user after validation checks.
usersRouter.post("/", usersController.createUser);

// PUT /api/users/:id - update an existing user profile.
usersRouter.put("/:id", usersController.updateUser);

// DELETE /api/users/:id - remove a user from the dataset.
usersRouter.delete("/:id", usersController.deleteUser);

module.exports = usersRouter;
