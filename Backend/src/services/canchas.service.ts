import { prisma } from '../index';

export class CanchasService {
    async getAll() {
        return prisma.cancha.findMany();
    }

    async getById(id: number) {
        return prisma.cancha.findUnique({ where: { id } });
    }

    async create(data: any) {
        return prisma.cancha.create({ data });
    }

    async update(id: number, data: any) {
        return prisma.cancha.update({ where: { id }, data });
    }

    async delete(id: number) {
        return prisma.cancha.delete({ where: { id } });
    }
}
