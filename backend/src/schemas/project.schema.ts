import { z } from 'zod';

export const ProjectCreateSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  year: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().optional().default(false),
  githubUrl: z.string().url().optional().nullable(),
  paperUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
