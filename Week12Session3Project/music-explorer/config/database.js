// Database Connection Module
// TODO: Import Sequelize from 'sequelize'
// TODO: Import dotenv and call .config()
//   IMPORTANT: dotenv MUST be loaded here (not just in server.js)
//   because this file reads env variables when it's first imported
const { Sequelize } = require('sequelize');
require('dotenv').config();


// TODO: Create a Sequelize instance
// - If process.env.DATABASE_URL exists, use it (for Supabase cloud)
//   - Add dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
// - Otherwise, use individual env variables: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST
let sequelize;

if (process.env.DATABASE_URL) {
  // Cloud connection (Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
  } else {
  // Local connection
  sequelize = new Sequelize(
    process.env.DB_NAME || 'music_favorites_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      logging: false
    }
  );
}
//   - Set dialect to 'postgres'
//   - Set logging to false


// TODO: Create a connectDatabase async function that:
//   - Calls sequelize.authenticate()
//   - Logs "Connected to PostgreSQL successfully!"
//   - Catches errors and logs them
//   - Exits process on failure: process.exit(1)
async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL successfully!');
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
}


// TODO: Export { sequelize, connectDatabase }
module.exports = { sequelize, connectDatabase };
