import '@/styles/global.scss';
import '@/styles/heroui.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { Providers } from './provider';
import { lora } from '../../public/font/font';

const monserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Laxsik Ecolodge',
  description:
    'A peaceful ecolodge in Lao Chai Valley, surrounded by the mountains and rice terraces of Sa Pa.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html
      lang={locale}
      className={`${monserrat.className} ${monserrat.variable} ${lora.variable} h-full antialiased`}
      data-mode='light'>
      <body className='flex min-h-full flex-col'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
