import { Button } from '@/components/core';
import { TUser } from '@/modules/auth/common';
import { TAvailableRoom } from '../types';
import { BookingDetailPanel } from './booking-detail-panel';
import { BookingDetailsForm } from './booking-details-form';

type TBookingStepTwoProps = {
  profile: TUser;
  rooms: TAvailableRoom[];
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  requestedGuests: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onBack: () => void;
  onBookingCreated: (bookingId: string) => void;
};

export function BookingStepTwo({
  profile,
  rooms,
  checkInDate,
  checkOutDate,
  numberOfNights,
  requestedGuests,
  isLoading,
  isError,
  onRetry,
  onBack,
  onBookingCreated,
}: TBookingStepTwoProps) {
  if (isLoading) {
    return (
      <section className='mx-auto w-[calc(100%-32px)] max-w-[1120px] py-12'>
        <div className='rounded-[16px] bg-white p-8 text-center font-semibold text-[#0D4949] shadow-lg'>
          Loading your room selection from the server…
        </div>
      </section>
    );
  }

  if (isError || rooms.length === 0) {
    return (
      <section className='mx-auto w-[calc(100%-32px)] max-w-[760px] py-12'>
        <div className='flex flex-col items-center rounded-[16px] bg-white p-8 text-center shadow-lg'>
          <h1 className='text-xl font-bold text-[#0D4949]'>
            Your room selection is unavailable
          </h1>
          <p className='mt-2 text-sm text-[#68726E]'>
            Reload availability or return to step 1 to update your selection.
          </p>
          <div className='mt-5 flex gap-3'>
            <Button
              onClick={onBack}
              className='h-11! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-6! text-sm! text-[#0D4949]!'>
              Back
            </Button>
            {isError && (
              <Button
                onClick={onRetry}
                className='h-11! w-auto! rounded-full! px-6! text-sm!'>
                Try again
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='mx-auto w-[calc(100%-32px)] max-w-[1120px] py-6 sm:py-9 lg:py-12'>
      <div className='grid gap-7 rounded-[16px] border border-[#0D4949]/15 bg-white p-5 shadow-[0_18px_55px_rgba(13,73,73,0.09)] sm:p-7 lg:grid-cols-[320px_1fr] lg:gap-9 lg:p-8'>
        <div className='rounded-[16px] bg-[#FAFBFA] p-5 lg:border-r lg:border-[#E3E9E7] lg:bg-transparent lg:p-0 lg:pr-8'>
          <BookingDetailPanel
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            numberOfNights={numberOfNights}
            requestedGuests={requestedGuests}
            rooms={rooms}
          />
        </div>

        <BookingDetailsForm
          profile={profile}
          rooms={rooms}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onBack={onBack}
          onBookingCreated={onBookingCreated}
        />
      </div>
    </section>
  );
}
