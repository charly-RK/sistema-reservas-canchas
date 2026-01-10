import { Request, Response } from 'express';
import { ReservacionService } from '../services/reservacion.service';

const reservacionService = new ReservacionService();

export class ReservacionController {
    async create(req: Request, res: Response) {
        try {
            const reservation = await reservacionService.create(req.body);
            res.status(201).json(reservation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getByUser(req: Request, res: Response) {
        try {

            const userId = Number(req.params.userId || req.query.userId);
            if (!userId) return res.status(400).json({ error: 'Usuario no encontrado' });

            const reservations = await reservacionService.getByUser(userId);
            res.json(reservations);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const reservations = await reservacionService.getAll();
            res.json(reservations);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const reservation = await reservacionService.cancel(Number(req.params.id));
            res.json(reservation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
