import { z } from 'zod';
import { loginSchema } from './schema';

export type TLoginForm = z.infer<typeof loginSchema>;
