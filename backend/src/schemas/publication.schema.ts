import { z } from 'zod';

export const PublicationCreateSchema = z.object({
  title: z.string().min(1),
  venue: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  description: z.string().min(1),
  url: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const PublicationUpdateSchema = PublicationCreateSchema.partial();
export type PublicationCreate = z.infer<typeof PublicationCreateSchema>;
