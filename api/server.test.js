const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const testUser = { username: 'user', password: '1234' };
const testUserRes = { id: 2, username: 'user' };

const seedUser = { username: 'seeduser', password: '1234' };

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})
beforeEach(async () => {
  await db.seed.run();
})
afterAll(async () => {
  await db.destroy();
})

describe('POST /api/auth/register', () => {
  test('returns the newly registered user', async () => {
    const res = await request(server).post('/api/auth/register').send(testUser);
    expect(res.body).toMatchObject(testUserRes);
  })
  test('responds with an error for missing password', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'nopass' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/);
  })
})

describe('POST /api/auth/login', () => {
  test('retuns a token upon sucessful login', async () => {
    const res = await request(server).post('/api/auth/login').send(seedUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  })
  test('gives an error for unknown username', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'bobunknownprobablyIreallyhopenobodyregisteredthisname', password: 'lol'});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid credentials/);
  })
})

describe('GET /api/jokes', () => {
  test('gives an error if no token', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token required/);
  })
  test('gives an error if invalid token', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'this is not a real token!')
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token invalid/);
  })
  test('returns the data with a valid token', async () => {
    const login = await request(server).post('/api/auth/login').send(seedUser);
    const token = login.body.token;
    const res = await request(server).get('/api/jokes').set('Authorization', token)
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  })
})
