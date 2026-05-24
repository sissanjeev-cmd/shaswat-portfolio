import { z } from 'zod';

export const ContactMessageSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactMessageCreate = z.infer<typeof ContactMessageSchema>;
