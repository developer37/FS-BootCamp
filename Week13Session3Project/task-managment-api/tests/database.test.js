const assert = require('node:assert/strict');
const { describe, it } = require('mocha');
const { connectDatabase, syncDatabase, sequelize } = require('../config/database');

// Smoke test: confirm the configured DB is reachable and that the expected tables
// are created after the schema sync step.
describe('database configuration', function () {
  this.timeout(30000);

  it('connects and creates the expected tables when DATABASE_URL is configured', async function () {
    this.timeout(30000);

    if (!sequelize) {
      this.skip();
    }

    const connected = await connectDatabase();
    assert.equal(connected, true, 'Sequelize should connect to PostgreSQL successfully.');

    const synced = await syncDatabase();
    assert.equal(synced, true, 'Sequelize should sync the schema and create tables.');

    const tables = await sequelize.getQueryInterface().showAllTables();
    const requiredTables = ['roles', 'users', 'tasks'];

    for (const tableName of requiredTables) {
      assert.ok(tables.includes(tableName), `Expected table ${tableName} to exist after sync.`);
    }

    console.log('Database smoke test passed. Tables:', tables);
  });
});
