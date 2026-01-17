import express from 'express';
import cors from 'cors';

import registroRoutes from './rutas/registro.routes';
import canchasRoutes from './rutas/canchas.routes';
import reservacionRoutes from './rutas/reservacion.routes';
import pagoRoutes from './rutas/pago.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/registro', registroRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/reservaciones', reservacionRoutes);
app.use('/api/pagos', pagoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
