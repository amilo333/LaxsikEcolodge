'use client';

import { Button } from '@/components/core';
import { Footer, Header } from '@/components/layouts';
import { useProfileApi } from '@/modules/auth/common';
import {
  BookingAuthState,
  BookingProgress,
  BookingStepThree,
} from '@/modules/booking/common';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePaymentStore } from './common';

export function PaymentResultModule() {
  const router = useRouter();
  const handoff = usePaymentStore((state) => state.handoff);
  const clearHandoff = usePaymentStore((state) => state.clearHandoff);
  const [hasHydrated, setHasHydrated] = useState(false);
  const profileQuery = useProfileApi();
  const isUnauthorized =
    axios.isAxiosError(profileQuery.error) &&
    profileQuery.error.response?.status === 401;

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve(usePaymentStore.persist.rehydrate()).finally(() => {
      if (isMounted) setHasHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent('/payment-result')}`
      );
    }
  }, [isUnauthorized, router]);

  const finishPaymentFlow = () => {
    clearHandoff();
    router.push('/rooms');
  };

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />

      <main>
        <BookingProgress activeStep={3} />

        {!hasHydrated || profileQuery.isLoading || isUnauthorized ? (
          <BookingAuthState />
        ) : profileQuery.isError ? (
          <BookingAuthState error onRetry={() => void profileQuery.refetch()} />
        ) : handoff ? (
          <BookingStepThree
            bookingId={handoff.bookingId}
            onFinish={finishPaymentFlow}
          />
        ) : (
          <section className='mx-auto w-[calc(100%-32px)] max-w-[760px] py-12'>
            <div className='rounded-[16px] border border-[#0D4949]/15 bg-white p-8 text-center shadow-[0_18px_55px_rgba(13,73,73,0.09)]'>
              <span className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B87918] text-2xl text-white'>
                !
              </span>
              <h1 className='mt-5 text-2xl font-bold text-[#0D4949]'>
                Payment session not found
              </h1>
              <p className='mx-auto mt-2 max-w-[520px] text-sm leading-6 text-[#68726E]'>
                Open the payment gateway from your booking page in this browser
                so we can securely match the result with your booking.
              </p>
              <Button
                onClick={() => router.push('/rooms')}
                className='mx-auto mt-7 h-12! w-auto! min-w-[180px]! rounded-full! px-8! text-sm!'>
                View rooms
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
