import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

export class RegistroService {
    async register(data: any) {
        const existingUser = await prisma.usuario.findUnique({ where: { email: data.email } });
        if (existingUser) throw new Error('Email ya en uso');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.usuario.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                password: hashedPassword,
                rol: data.rol || 'CLIENTE',
            },
        });
    }

    async login(data: any) {
        const user = await prisma.usuario.findUnique({ where: { email: data.email } });
        if (!user) throw new Error('Credenciales invalidas');

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) throw new Error('Credenciales invalidas');

        const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET_KEY, { expiresIn: '24h' });

        // Devolver usuario sin contraseña
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
