const request = require('supertest');
const app = require('../../app');

describe('Integration Tests', () => {

  // T1.1
  test('should login succesfully with admin data', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'suep@gmail.com',
        password: 'suep123'
      })

    console.log(res.header['authorization'])
    expect(res.statusCode).toBe(200)
    expect(res.body.result.type).toBe(0)
  })

  // T1.2
  test('should login succesfully with agent data', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'asep@gmail.com',
        password: 'asep123'
      })

    console.log(res.header['authorization'])
    expect(res.statusCode).toBe(200)
    expect(res.body.result.type).toBe(1)
  })

  // T1.3
  test('should return 404 if email is not found', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'invalid@gmail.com',
        password: 'suep123'
      })
    expect(res.body.status).toBe(404)
    expect(res.body.message).toBe('Error: Invalid credentials')
  })

  // T1.4
  test('should return 401 if password is incorrect', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'suep@gmail.com',
        password: 'invalidpassword'
      })
      expect(res.body.status).toBe(401)
      expect(res.body.message).toBe('Error: Invalid credentials')
  })
})