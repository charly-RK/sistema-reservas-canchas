import request from 'supertest';
import app from '../app';

describe('Pruebas de seguridad - Inyección', () => {

  it('Debe rechazar intento de SQL Injection en login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: "test@test.com' OR '1'='1",
        password: "123456"
      });

    expect(res.status).toBe(401);
  });

});
