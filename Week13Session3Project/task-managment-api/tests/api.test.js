const assert = require('node:assert/strict');
const { describe, it, beforeEach } = require('mocha');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-this-in-production';
process.env.JWT_SECRET = JWT_SECRET;

const { app } = require('../server');
const Role = require('../models/Role');
const User = require('../models/User');
const Task = require('../models/Task');
const seedDatabase = require('../seeds/seedData');

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      roleName: Role.findById(user.roleId)?.name || 'unknown',
    },
    JWT_SECRET,
    { expiresIn: '17d' }
  );
}

describe('Task Management API', function () {
  this.timeout(20000);

  beforeEach(async function () {
    this.timeout(20000);
    Role.reset();
    User.reset();
    Task.reset();
    await seedDatabase();
  });

  it('GET /roles returns the seeded roles and permissions', async function () {
    const response = await request(app).get('/roles');

    assert.equal(response.status, 200);
    assert.equal(response.body.count, 2);
    assert.deepEqual(
      response.body.roles.map((role) => role.name).sort(),
      ['admin', 'author']
    );
    assert.ok(response.body.roles.some((role) => role.name === 'admin' && role.permissions.includes('task:delete-any')));
  });

  it('registers a user and allows login with the generated token', async function () {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'password123',
      });

    assert.equal(registerResponse.status, 201);
    assert.equal(registerResponse.body.user.username, 'charlie');
    assert.ok(registerResponse.body.token);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'charlie',
        password: 'password123',
      });

    assert.equal(loginResponse.status, 200);
    assert.equal(loginResponse.body.user.username, 'charlie');
    assert.ok(loginResponse.body.token);
  });

  it('returns the authenticated users profile from /api/auth/me', async function () {
    const self = User.findByUsername('alice');
    const token = signToken(self);

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.user.username, 'alice');
    assert.equal(response.body.user.roleName, 'author');
  });

  it('allows an author to create tasks and prevents other users from editing someone else\'s task', async function () {
    const author = User.findByUsername('alice');
    const admin = User.findByUsername('admin');
    const authorToken = signToken(author);
    const adminToken = signToken(admin);

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        title: 'Ship the new release',
        description: 'Prepare the release notes and deployment checklist for launch.',
        status: 'todo',
        priority: 'high',
      });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.task.title, 'Ship the new release');

    const userTaskList = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authorToken}`)
      .query({ status: 'todo' });

    assert.equal(userTaskList.status, 200);
    assert.equal(userTaskList.body.count, 1);
    assert.equal(userTaskList.body.tasks[0].title, 'Ship the new release');

    const adminTaskList = await request(app)
      .get('/api/admin/tasks')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(adminTaskList.status, 200);
    assert.ok(adminTaskList.body.tasks.some((task) => task.title === 'Ship the new release'));

    const otherUser = User.create({
      username: 'charlie',
      email: 'charlie@example.com',
      password: 'hashed-password',
      roleId: Role.findByName('author').id,
    });

    const otherUserToken = signToken(otherUser);
    const forbiddenResponse = await request(app)
      .put(`/api/tasks/${createResponse.body.task.id}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'Hacked title' });

    assert.equal(forbiddenResponse.status, 403);
    assert.match(forbiddenResponse.body.error, /only edit your own tasks/i);
  });
});
