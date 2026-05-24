import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

export const profileService = {
  async get() {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });
    if (!profile) throw new AppError(404, 'Profile not configured');
    return profile;
  },

  async upsert(data: Partial<Prisma.ProfileUpdateInput>) {
    return prisma.profile.upsert({
      where: { id: 1 },
      create: { ...(data as Prisma.ProfileCreateInput), id: 1 },
      update: data,
    });
  },
};
