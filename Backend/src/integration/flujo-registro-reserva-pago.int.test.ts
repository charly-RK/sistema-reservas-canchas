import { prisma } from '../prisma';
import { RegistroService } from '../services/registro.service';
import { ReservacionService } from '../services/reservacion.service';
import { PagoService } from '../services/pago.service';

// Opcional: mock del servicio de correo para evitar emails reales
jest.mock('../services/correo.service', () => {
  return {
    CorreoService: jest.fn().mockImplementation(() => ({
      enviarConfirmacionReserva: jest.fn().mockResolvedValue(true),
    })),
  };
});

describe('Prueba de integración: Registro → Reserva → Pago', () => {
  const registroService = new RegistroService();
  const reservacionService = new ReservacionService();
  const pagoService = new PagoService();

  let usuarioId: number;
  let canchaId: number;
  let reservaId: number;

  beforeAll(async () => {
    // Limpiar base de datos antes de iniciar
    await prisma.pago.deleteMany();
    await prisma.reserva.deleteMany();
    await prisma.cancha.deleteMany();
    await prisma.usuario.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Flujo completo del sistema', async () => {
    // 1. Registro de usuario
    const usuario = await registroService.register({
      nombre: 'Juan Test',
      email: 'juan@test.com',
      password: '123456',
      rol: 'CLIENTE',
    });

    usuarioId = usuario.id;

    expect(usuario).toHaveProperty('id');
    expect(usuario.email).toBe('juan@test.com');

    // 2. Crear cancha (simula acción admin)
    const cancha = await prisma.cancha.create({
      data: {
        nombre: 'Cancha Fútbol Test',
        tipo: 'FUTBOL',
        precio_hora: 20,
        estado: 'DISPONIBLE',
      },
    });

    canchaId = cancha.id;

    expect(cancha).toHaveProperty('id');
    expect(cancha.tipo).toBe('FUTBOL');

    // 3. Crear reserva
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio.getTime() + 60 * 60 * 1000); // +1 hora

    const reserva = await reservacionService.create({
      usuario_id: usuarioId,
      cancha_id: canchaId,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    reservaId = reserva.id;

    expect(reserva).toHaveProperty('id');
    expect(reserva.estado).toBe('PENDIENTE');

    // 4. Procesar pago
    const pago = await pagoService.processPayment({
      reserva_id: reservaId,
      monto: 20,
      metodo: 'TARJETA',
    });

    expect(pago).toHaveProperty('id');
    expect(pago.estado).toBe('COMPLETADO');

    // 5. Verificar estado final de la reserva
    const reservaFinal = await prisma.reserva.findUnique({
      where: { id: reservaId },
    });

    expect(reservaFinal?.estado).toBe('CONFIRMADA');
  });
});
