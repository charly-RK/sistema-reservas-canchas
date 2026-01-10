import { Router } from 'express';
import { PagoController } from '../controllador/pago.controller';

const router = Router();
const pagoController = new PagoController();

router.post('/', (req, res) => pagoController.process(req, res));

export default router;
