import { z } from 'zod';

export const AwardCreateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  description: z.string().optional().nullable(),
  badgeText: z.string().min(1),
  badgeColor: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const AwardUpdateSchema = AwardCreateSchema.partial();
export type AwardCreate = z.infer<typeof AwardCreateSchema>;
