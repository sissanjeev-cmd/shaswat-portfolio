import { z } from 'zod';

export const EducationCreateSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const EducationUpdateSchema = EducationCreateSchema.partial();
export type EducationCreate = z.infer<typeof EducationCreateSchema>;
