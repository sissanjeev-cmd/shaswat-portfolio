import { z } from 'zod';

export const SkillCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.number().int().min(0).max(100),
  level: z.enum(['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']),
  sortOrder: z.number().int().optional().default(0),
});

export const SkillUpdateSchema = SkillCreateSchema.partial();
export type SkillCreate = z.infer<typeof SkillCreateSchema>;
