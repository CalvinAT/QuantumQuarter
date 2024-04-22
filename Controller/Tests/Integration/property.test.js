const request = require('supertest');
const app = require('../../app');

describe('Integration Tests', () => {
  test('should login with agent data', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'suep@gmail.com',
        password: 'suep123'
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.result.type).toBe(0)
  })

  test('should add new listing if user is logged in as a admin', async () => {
    const res = await request(app)
      .post('/property')
  })
})