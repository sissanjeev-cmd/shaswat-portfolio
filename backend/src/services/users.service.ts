import { AdminRole, AdminUser, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

const safeUser = (u: AdminUser) => ({ ...u, passwordHash: undefined });

export const usersService = {
  async list() {
    const users = await prisma.adminUser.findMany();
    return users.map(safeUser);
  },

  async getByEmail(email: string) {
    return prisma.adminUser.findUnique({ where: { email } });
  },

  async getById(id: number) {
    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'User not found');
    return safeUser(user);
  },

  async create(data: {
    email: string;
    passwordHash: string;
    displayName: string;
    role: AdminRole;
  }) {
    try {
      const user = await prisma.adminUser.create({ data });
      return safeUser(user);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new AppError(409, 'Email already in use');
      }
      throw err;
    }
  },

  async update(
    id: number,
    data: {
      email?: string;
      displayName?: string;
      role?: AdminRole;
      passwordHash?: string;
    },
  ) {
    await this.getById(id);
    const user = await prisma.adminUser.update({ where: { id }, data });
    return safeUser(user);
  },

  async activate(id: number) {
    await this.getById(id);
    const user = await prisma.adminUser.update({ where: { id }, data: { isActive: true } });
    return safeUser(user);
  },

  async deactivate(id: number) {
    await this.getById(id);
    const user = await prisma.adminUser.update({ where: { id }, data: { isActive: false } });
    return safeUser(user);
  },

  async delete(id: number) {
    await this.getById(id);
    return prisma.adminUser.delete({ where: { id } });
  },
};
