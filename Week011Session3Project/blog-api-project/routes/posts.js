// Posts routes define the HTTP endpoints for blog post CRUD operations.

const express = require("express");
const postsRouter = express.Router();
const postsController = require("../controllers/postsController");

// GET /api/posts - list posts, optionally filtered by published status.
postsRouter.get("/", postsController.getAllPosts);

// GET /api/posts/:id - fetch a single post by its numeric ID.
postsRouter.get("/:id", postsController.getPostById);

// POST /api/posts - create a new post after validation checks in the controller.
postsRouter.post("/", postsController.createPost);

// PUT /api/posts/:id - update an existing post with partial field changes.
postsRouter.put("/:id", postsController.updatePost);

// DELETE /api/posts/:id - remove a post from the in-memory data store.
postsRouter.delete("/:id", postsController.deletePost);

module.exports = postsRouter;
