'use client';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';
import { RoomItem } from '../common/components/room-item';
import { useAvailableRoomsApi, useRoomListApi } from '../common/hooks';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { buildRoomDetailUrl } from '@/utils';

export function RoomListModule() {
  const searchParams = useSearchParams();
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const guests = searchParams.get('guests');
  const roomCount = searchParams.get('rooms');
  const isSearching = Boolean(checkInDate && checkOutDate);
  const roomListQuery = useRoomListApi(!isSearching);
  const availableRoomsQuery = useAvailableRoomsApi({
    checkInDate,
    checkOutDate,
    guests,
    rooms: roomCount,
  });
  const rooms = isSearching
    ? availableRoomsQuery.data?.data
    : roomListQuery.data?.data;
  const isLoading = isSearching
    ? availableRoomsQuery.isLoading
    : roomListQuery.isLoading;
  const isError = isSearching
    ? availableRoomsQuery.isError
    : roomListQuery.isError;

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />
      {isSearching && (
        <div className='mx-auto mt-10 w-[92%] rounded-[20px] border border-[#0D4949]/10 bg-white p-2 shadow-[0_14px_35px_rgba(13,73,73,0.08)] lg:w-[75%]'>
          <div className='flex flex-col gap-5 rounded-[14px] bg-[#F2F7F5] px-5 py-5 text-[#0D4949] sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D4949] text-white shadow-md shadow-[#0D4949]/20'>
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-6 w-6 fill-none stroke-current stroke-[1.8]'>
                  <rect x='3.5' y='5.5' width='17' height='15' rx='2' />
                  <path d='M7.5 3.5v4M16.5 3.5v4M3.5 10h17' />
                </svg>
              </div>

              <div>
                <p className='text-[11px] font-bold tracking-[0.16em] text-[#0D4949]/55 uppercase'>
                  Your stay
                </p>
                <h2 className='mt-0.5 text-xl font-semibold'>
                  Available rooms
                </h2>
              </div>
            </div>

            <div className='flex flex-col gap-3 border-y border-[#0D4949]/10 py-4 sm:flex-row sm:items-center sm:gap-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6'>
              <div>
                <p className='text-[11px] font-bold tracking-[0.12em] text-[#0D4949]/55 uppercase'>
                  Dates
                </p>
                <p className='mt-1 text-sm font-medium'>
                  {checkInDate}{' '}
                  <span className='mx-1 text-[#0D4949]/40'>→</span>{' '}
                  {checkOutDate}
                </p>
              </div>

              <div className='flex flex-wrap gap-2'>
                {guests && (
                  <span className='rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-[#0D4949]/10'>
                    {guests} guest{guests === '1' ? '' : 's'}
                  </span>
                )}
                {roomCount && (
                  <span className='rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-[#0D4949]/10'>
                    {roomCount} room{roomCount === '1' ? '' : 's'}
                  </span>
                )}
              </div>
            </div>

            <Link
              href='/rooms'
              className='inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0D4949]/20 bg-white px-5 text-sm font-semibold transition-colors hover:border-[#0D4949] hover:bg-[#0D4949] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none'>
              Clear search
            </Link>
          </div>
        </div>
      )}
      <div className='my-15 flex flex-col items-center justify-center gap-10'>
        {isLoading && <p className='text-[#0D4949]'>Searching rooms…</p>}
        {!isLoading &&
          rooms?.map((room) => {
            return (
              <RoomItem
                key={room._id}
                room={room}
                detailHref={buildRoomDetailUrl(room._id, searchParams)}
              />
            );
          })}
        {!isLoading && rooms?.length === 0 && (
          <div className='rounded-xl bg-white px-8 py-12 text-center shadow-lg'>
            <p className='text-xl font-semibold text-[#0D4949]'>
              No rooms available
            </p>
            <p className='mt-2 text-sm'>Try different dates or fewer guests.</p>
          </div>
        )}
        {isError && (
          <p className='text-red-700'>
            Unable to load rooms. Please try again.
          </p>
        )}
      </div>
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}
