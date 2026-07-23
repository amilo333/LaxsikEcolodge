import { z } from 'zod';
import { registerSchema } from './schema';

export type TRegisterForm = z.infer<typeof registerSchema>;
