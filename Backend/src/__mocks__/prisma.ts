export const prisma = {
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  reserva: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  pago: {
    create: jest.fn(),
  },
};
