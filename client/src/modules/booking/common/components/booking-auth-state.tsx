'use client';

import { Button } from '@/components/core';
import { useTranslations } from 'next-intl';

type TBookingAuthStateProps = {
  error?: boolean;
  onRetry?: () => void;
};

export function BookingAuthState({
  error = false,
  onRetry,
}: TBookingAuthStateProps) {
  const t = useTranslations('Booking.authState');
  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/images/bg-screen.jpg')] px-4 text-center text-[#0D4949]">
      <div className='rounded-[16px] bg-white px-8 py-7 font-semibold shadow-lg'>
        {error ? (
          <>
            <p>{t('error')}</p>
            <Button
              onClick={onRetry}
              className='mt-3 h-10! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-sm! text-[#0D4949]!'>
              {t('tryAgain')}
            </Button>
          </>
        ) : (
          t('checking')
        )}
      </div>
    </main>
  );
}
