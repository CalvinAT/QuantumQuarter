const request = require('supertest');
const app = require('../../app');

describe('Aprrove property function', () => {
  const agentToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEtMDAxIiwidHlwZSI6MSwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.wqkas9V3Nueq-h-hJ6Z0LlRvu5OVrs4G4Eb0Pcv01nw";
  const adminToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im0tMDAxIiwidHlwZSI6MCwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.hcpfaPhmE3sAM1AmlGwDWeqKjubCUEKyDmHX0ftd-1c";
  const validId = "8CFO9zcW";
  const invalidId = "hehehiha";

  // T2.1
  test('Approve should success with right id and authorization', async () => {
    const res = await request(app)
      .put('/property')
      .set("authorization", adminToken)
      .send({
        propertyId: validId
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Property berhasil diapprove')
  })

  // T2.2
  test('Approve should failed with invalid id', async () => {
    const res = await request(app)
      .put('/property')
      .set("authorization", adminToken)
      .send({
        propertyId: invalidId
      })

    expect(res.statusCode).toBe(404)
  })

  // T2.3
  test('Approve should failed with invalid token', async () => {
    const res = await request(app)
      .put('/property')
      .set("authorization", agentToken)
      .send({
        propertyId: validId
      })

    expect(res.statusCode).toBe(500)
  })
})