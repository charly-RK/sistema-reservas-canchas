import { Request, Response } from 'express';
import { PagoService } from '../services/pago.service';

const paymentService = new PagoService();

export class PagoController {
    async process(req: Request, res: Response) {
        try {
            const payment = await paymentService.processPayment(req.body);
            res.status(201).json(payment);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
