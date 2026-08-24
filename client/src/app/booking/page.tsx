import { BookingModule } from '@/modules/booking';
import { Suspense } from 'react';

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#0D4949]'>
          Loading your booking…
        </div>
      }>
      <BookingModule />
    </Suspense>
  );
}
