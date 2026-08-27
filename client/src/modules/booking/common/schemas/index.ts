import { z } from 'zod';

export const bookingDetailsSchema = z.object({
  fullNameContact: z.string().trim().min(2, 'Please enter the guest name.'),
  emailContact: z.email('Please enter a valid email address.'),
  phoneContact: z.string().trim().min(8, 'Please enter a valid phone number.'),
  note: z.string().trim().max(1000, 'The note is too long.'),
  paymentMethod: z.literal('vnpay'),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'Please accept the terms and conditions.',
  }),
});
