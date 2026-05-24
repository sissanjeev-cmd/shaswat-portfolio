import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

interface AdminListOpts {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search?: string;
}

export const contactService = {
  async create(data: {
    firstName: string;
    lastName?: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    return prisma.contactMessage.create({ data });
  },

  async adminList(opts: AdminListOpts & { read?: boolean }) {
    const { page, limit, sort, order, search, read } = opts;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactMessageWhereInput = {
      ...(read !== undefined ? { isRead: read } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { subject: { contains: search, mode: 'insensitive' } },
              { message: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
    ]);

    return { total, items };
  },

  async getById(id: number) {
    const record = await prisma.contactMessage.findUnique({ where: { id } });
    if (!record) throw new AppError(404, 'Contact message not found');
    return record;
  },

  async markRead(id: number) {
    await this.getById(id);
    return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  },

  async delete(id: number) {
    await this.getById(id);
    return prisma.contactMessage.delete({ where: { id } });
  },
};
