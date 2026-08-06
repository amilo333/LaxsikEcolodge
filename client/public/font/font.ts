import { Lora, Montserrat } from 'next/font/google';

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});
