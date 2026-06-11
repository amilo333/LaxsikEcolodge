import { NextIntlClientProvider } from 'next-intl';
import { Toaster as ToasterProvider } from 'sonner';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <NextIntlClientProvider>
      {children}
      <ToasterProvider
        className="toaster-provider"
        position="top-right"
        offset={{ top: '24px', right: '24px' }}
        mobileOffset={{ top: '10px', right: '10px' }}
        toastOptions={{ duration: 5000 }}
      />
    </NextIntlClientProvider>
  );
}
