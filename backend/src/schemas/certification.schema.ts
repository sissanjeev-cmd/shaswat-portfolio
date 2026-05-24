import { z } from 'zod';

export const CertificationCreateSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  url: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const CertificationUpdateSchema = CertificationCreateSchema.partial();
export type CertificationCreate = z.infer<typeof CertificationCreateSchema>;
