import request from 'supertest';
import app from '../app';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

describe('Pruebas de seguridad - Protección de datos', () => {

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.usuario.upsert({
      where: { email: 'user@test.com' },
      update: { password: hashedPassword },
      create: {
        nombre: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        rol: 'CLIENTE'
      }
    });
  });

  afterAll(async () => {
    // Opcional: Limpiar usuario si se desea
    // await prisma.usuario.delete({ where: { email: 'user@test.com' } });
    await prisma.$disconnect();
  });

  it('No debe exponer contraseña ni token', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', password: '123456' });

    expect(login.status).toBe(200);
    expect(login.body.password).toBeUndefined();
    expect(login.body.token).toBeDefined();
  });

});
