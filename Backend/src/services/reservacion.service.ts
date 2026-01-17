import { prisma } from '../prisma';
import { CorreoService } from './correo.service';

const emailService = new CorreoService();

export class ReservacionService {
    async create(data: any) {
        // Verificar si hay conflictos
        const conflict = await prisma.reserva.findFirst({
            where: {
                cancha_id: data.cancha_id,
                estado: { not: 'CANCELADA' },
                OR: [
                    {
                        fecha_inicio: { lte: data.fecha_inicio },
                        fecha_fin: { gt: data.fecha_inicio },
                    },
                    {
                        fecha_inicio: { lt: data.fecha_fin },
                        fecha_fin: { gte: data.fecha_fin },
                    },
                ],
            },
        });

        if (conflict) {
            throw new Error('La cancha ya está reservada para este horario.');
        }

        const reservation = await prisma.reserva.create({
            data: {
                usuario_id: data.usuario_id,
                cancha_id: data.cancha_id,
                fecha_inicio: data.fecha_inicio,
                fecha_fin: data.fecha_fin,
                estado: 'PENDIENTE',
            },
            include: {
                usuario: true,
                cancha: true,
            },
        });

        // Enviar correo de confirmación
        try {
            const duracionHoras = (new Date(reservation.fecha_fin).getTime() - new Date(reservation.fecha_inicio).getTime()) / (1000 * 60 * 60);
            const totalPrice = reservation.cancha.precio_hora * duracionHoras;

            await emailService.enviarConfirmacionReserva({
                userEmail: reservation.usuario.email,
                userName: reservation.usuario.nombre,
                courtName: reservation.cancha.nombre,
                courtType: reservation.cancha.tipo,
                startDate: new Date(reservation.fecha_inicio),
                endDate: new Date(reservation.fecha_fin),
                totalPrice,
            });
        } catch (emailError) {
            console.error('Error enviando correo de confirmación:', emailError);
            // No lanzamos error para que la reserva se complete aunque falle el email
        }

        return reservation;
    }

    async getByUser(userId: number) {
        return prisma.reserva.findMany({
            where: { usuario_id: userId },
            include: { cancha: true },
        });
    }

    async getAll() {
        return prisma.reserva.findMany({
            include: { usuario: true, cancha: true },
        });
    }

    async cancel(id: number) {
        return prisma.reserva.update({
            where: { id },
            data: { estado: 'CANCELADA' },
        });
    }
}
