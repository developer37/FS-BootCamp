require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL;

// If a database URL is configured, the app uses PostgreSQL; otherwise it falls back
// to the in-memory model layer that powers local development and demos.
const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: process.env.POSTGRES_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : null;

const RoleModel = sequelize
  ? sequelize.define('Role', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: false,
      tableName: 'roles',
    })
  : null;

const UserModel = sequelize
  ? sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: false,
      tableName: 'users',
    })
  : null;

const TaskModel = sequelize
  ? sequelize.define('Task', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'todo',
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'medium',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: false,
      tableName: 'tasks',
    })
  : null;

if (sequelize) {
  TaskModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
  UserModel.belongsTo(RoleModel, { foreignKey: 'roleId', as: 'role' });
}

async function connectDatabase() {
  if (!sequelize) {
    console.log('No DATABASE_URL configured. Using in-memory data storage.');
    return false;
  }

  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database successfully.');
    return true;
  } catch (error) {
    console.warn('PostgreSQL connection failed. Falling back to in-memory storage:', error.message);
    return false;
  }
}

async function syncDatabase() {
  if (!sequelize) {
    return false;
  }

  try {
    await sequelize.sync({ alter: true });
    console.log('Database schema synced successfully.');
    return true;
  } catch (error) {
    console.warn('Database schema sync failed; continuing with in-memory storage:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  connectDatabase,
  syncDatabase,
  RoleModel,
  UserModel,
  TaskModel,
};
