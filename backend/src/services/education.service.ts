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

export const educationService = {
  async getPublic() {
    return prisma.education.findMany({
      where: { deletedAt: null, isArchived: false },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async adminList(opts: AdminListOpts) {
    const { page, limit, sort, order, search, includeArchived, includeDeleted } = opts;
    const skip = (page - 1) * limit;

    const where: Prisma.EducationWhereInput = {
      ...(!includeDeleted ? { deletedAt: null } : {}),
      ...(!includeArchived ? { isArchived: false } : {}),
      ...(search
        ? {
            OR: [
              { institution: { contains: search, mode: 'insensitive' } },
              { degree: { contains: search, mode: 'insensitive' } },
              { field: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.education.count({ where }),
      prisma.education.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
    ]);

    return { total, items };
  },

  async getById(id: number) {
    const record = await prisma.education.findUnique({ where: { id } });
    if (!record) throw new AppError(404, 'Education not found');
    return record;
  },

  async create(data: Prisma.EducationUncheckedCreateInput) {
    return prisma.education.create({ data });
  },

  async update(id: number, data: Prisma.EducationUncheckedUpdateInput) {
    await this.getById(id);
    return prisma.education.update({ where: { id }, data });
  },

  async softDelete(id: number) {
    await this.getById(id);
    return prisma.education.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async archive(id: number) {
    await this.getById(id);
    return prisma.education.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    });
  },

  async restore(id: number) {
    await this.getById(id);
    return prisma.education.update({
      where: { id },
      data: { isArchived: false, archivedAt: null, deletedAt: null },
    });
  },
};
