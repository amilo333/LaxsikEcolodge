import { BookingModule } from '@/modules/booking';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

export default async function BookingPage() {
  const t = await getTranslations('Common');
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#0D4949]'>
          {t('loadingBooking')}
        </div>
      }>
      <BookingModule />
    </Suspense>
  );
}
