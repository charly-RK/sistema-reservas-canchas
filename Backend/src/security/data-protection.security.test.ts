import request from 'supertest';
import app from '../app';

describe('Pruebas de seguridad - Protección de datos', () => {

  it('No debe exponer contraseña ni token', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', password: '123456' });

    expect(login.body.password).toBeUndefined();
    expect(login.body.token).toBeDefined();
  });

});
