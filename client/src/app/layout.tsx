import '@/styles/global.scss';
import '@/styles/heroui.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Montserrat } from 'next/font/google';
import { Providers } from './provider';
import { lora } from '../../public/font/font';

const monserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.root');
  return { title: t('title'), description: t('description') };
}

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
