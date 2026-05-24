import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

interface AdminListOpts {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search?: string;
  includeArchived?: boolean;
  includeDeleted?: boolean;
}

export const awardService = {
  async getPublic() {
    return prisma.award.findMany({
      where: { deletedAt: null, isArchived: false },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async adminList(opts: AdminListOpts) {
    const { page, limit, sort, order, search, includeArchived, includeDeleted } = opts;
    const skip = (page - 1) * limit;

    const where: Prisma.AwardWhereInput = {
      ...(!includeDeleted ? { deletedAt: null } : {}),
      ...(!includeArchived ? { isArchived: false } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { issuer: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.award.count({ where }),
      prisma.award.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
    ]);

    return { total, items };
  },

  async getById(id: number) {
    const record = await prisma.award.findUnique({ where: { id } });
    if (!record) throw new AppError(404, 'Award not found');
    return record;
  },

  async create(data: Prisma.AwardUncheckedCreateInput) {
    return prisma.award.create({ data });
  },

  async update(id: number, data: Prisma.AwardUncheckedUpdateInput) {
    await this.getById(id);
    return prisma.award.update({ where: { id }, data });
  },

  async softDelete(id: number) {
    await this.getById(id);
    return prisma.award.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async archive(id: number) {
    await this.getById(id);
    return prisma.award.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    });
  },

  async restore(id: number) {
    await this.getById(id);
    return prisma.award.update({
      where: { id },
      data: { isArchived: false, archivedAt: null, deletedAt: null },
    });
  },
};
