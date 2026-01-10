import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import registroRoutes from './rutas/registro.routes';
import canchasRoutes from './rutas/canchas.routes';
import reservacionRoutes from './rutas/reservacion.routes';
import pagoRoutes from './rutas/pago.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/registro', registroRoutes);
app.use('/api/canchas', canchasRoutes);
app.use('/api/reservaciones', reservacionRoutes);
app.use('/api/pagos', pagoRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { prisma };
