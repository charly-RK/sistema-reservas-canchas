import { Request, Response } from 'express';
import { CanchasService } from '../services/canchas.service';

const courtService = new CanchasService();

export class CanchasController {
    async getAll(req: Request, res: Response) {
        try {
            const courts = await courtService.getAll();
            res.json(courts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const court = await courtService.getById(Number(req.params.id));
            if (!court) return res.status(404).json({ error: 'cancha no encontrada' });
            res.json(court);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const court = await courtService.create(req.body);
            res.status(201).json(court);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const court = await courtService.update(Number(req.params.id), req.body);
            res.json(court);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await courtService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
