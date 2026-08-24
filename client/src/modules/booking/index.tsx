'use client';

import { Footer, Header } from '@/components/layouts';
import { useProfileApi } from '@/modules/auth/common';
import { useAvailableRoomsApi } from '@/modules/rooms/common/hooks';
import { createBookingSearchParams } from '@/utils';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  BookingAuthState,
  BookingProgress,
  BookingRoomSelection,
  BookingSummary,
  getNightCount,
  TAvailableRoom,
  useBookingStore,
} from './common';

export function BookingModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializeBooking = useBookingStore((state) => state.initializeBooking);
  const bookingParams = createBookingSearchParams(searchParams, {
    includeDefaultDates: true,
  });
  const checkInDate = bookingParams.get('checkInDate')!;
  const checkOutDate = bookingParams.get('checkOutDate')!;
  const requestedGuests = bookingParams.get('guests');
  const requestedRooms = bookingParams.get('rooms');
  const selectedRoomId = searchParams.get('roomId');
  const numberOfNights = getNightCount(checkInDate, checkOutDate);
  const parsedRequestedRooms = Number(requestedRooms);
  const initialRoomQuantity =
    Number.isInteger(parsedRequestedRooms) && parsedRequestedRooms > 0
      ? parsedRequestedRooms
      : 1;
  const bookingKey = [
    selectedRoomId,
    checkInDate,
    checkOutDate,
    requestedGuests,
    initialRoomQuantity,
  ].join('|');

  const profileQuery = useProfileApi();
  const roomQuery = useAvailableRoomsApi(
    {
      checkInDate,
      checkOutDate,
      guests: requestedGuests,
      rooms: requestedRooms,
    },
    profileQuery.isSuccess
  );
  const availableRooms = (roomQuery.data?.data ?? []) as TAvailableRoom[];
  const rooms = selectedRoomId
    ? availableRooms.filter((room) => room._id === selectedRoomId)
    : [];
  const currentBookingQuery = searchParams.toString();
  const currentBookingUrl = `/booking${currentBookingQuery ? `?${currentBookingQuery}` : ''}`;
  const isUnauthorized =
    axios.isAxiosError(profileQuery.error) &&
    profileQuery.error.response?.status === 401;

  useEffect(() => {
    initializeBooking({
      bookingKey,
      roomId: selectedRoomId,
      roomQuantity: initialRoomQuantity,
    });
  }, [bookingKey, initialRoomQuantity, initializeBooking, selectedRoomId]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(currentBookingUrl)}`
      );
    }
  }, [currentBookingUrl, isUnauthorized, router]);

  if (profileQuery.isLoading || isUnauthorized) {
    return <BookingAuthState />;
  }

  if (profileQuery.isError) {
    return (
      <BookingAuthState error onRetry={() => void profileQuery.refetch()} />
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />

      <main>
        <BookingProgress />

        <section className='mx-auto w-[calc(100%-32px)] max-w-[1120px] py-6 sm:py-9 lg:py-12'>
          <div className='rounded-[16px] border border-[#0D4949]/15 bg-white px-4 py-5 shadow-[0_18px_55px_rgba(13,73,73,0.09)] sm:px-7 sm:py-7 lg:px-8'>
            <BookingRoomSelection
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              numberOfNights={numberOfNights}
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              isLoading={roomQuery.isLoading}
              isError={roomQuery.isError}
              onRetry={() => void roomQuery.refetch()}
            />

            <BookingSummary rooms={rooms} numberOfNights={numberOfNights} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
