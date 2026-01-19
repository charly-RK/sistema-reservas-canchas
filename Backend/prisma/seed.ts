/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log(' Iniciando seed de la base de datos...');

    // Limpiar datos existentes (opcional)
    await prisma.pago.deleteMany();
    await prisma.reserva.deleteMany();
    await prisma.cancha.deleteMany();

    console.log('Datos anteriores limpiados');

    // Crear canchas de fútbol
    const futbol1 = await prisma.cancha.create({
        data: {
            nombre: 'Cancha de Fútbol 1',
            tipo: 'FUTBOL',
            precio_hora: 50,
            estado: 'DISPONIBLE',
        },
    });

    const futbol2 = await prisma.cancha.create({
        data: {
            nombre: 'Cancha de Fútbol 2',
            tipo: 'FUTBOL',
            precio_hora: 60,
            estado: 'DISPONIBLE',
        },
    });

    // Crear cancha de tenis
    const tenis1 = await prisma.cancha.create({
        data: {
            nombre: 'Cancha de Tenis 1',
            tipo: 'TENIS',
            precio_hora: 30,
            estado: 'DISPONIBLE',
        },
    });

    // Crear cancha de básquetbol
    const basquet1 = await prisma.cancha.create({
        data: {
            nombre: 'Cancha de Básquetbol 1',
            tipo: 'BASQUET',
            precio_hora: 40,
            estado: 'DISPONIBLE',
        },
    });

    // Crear una cancha en mantenimiento
    const futbol3 = await prisma.cancha.create({
        data: {
            nombre: 'Cancha de Fútbol 3',
            tipo: 'FUTBOL',
            precio_hora: 55,
            estado: 'MANTENIMIENTO',
        },
    });

    console.log('Canchas creadas:');
    console.log(`   - ${futbol1.nombre} ($${futbol1.precio_hora}/hora)`);
    console.log(`   - ${futbol2.nombre} ($${futbol2.precio_hora}/hora)`);
    console.log(`   - ${tenis1.nombre} ($${tenis1.precio_hora}/hora)`);
    console.log(`   - ${basquet1.nombre} ($${basquet1.precio_hora}/hora)`);
    console.log(`   - ${futbol3.nombre} ($${futbol3.precio_hora}/hora) - EN MANTENIMIENTO`);

    console.log(`   - ${futbol3.nombre} ($${futbol3.precio_hora}/hora) - EN MANTENIMIENTO`);

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('123456', 10);

    await prisma.usuario.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            nombre: 'Test User',
            email: 'user@test.com',
            password: hashedPassword,
            rol: 'CLIENTE'
        }
    });
    console.log('Usuario de prueba creado: user@test.com / 123456');

    console.log('\nSeed completado exitosamente!');
}

main()
    .catch((e) => {
        console.error('Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
