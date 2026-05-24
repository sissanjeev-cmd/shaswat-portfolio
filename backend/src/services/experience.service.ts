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

export const experienceService = {
  async getPublic(type?: string) {
    return prisma.experience.findMany({
      where: {
        deletedAt: null,
        isArchived: false,
        ...(type ? { type: type as Prisma.EnumExperienceTypeFilter } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async adminList(opts: AdminListOpts) {
    const { page, limit, sort, order, search, includeArchived, includeDeleted } = opts;
    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {
      ...(!includeDeleted ? { deletedAt: null } : {}),
      ...(!includeArchived ? { isArchived: false } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { organization: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.experience.count({ where }),
      prisma.experience.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
    ]);

    return { total, items };
  },

  async getById(id: number) {
    const record = await prisma.experience.findUnique({ where: { id } });
    if (!record) throw new AppError(404, 'Experience not found');
    return record;
  },

  async create(data: Prisma.ExperienceUncheckedCreateInput) {
    return prisma.experience.create({ data });
  },

  async update(id: number, data: Prisma.ExperienceUncheckedUpdateInput) {
    await this.getById(id);
    return prisma.experience.update({ where: { id }, data });
  },

  async softDelete(id: number) {
    await this.getById(id);
    return prisma.experience.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async archive(id: number) {
    await this.getById(id);
    return prisma.experience.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    });
  },

  async restore(id: number) {
    await this.getById(id);
    return prisma.experience.update({
      where: { id },
      data: { isArchived: false, archivedAt: null, deletedAt: null },
    });
  },
};
