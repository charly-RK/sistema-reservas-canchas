import { Request, Response } from 'express';
import { RegistroService } from '../services/registro.service';

const authService = new RegistroService();

export class RegistroController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = await authService.login(req.body);
            res.json(data);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
