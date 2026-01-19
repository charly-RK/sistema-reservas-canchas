import { Router } from 'express';
import { ReservacionController } from '../controllador/reservacion.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const reservationController = new ReservacionController();

router.get('/', (req, res) => reservationController.getAll(req, res));

// Protected routes
router.post('/', authMiddleware, (req, res) => reservationController.create(req, res));
router.get('/user/:userId', authMiddleware, (req, res) => reservationController.getByUser(req, res));
router.get('/my-reservations', authMiddleware, (req, res) => reservationController.getByUser(req, res));
router.delete('/:id', authMiddleware, (req, res) => reservationController.cancel(req, res));
router.put('/:id/cancel', authMiddleware, (req, res) => reservationController.cancel(req, res));

export default router;
