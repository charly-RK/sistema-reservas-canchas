jest.mock('../../prisma', () => {
  const prismaMock = require('../../__mocks__/prisma').prisma;
  return { prisma: prismaMock };
});

import { PagoService } from '../pago.service';
import { prisma } from '../../prisma';

describe('PagoService', () => {
  let service: PagoService;

  beforeEach(() => {
    service = new PagoService();
    jest.clearAllMocks();
  });

  it('lanza error si la reserva no existe', async () => {
    (prisma.reserva.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.processPayment({ reserva_id: 1 })
    ).rejects.toThrow('Reserva no encontrada');
  });

  it('procesa el pago correctamente', async () => {
    (prisma.reserva.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      estado: 'PENDIENTE',
    });

    (prisma.pago.create as jest.Mock).mockResolvedValue({
      estado: 'COMPLETADO',
    });

    (prisma.reserva.update as jest.Mock).mockResolvedValue({});

    const result = await service.processPayment({
      reserva_id: 1,
      monto: 20,
      metodo: 'TARJETA',
    });

    expect(result.estado).toBe('COMPLETADO');
  });
});
