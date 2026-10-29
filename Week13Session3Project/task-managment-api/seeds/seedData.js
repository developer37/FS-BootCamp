// Seed Data
// This file creates starter data (roles, users, and sample tasks) whenever
// the server starts. This is helpful because the application stores data
// in memory, so restarting the server wipes everything.
//
// Seeding = inserting known starter records so you always have
// predictable accounts to log in with and test against.

const bcrypt = require("bcryptjs");
const Role = require("../models/Role");
const User = require("../models/User");
const Task = require("../models/Task");
const { sequelize, RoleModel, UserModel, TaskModel } = require("../config/database");

async function seedDatabase() {
  console.log("\nSeeding starter data...");

  // Database-backed path: keep a predictable set of roles, users, and tasks in the
  // configured PostgreSQL instance without creating duplicates on restart.
  if (sequelize && RoleModel && UserModel && TaskModel) {
    const defaultRoles = [
      {
        name: "admin",
        description: "Full access to everything in the app",
        permissions: [
          "task:create",
          "task:edit-own",
          "task:delete-own",
          "task:delete-any",
          "task:list",
          "user:assign-role",
        ],
      },
      {
        name: "author",
        description: "Can create and manage their own tasks",
        permissions: ["task:create", "task:edit-own", "task:delete-own"],
      },
    ];

    for (const roleData of defaultRoles) {
      await RoleModel.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
      });
    }

    const adminRole = await RoleModel.findOne({ where: { name: "admin" } });
    const authorRole = await RoleModel.findOne({ where: { name: "author" } });

    // Keep the in-memory data layer aligned with the seeded database-backed values so
    // the controller and middleware logic used by the app behaves consistently across
    // both persistence modes.
    if (!Role.findByName("admin")) {
      Role.create(defaultRoles[0]);
    }
    if (!Role.findByName("author")) {
      Role.create(defaultRoles[1]);
    }

    const adminPassword = await bcrypt.hash("admin123", 10);
    const alicePassword = await bcrypt.hash("alice123", 10);

    const [admin] = await UserModel.findOrCreate({
      where: { username: "admin" },
      defaults: {
        username: "admin",
        email: "admin@example.com",
        password: adminPassword,
        roleId: adminRole.id,
      },
    });

    const [alice] = await UserModel.findOrCreate({
      where: { username: "alice" },
      defaults: {
        username: "alice",
        email: "alice@example.com",
        password: alicePassword,
        roleId: authorRole.id,
      },
    });

    if (!User.findByUsername("admin")) {
      User.create({
        username: "admin",
        email: "admin@example.com",
        password: adminPassword,
        roleId: Role.findByName("admin").id,
      });
    }
    if (!User.findByUsername("alice")) {
      User.create({
        username: "alice",
        email: "alice@example.com",
        password: alicePassword,
        roleId: Role.findByName("author").id,
      });
    }

    const defaultTasks = [
      {
        title: "Welcome to the Task Management API",
        description: "This task was created by the admin during seeding. Admins can delete any task, not just their own.",
        status: "todo",
        priority: "high",
        dueDate: new Date(),
        userId: admin.id,
      },
      {
        title: "My First Author Task",
        description: "Hi, I am Alice and I have the user role. I can create tasks and edit or delete the ones I own.",
        status: "in-progress",
        priority: "high",
        dueDate: new Date(),
        userId: alice.id,
      },
    ];

    for (const taskData of defaultTasks) {
      await TaskModel.findOrCreate({
        where: {
          title: taskData.title,
          userId: taskData.userId,
        },
        defaults: taskData,
      });
    }

    const inMemoryAdmin = User.findByUsername("admin");
    const inMemoryAlice = User.findByUsername("alice");
    const hasWelcomeTask = Task.getAll().some((task) => task.title === "Welcome to the Task Management API");
    const hasAliceTask = Task.getAll().some((task) => task.title === "My First Author Task");

    if (!hasWelcomeTask && inMemoryAdmin) {
      Task.create({
        title: "Welcome to the Task Management API",
        description: "This task was created by the admin during seeding. Admins can delete any task, not just their own.",
        status: "todo",
        priority: "high",
        dueDate: new Date(),
        userId: inMemoryAdmin.id,
      });
    }
    if (!hasAliceTask && inMemoryAlice) {
      Task.create({
        title: "My First Author Task",
        description: "Hi, I am Alice and I have the user role. I can create tasks and edit or delete the ones I own.",
        status: "in-progress",
        priority: "high",
        dueDate: new Date(),
        userId: inMemoryAlice.id,
      });
    }

    const roleCount = await RoleModel.count();
    const userCount = await UserModel.count();
    const taskCount = await TaskModel.count();

    console.log(`  Created ${roleCount} roles: admin, author`);
    console.log(`  Created ${userCount} users: admin, alice`);
    console.log(`  Created ${taskCount} sample tasks`);
    console.log("Seed complete.\n");
    return;
  }

  // Fallback for in-memory mode
  const adminRole = Role.create({
    name: "admin",
    description: "Full access to everything in the app",
    permissions: [
      "task:create",
      "task:edit-own",
      "task:delete-own",
      "task:delete-any",
      "task:list",
      "user:assign-role",
    ],
  });

  const authorRole = Role.create({
    name: "author",
    description: "Can create and manage their own tasks",
    permissions: ["task:create", "task:edit-own", "task:delete-own"],
  });

  console.log(`  Created ${Role.getAll().length} roles: admin, author`);

  const adminPassword = await bcrypt.hash("admin123", 10);
  const alicePassword = await bcrypt.hash("alice123", 10);

  const admin = User.create({
    username: "admin",
    email: "admin@example.com",
    password: adminPassword,
    roleId: adminRole.id,
  });

  const alice = User.create({
    username: "alice",
    email: "alice@example.com",
    password: alicePassword,
    roleId: authorRole.id,
  });

  console.log(`  Created ${User.getAll().length} users: admin, alice`);

  Task.create({
    title: "Welcome to the Task Management API",
    description:
      "This task was created by the admin during seeding. " +
      "Admins can delete any task, not just their own.",
    status: "todo",
    priority: "high",
    dueDate: new Date(),
    userId: admin.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  Task.create({
    title: "My First Author Task",
    description:
      "Hi, I am Alice and I have the user role. " +
      "I can create tasks and edit or delete the ones I own.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(),
    userId: alice.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`  Created ${Task.getAll().length} sample tasks`);
  console.log("Seed complete.\n");
}

module.exports = seedDatabase;
