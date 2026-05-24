import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']).optional().default('ADMIN'),
});

export const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(1).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']).optional(),
  password: z.string().min(8).optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
