import { Router } from 'express';
import { RegistroController } from '../controllador/registro.controller';

const router = Router();
const registroController = new RegistroController();

router.post('/register', (req, res) => registroController.register(req, res));
router.post('/login', (req, res) => registroController.login(req, res));

export default router;
