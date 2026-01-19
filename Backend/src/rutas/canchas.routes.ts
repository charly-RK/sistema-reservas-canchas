import { Router } from 'express';
import { CanchasController } from '../controllador/canchas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const canchasController = new CanchasController();

router.get('/', (req, res) => canchasController.getAll(req, res));
router.get('/:id', (req, res) => canchasController.getById(req, res));

// Protected routes
router.post('/', authMiddleware, (req, res) => canchasController.create(req, res));
router.put('/:id', authMiddleware, (req, res) => canchasController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => canchasController.delete(req, res));

export default router;
