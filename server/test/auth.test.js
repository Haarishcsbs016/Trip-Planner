const { test, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

let mockUsers = [];

before(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_12345';

  // Mock User model methods for fast, standalone testing
  User.findOne = (query) => {
    const found = mockUsers.find((u) => u.email === (query.email ? query.email.toLowerCase() : ''));
    const result = found
      ? {
          ...found,
          comparePassword: async (pwd) => pwd === found._rawPassword,
          save: async function () {
            return this;
          },
        }
      : null;

    return {
      select: () => Promise.resolve(result),
      then: (resolve) => resolve(result),
    };
  };

  User.create = async (data) => {
    const newUser = {
      _id: `507f191e810c19729de86${String(mockUsers.length + 10).padStart(3, '0')}`,
      name: data.name,
      email: data.email.toLowerCase(),
      _rawPassword: data.password,
      avatar: '',
      createdAt: new Date().toISOString(),
      comparePassword: async (pwd) => pwd === data.password,
      save: async function () {
        return this;
      },
    };
    mockUsers.push(newUser);
    return newUser;
  };

  User.findById = (id) => {
    const found = mockUsers.find((u) => String(u._id) === String(id));
    return {
      select: () => Promise.resolve(found || null),
      then: (resolve) => resolve(found || null),
    };
  };
});

beforeEach(() => {
  mockUsers = [];
});

test('1. Registration - Successfully registers a new user', async () => {
  const testUser = {
    name: 'Test Explorer',
    email: 'newuser@test.com',
    password: 'Password123!',
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(testUser)
    .expect(201);

  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, 'newuser@test.com');
  assert.equal(res.body.user.name, 'Test Explorer');
});

test('2. Registration - Rejects registration with duplicate email', async () => {
  mockUsers.push({
    _id: '507f191e810c19729de86001',
    name: 'Existing User',
    email: 'duplicate@test.com',
    _rawPassword: 'Password123!',
  });

  const duplicateUser = {
    name: 'Duplicate User',
    email: 'duplicate@test.com',
    password: 'Password123!',
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(duplicateUser)
    .expect(400);

  assert.equal(res.body.success, false);
  assert.match(res.body.message, /already exists/i);
});

test('3. Registration - Rejects invalid registration payload', async () => {
  const invalidUser = {
    name: '',
    email: 'invalid-email',
    password: '123',
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(invalidUser)
    .expect(400);

  assert.equal(res.body.success, false);
  assert.ok(res.body.errors);
});

test('4. Login - Successfully logs in with valid credentials', async () => {
  mockUsers.push({
    _id: '507f191e810c19729de86002',
    name: 'Login User',
    email: 'login@test.com',
    _rawPassword: 'Password123!',
  });

  const credentials = {
    email: 'login@test.com',
    password: 'Password123!',
  };

  const res = await request(app)
    .post('/api/auth/login')
    .send(credentials)
    .expect(200);

  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, 'login@test.com');
});

test('5. Login - Rejects incorrect password', async () => {
  mockUsers.push({
    _id: '507f191e810c19729de86003',
    name: 'Login User',
    email: 'login@test.com',
    _rawPassword: 'Password123!',
  });

  const badCredentials = {
    email: 'login@test.com',
    password: 'WrongPassword!',
  };

  const res = await request(app)
    .post('/api/auth/login')
    .send(badCredentials)
    .expect(401);

  assert.equal(res.body.success, false);
  assert.match(res.body.message, /invalid/i);
});

test('6. Login - Rejects non-existent email', async () => {
  const missingUser = {
    email: 'nonexistent@test.com',
    password: 'Password123!',
  };

  const res = await request(app)
    .post('/api/auth/login')
    .send(missingUser)
    .expect(401);

  assert.equal(res.body.success, false);
  assert.match(res.body.message, /invalid/i);
});

test('7. CORS - Preflight OPTIONS request returns correct CORS headers for Vercel origin', async () => {
  const res = await request(app)
    .options('/api/auth/register')
    .set('Origin', 'https://wanderwise-app.vercel.app')
    .set('Access-Control-Request-Method', 'POST');

  assert.equal(res.headers['access-control-allow-origin'], 'https://wanderwise-app.vercel.app');
  assert.equal(res.headers['access-control-allow-credentials'], 'true');
});

test('8. Route Alias - Endpoint /auth/register works identically to /api/auth/register', async () => {
  const aliasUser = {
    name: 'Alias User',
    email: 'alias@test.com',
    password: 'Password123!',
  };

  const res = await request(app)
    .post('/auth/register')
    .send(aliasUser)
    .expect(201);

  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
});

test('9. Protected Route - /api/auth/me returns user profile when token is provided', async () => {
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Me User', email: 'me@test.com', password: 'Password123!' });

  const token = regRes.body.token;

  const res = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  assert.equal(res.body.success, true);
  assert.equal(res.body.user.email, 'me@test.com');
});

test('10. Protected Route - /api/auth/me rejects request without token', async () => {
  const res = await request(app)
    .get('/api/auth/me')
    .expect(401);

  assert.equal(res.body.success, false);
});
