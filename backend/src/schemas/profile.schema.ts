import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  availabilityText: z.string().optional(),
  focus: z.string().optional(),
  bio: z.array(z.string()).optional(),
  heroHeadline: z.string().optional(),
  heroSubtext: z.string().optional(),
  footerTagline: z.string().optional(),
  yearsExp: z.string().optional(),
  publications: z.number().int().optional(),
  projects: z.string().optional(),
  awards: z.number().int().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
