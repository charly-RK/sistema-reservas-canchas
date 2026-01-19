import express from 'express';
import cors from 'cors';

import registroRoutes from './rutas/registro.routes';
import canchasRoutes from './rutas/canchas.routes';
import reservacionRoutes from './rutas/reservacion.routes';
import pagoRoutes from './rutas/pago.routes';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/auth', registroRoutes);
app.use('/canchas', canchasRoutes);
app.use('/reservas', reservacionRoutes);

// Protected routes
app.use('/pagos', authMiddleware, pagoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
