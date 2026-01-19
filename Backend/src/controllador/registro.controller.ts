import { Request, Response } from 'express';
import { RegistroService } from '../services/registro.service';

const authService = new RegistroService();

export class RegistroController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, nombre } = req.body;
            if (!email || !password || !nombre) {
                res.status(400).json({ error: 'Faltan campos requeridos' });
                return;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                res.status(400).json({ error: 'Email inválido' });
                return;
            }
            if (password.length < 6) {
                res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
                return;
            }

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
