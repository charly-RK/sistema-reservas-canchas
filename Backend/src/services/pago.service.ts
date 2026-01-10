import { prisma } from '../index';

export class PagoService {
    async processPayment(data: any) {
        // Procesar el pago
        const reservation = await prisma.reserva.findUnique({ where: { id: data.reserva_id } });
        if (!reservation) throw new Error('Reserva no encontrada');

        if (reservation.estado === 'CANCELADA') throw new Error('No se puede pagar por una reserva cancelada');

        // Si el pago es exitoso
        const payment = await prisma.pago.create({
            data: {
                reserva_id: data.reserva_id,
                monto: data.monto,
                metodo: data.metodo,
                estado: 'COMPLETADO',
            },
        });

        // actualizar estado de la reserva
        await prisma.reserva.update({
            where: { id: data.reserva_id },
            data: { estado: 'CONFIRMADA' },
        });

        return payment;
    }
}
