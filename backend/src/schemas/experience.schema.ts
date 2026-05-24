import { z } from 'zod';

export const ExperienceCreateSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  type: z.enum(['INDUSTRY', 'RESEARCH']),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional().default(false),
  description: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  sortOrder: z.number().int().optional().default(0),
});

export const ExperienceUpdateSchema = ExperienceCreateSchema.partial();
export type ExperienceCreate = z.infer<typeof ExperienceCreateSchema>;
