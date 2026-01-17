import request from 'supertest';
import app from '../app';

describe('Pruebas de seguridad - Validación de datos', () => {

  it('Debe rechazar reserva con fecha inválida', async () => {
    const res = await request(app)
      .post('/reservas')
      .set('Authorization', 'Bearer token_valido')
      .send({
        fecha: 'texto',
        canchaId: -1
      });

    expect(res.status).toBe(400);
  });

});
