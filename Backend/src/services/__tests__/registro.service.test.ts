jest.mock('../../prisma', () => {
  const prismaMock = require('../../__mocks__/prisma').prisma;
  return { prisma: prismaMock };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

import { RegistroService } from '../registro.service';
import { prisma } from '../../prisma';
import bcrypt from 'bcryptjs';

describe('RegistroService', () => {
  const service = new RegistroService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registra un usuario nuevo', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');

    (prisma.usuario.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      rol: 'CLIENTE',
    });

    const result = await service.register({
      nombre: 'Test',
      email: 'test@test.com',
      password: '1234',
    });

    expect(result.email).toBe('test@test.com');
  });

  it('lanza error si el email ya existe', async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(
      service.register({
        nombre: 'Test',
        email: 'test@test.com',
        password: '1234',
      })
    ).rejects.toThrow('Email ya en uso');
  });
});
