import { z } from 'zod';

export const registerSchema = z
  .object({
    full_name: z.string().min(1, 'Please enter your first and last name.'),
    email: z.email('Invalid email address'),
    phone: z.string().min(8, 'Phone must be at least 8 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      full_name: z.string().min(1, t('requiredName')),
      email: z.email(t('invalidEmail')),
      phone: z.string().min(8, t('shortPhone')),
      password: z.string().min(6, t('shortPassword')),
      confirmPassword: z.string().min(6, t('shortPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword'],
    });
