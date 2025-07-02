import { z } from 'zod';

const emailField = z
  .string({ required_error: 'Email is required' })
  .email('Must be a valid email');

const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters');

export const registerSchema = z.object({
  email:      z.string().email(),
  password:   z.string().min(6, 'Password must be at least 6 characters'),
  firstName:  z.string().min(1),
  lastName:   z.string().min(1),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;