const express = require("express");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");

// Create the Express application instance that will handle all HTTP requests.
const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting Blog Post API...");

// Parse incoming JSON request bodies so route handlers can read req.body.
app.use(express.json());

// Record each incoming request in the console for basic request logging.
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Root endpoint exposes the API documentation and available routes.
app.get("/", (req, res) => {
  res.json({
    message: "Blog Post API",
    version: "1.0.0",
    endpoints: {
      posts: {
        "GET /api/posts": "Get all blog posts",
        "GET /api/posts/:id": "Get specific blog post",
        "POST /api/posts": "Create new blog post",
        "PUT /api/posts/:id": "Update existing blog post",
        "DELETE /api/posts/:id": "Delete blog post",
      },
      users: {
        "GET /api/users": "Get all users",
        "GET /api/users/:id": "Get specific user",
        "POST /api/users": "Create new user",
        "PUT /api/users/:id": "Update existing user",
        "DELETE /api/users/:id": "Delete user",
      },
    },
    documentation: {
      posts: {
        createPost: {
          method: "POST",
          url: "/api/posts",
          body: {
            title: "string (required, min 3 chars)",
            content: "string (required, min 10 chars)",
            author: "string (required)",
            published: "boolean (optional, default false)",
          },
        },
        updatePost: {
          method: "PUT",
          url: "/api/posts/:id",
          body: {
            title: "string (optional)",
            content: "string (optional)",
            author: "string (optional)",
            published: "boolean (optional)",
          },
        },
      },
      users: {
        createUser: {
          method: "POST",
          url: "/api/users",
          body: {
            name: "string (required, min 2 chars)",
            email: "string (required, valid email)",
            role: "string (optional: admin|author|reader, default author)",
          },
        },
        updateUser: {
          method: "PUT",
          url: "/api/users/:id",
          body: {
            name: "string (optional)",
            email: "string (optional)",
            role: "string (optional: admin|author|reader)",
          },
        },
      },
    },
  });
});

// Mount feature-specific routers so all post and user endpoints stay organized.
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

// This health check is useful for deployment checks and smoke tests.
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Return a clear error when a client requests a route that does not exist.
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api/posts",
      "POST /api/posts",
      "GET /api/posts/:id",
      "PUT /api/posts/:id",
      "DELETE /api/posts/:id",
      "GET /api/users",
      "POST /api/users",
      "GET /api/users/:id",
      "PUT /api/users/:id",
      "DELETE /api/users/:id",
    ],
  });
});

// This must be the last middleware so thrown errors are formatted consistently.
app.use(errorHandler);

// Start the API server and print a quick list of routes for developers.
app.listen(PORT, () => {
  console.log(`Blog Post API server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("\nAPI Endpoints:");
  console.log("  GET    / - API documentation");
  console.log("  GET    /health - Health check");
  console.log("  GET    /api/posts - Get all posts");
  console.log("  POST   /api/posts - Create post");
  console.log("  GET    /api/posts/:id - Get post by ID");
  console.log("  PUT    /api/posts/:id - Update post");
  console.log("  DELETE /api/posts/:id - Delete post");
  console.log("  GET    /api/users - Get all users");
  console.log("  POST   /api/users - Create user");
  console.log("  GET    /api/users/:id - Get user by ID");
  console.log("  PUT    /api/users/:id - Update user");
  console.log("  DELETE /api/users/:id - Delete user");
  console.log(`\nAPI Documentation: http://localhost:${PORT}/`);
});
