// Music Explorer API Server

// TODO: Import express, cors, dotenv
// TODO: Import { sequelize, connectDatabase } from './config/database'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDatabase } = require('./config/database');

// TODO: Call dotenv.config()
dotenv.config();

// TODO: Create Express app
// TODO: Set PORT from process.env.PORT or 3000
const app = express();
const PORT = process.env.PORT || 3000;



// TODO: Apply middleware: cors() and express.json()
app.use(cors());
app.use(express.json());

// TODO: Import route files
//   - searchRouter from './routes/search'
//   - favoritesRouter from './routes/favorites'
const searchRouter = require('./routes/search');
const favoritesRouter = require('./routes/favorites');


// TODO: Mount routes
//   - app.use('/api/search', searchRouter)
//   - app.use('/api/favorites', favoritesRouter)
app.use('/api/search', searchRouter);
app.use('/api/favorites', favoritesRouter);

// TODO: Create root GET '/' route that returns a welcome message with available endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Music Explorer API!',
    endpoints: {
      search: 'GET /api/search?q=your+search+query',
      favorites: {
        getAll: 'GET /api/favorites',
        getOne: 'GET /api/favorites/:id',
        create: 'POST /api/favorites',
        delete: 'DELETE /api/favorites/:id'
      }
    }
  });
});

// TODO: Add 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// TODO: Create async startServer function that:
//   1. Calls connectDatabase()
//   2. Calls sequelize.sync({ alter: true })
//   3. Starts app.listen(PORT) with console.log
async function startServer() {
  await connectDatabase();
  await sequelize.sync({ alter: true });
  console.log('Database tables synced!');

  app.listen(PORT, () => {
    console.log(`\nMusic Explorer API`);
    console.log(`==========================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET    /api/search?q=query`);
    console.log(`  GET    /api/favorites`);
    console.log(`  GET    /api/favorites/:id`);
    console.log(`  POST   /api/favorites`);
    console.log(`  DELETE /api/favorites/:id`);
    console.log(`\n==========================\n`);
  });
}

// TODO: Call startServer()
startServer();
