import { Router } from 'express';
import { ReservacionController } from '../controllador/reservacion.controller';

const router = Router();
const reservationController = new ReservacionController();

router.post('/', (req, res) => reservationController.create(req, res));
router.get('/user/:userId', (req, res) => reservationController.getByUser(req, res));
router.get('/my-reservations', (req, res) => reservationController.getByUser(req, res));
router.get('/', (req, res) => reservationController.getAll(req, res));
router.delete('/:id', (req, res) => reservationController.cancel(req, res));
router.put('/:id/cancel', (req, res) => reservationController.cancel(req, res));

export default router;
