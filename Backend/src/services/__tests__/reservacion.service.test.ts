jest.mock('../../index', () => {
  const { prisma } = require('../../__mocks__/prisma');
  return { prisma };
});

jest.mock('../correo.service', () => ({
  CorreoService: jest.fn().mockImplementation(() => ({
    enviarConfirmacionReserva: jest.fn(),
  })),
}));

import { ReservacionService } from '../reservacion.service';
import { prisma } from '../../prisma';

describe('ReservacionService', () => {
  const service = new ReservacionService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lanza error si existe conflicto de horario', async () => {
    (prisma.reserva.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(
      service.create({
        cancha_id: 1,
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
      })
    ).rejects.toThrow('La cancha ya está reservada para este horario.');
  });

  it('crea reserva si no hay conflicto', async () => {
    (prisma.reserva.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.reserva.create as jest.Mock).mockResolvedValue({
      id: 1,
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      usuario: { email: 'test@test.com', nombre: 'Test' },
      cancha: { nombre: 'Cancha', tipo: 'Fútbol', precio_hora: 10 },
    });

    const result = await service.create({
      usuario_id: 1,
      cancha_id: 1,
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
    });

    expect(result.id).toBe(1);
  });
});
