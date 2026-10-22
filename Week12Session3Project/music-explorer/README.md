# Music Explorer API

RESTful API for searching music from iTunes and saving favorite tracks in PostgreSQL.

## Architecture Diagram

```mermaid
flowchart TD
    A["Client<br/>Browser/Postman/curl"] -->|HTTP JSON| B["Express API<br/>server.js"]
    B --> C["/api/search<br/>routes/search.js"]
    B --> D["/api/favorites<br/>routes/favorites.js"]

    C --> E["searchTracks()<br/>config/music.js"]
    E --> F["iTunes Search API"]

    D --> G["Favorite Model<br/>models/Favorite.js"]
    G --> H["Sequelize ORM<br/>config/database.js"]
    H --> I[(PostgreSQL)]

    B --> J["dotenv<br/>.env"]
    B --> H
```

## Application Flow

### Startup Flow
1. [server.js](./server.js) loads environment values with `dotenv`.
2. [config/database.js](./config/database.js) creates a Sequelize PostgreSQL connection:
   - Uses `DATABASE_URL` (cloud) when present.
   - Falls back to `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` (local).
3. `connectDatabase()` runs `sequelize.authenticate()`.
4. `sequelize.sync({ alter: true })` ensures table shape matches the model.
5. Express starts listening on `PORT` (default `3000`).

### Request Flow
- **Search request**
  1. `GET /api/search?q=<term>` reaches [routes/search.js](./routes/search.js).
  2. Route validates `q` exists.
  3. Calls `searchTracks()` in [config/music.js](./config/music.js).
  4. iTunes response is transformed into simplified track objects.
  5. Returns `{ query, count, tracks }`.

- **Favorites create**
  1. `POST /api/favorites` reaches [routes/favorites.js](./routes/favorites.js).
  2. Required fields are validated.
  3. Duplicate `trackId` is checked.
  4. Record is inserted via [models/Favorite.js](./models/Favorite.js).
  5. Returns `201` with created row.

- **Favorites read / delete**
  - `GET /api/favorites`: returns all favorites ordered by `addedAt DESC`.
  - `GET /api/favorites/:id`: returns one favorite by primary key.
  - `DELETE /api/favorites/:id`: deletes existing favorite and returns deleted row.

## Project Structure

```text
config/
  database.js      # Sequelize setup and DB connection
  music.js         # iTunes search integration
models/
  Favorite.js      # Favorite track Sequelize model
routes/
  search.js        # Search endpoint
  favorites.js     # Favorites CRUD endpoints
server.js          # Express app bootstrap and route mounting
```

## Setup

### Prerequisites
- Node.js 18+ (or newer)
- PostgreSQL running locally (or a cloud PostgreSQL URL)

### Environment
Create `.env` in project root with:

```env
DB_NAME=music_favorites_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=3000
```

Optional cloud mode:

```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
PORT=3000
```

### Install and Run
```bash
npm install
npm start
```

For development auto-reload:
```bash
npm run dev
```

## Testing

There is currently no automated test suite configured in [package.json](./package.json), so testing is done with API smoke checks.

### Manual API Smoke Tests (PowerShell examples)

Launch Postman and import the Postman collection provided to test the end-points.

## Notes

- Sequelize and PostgreSQL driver versions are aligned (`sequelize@6.x` with `pg@8.x`).
- `sequelize.sync({ alter: true })` is convenient for development. For production systems, prefer migrations for controlled schema changes.
