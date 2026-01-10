import { Router } from 'express';
import { CanchasController } from '../controllador/canchas.controller';

const router = Router();
const canchasController = new CanchasController();

router.get('/', (req, res) => canchasController.getAll(req, res));
router.get('/:id', (req, res) => canchasController.getById(req, res));
router.post('/', (req, res) => canchasController.create(req, res));
router.put('/:id', (req, res) => canchasController.update(req, res));
router.delete('/:id', (req, res) => canchasController.delete(req, res));

export default router;
