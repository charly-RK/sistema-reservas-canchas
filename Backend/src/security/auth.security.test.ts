import request from 'supertest';
import app from '../app';

describe('Pruebas de seguridad - Control de acceso', () => {

  it('Debe bloquear acceso a reservas sin autenticación', async () => {
    const res = await request(app).post('/reservas');
    expect(res.status).toBe(401);
  });

  it('Debe bloquear pago sin token', async () => {
    const res = await request(app)
      .post('/pagos')
      .send({ reservaId: 1, monto: 20 });

    expect(res.status).toBe(401);
  });

});
