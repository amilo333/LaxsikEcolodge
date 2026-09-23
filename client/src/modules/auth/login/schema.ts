import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('invalidEmail')),
    password: z.string().min(6, t('shortPassword')),
  });
