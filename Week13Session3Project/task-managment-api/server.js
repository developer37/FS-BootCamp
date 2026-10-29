// Main API bootstrap: configure environment variables, wire middleware, and start
// the Express server with the appropriate persistence mode.
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const roleRoutes = require("./routes/roleRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { connectDatabase, syncDatabase } = require("./config/database");
const seedDatabase = require("./seeds/seedData");

const app = express();
const PORT = process.env.PORT || 3001;

// Build the Express app once and apply the shared security + parsing middleware.
// These settings protect API responses while keeping JSON requests easy to consume.

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", roleRoutes); // Role listing

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Task Management API !",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      me: "GET /api/auth/me",
      roles: "GET /api/roles",
      profile: "GET /api/auth/profile",
      tasks: "GET /api/tasks",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:taskId",
      delete: "DELETE /api/tasks/:taskId",
      allTasks: "GET /api/admin/tasks",
      allUsers: "GET /api/admin/users",
      search:
        "GET /api/tasks?status=todo&priority=high&sortBy=dueDate&order=asc&search=task",
      deleteUser: "DELETE /api/admin/users/:userId",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  const databaseConnected = await connectDatabase();
  const databaseSynced = databaseConnected ? await syncDatabase() : false;

  if (databaseConnected && databaseSynced) {
    console.log("Using PostgreSQL-backed storage configured via DATABASE_URL.");
  } else {
    console.log(
      "Using in-memory storage because no valid DATABASE_URL was found or the database is unavailable.",
    );
  }

  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\nTask Management API`);
    console.log(`==========================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET    /api/tasks`);
    console.log(`  GET    /api/admin/tasks`);
    console.log(`  GET    /api/admin/users`);
    console.log(`  GET    /api/auth/me`);
    console.log(`  GET    /api/roles`);
    console.log(`  GET    /api/auth/profile`);
    console.log(
      `  GET    /api/tasks?status=todo&priority=high&sortBy=dueDate&order=asc&search=task`,
    );
    console.log(`  POST   /api/auth/register`);
    console.log(`  POST   /api/auth/login`);
    console.log(`  POST   /api/tasks`);
    console.log(`  PUT    /api/tasks/:taskId`);
    console.log(`  DELETE /api/tasks/:taskId`);
    console.log(`  DELETE /api/admin/users/:userId`);
    console.log(`\n==========================\n`);
  });
}

module.exports = { app, startServer };

if (require.main === module) {
  startServer();
}
