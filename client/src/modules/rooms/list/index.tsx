'use client';
import { Pagination } from '@/components/core';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';
import { RoomItem } from '../common/components/room-item';
import { useAvailableRoomsApi, useRoomListApi } from '../common/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { buildRoomDetailUrl } from '@/utils';
import { useEffect } from 'react';

const PRICE_RANGES: Array<{
  label: string;
  minPrice?: number;
  maxPrice?: number;
}> = [
  { label: 'All prices' },
  { label: 'Under 2M', maxPrice: 2_000_000 },
  { label: '2M – 3M', minPrice: 2_000_000, maxPrice: 3_000_000 },
  { label: '3M – 5M', minPrice: 3_000_000, maxPrice: 5_000_000 },
  { label: '5M+', minPrice: 5_000_000 },
];

export function RoomListModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const guests = searchParams.get('guests');
  const roomCount = searchParams.get('rooms');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const parsedMinPrice = Number(minPriceParam);
  const parsedMaxPrice = Number(maxPriceParam);
  const minPrice =
    minPriceParam !== null &&
    minPriceParam !== '' &&
    Number.isFinite(parsedMinPrice) &&
    parsedMinPrice >= 0
      ? parsedMinPrice
      : undefined;
  const maxPrice =
    maxPriceParam !== null &&
    maxPriceParam !== '' &&
    Number.isFinite(parsedMaxPrice) &&
    parsedMaxPrice >= 0
      ? parsedMaxPrice
      : undefined;
  const isPriceFiltered = minPrice !== undefined || maxPrice !== undefined;
  const requestedPage = Number(searchParams.get('page'));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = 5;
  const isSearching = Boolean(checkInDate && checkOutDate);
  const roomListQuery = useRoomListApi(
    {
      page,
      limit: pageSize,
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
    },
    !isSearching
  );
  const availableRoomsQuery = useAvailableRoomsApi({
    checkInDate,
    checkOutDate,
    guests,
    rooms: roomCount,
    page,
    limit: pageSize,
    minPrice,
    maxPrice,
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
  const pagination = isSearching
    ? availableRoomsQuery.data?.pagination
    : roomListQuery.data?.pagination;

  useEffect(() => {
    if (!pagination || page <= pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    const safePage = pagination.totalPages;

    if (safePage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(safePage));
    }

    const query = params.toString();
    router.replace(`/rooms${query ? `?${query}` : ''}`);
  }, [page, pagination, router, searchParams]);

  const handleChangePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }

    const query = params.toString();
    router.push(`/rooms${query ? `?${query}` : ''}`);
  };

  const handlePriceRangeChange = (range: (typeof PRICE_RANGES)[number]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (range.minPrice === undefined) {
      params.delete('minPrice');
    } else {
      params.set('minPrice', String(range.minPrice));
    }

    if (range.maxPrice === undefined) {
      params.delete('maxPrice');
    } else {
      params.set('maxPrice', String(range.maxPrice));
    }

    params.delete('page');
    const query = params.toString();
    router.push(`/rooms${query ? `?${query}` : ''}`);
  };

  return (
    <div className="font-montserrat min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
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
                <p className='text-[11px] font-bold text-[#0D4949]/55 uppercase'>
                  Your stay
                </p>
                <h2 className='font-lora mt-0.5 text-xl font-semibold'>
                  Available rooms
                </h2>
              </div>
            </div>

            <div className='flex flex-col gap-3 border-y border-[#0D4949]/10 py-4 sm:flex-row sm:items-center sm:gap-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6'>
              <div>
                <p className='text-[11px] font-bold text-[#0D4949]/55 uppercase'>
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

      <div
        className={`mx-auto grid w-[92%] gap-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start xl:w-[88%] ${
          isSearching ? 'my-6' : 'my-10'
        }`}>
        <aside className='rounded-[18px] border border-[#DCE6E2] bg-white p-4 shadow-[0_12px_32px_rgba(13,73,73,0.07)] sm:p-5 lg:sticky lg:top-5 lg:p-6'>
          <div className='flex items-center gap-3 border-b border-[#E2EAE7] pb-4'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3F0] text-[#0D665A]'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-5 w-5 fill-none stroke-current stroke-[1.8]'>
                <path d='M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6' />
              </svg>
            </span>
            <div>
              <p className='mt-0.5 text-sm font-bold text-[#0D4949]'>
                Price per night
              </p>
            </div>
          </div>

          <div className='mt-4 flex flex-wrap gap-2 lg:flex-col'>
            {PRICE_RANGES.map((range) => {
              const isActive =
                minPrice === range.minPrice && maxPrice === range.maxPrice;

              return (
                <button
                  key={range.label}
                  type='button'
                  aria-pressed={isActive}
                  onClick={() => handlePriceRangeChange(range)}
                  className={`rounded-full border px-3.5 py-2 text-[10px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none sm:text-[11px] lg:w-full lg:px-4 lg:text-left ${
                    isActive
                      ? 'border-[#0D4949] bg-[#0D4949] text-white shadow-sm'
                      : 'border-[#D5E1DD] bg-[#F8FAF9] text-[#52615C] hover:border-[#0D4949]/50 hover:bg-[#EEF5F3]'
                  }`}>
                  {range.label}
                </button>
              );
            })}
          </div>

          <p className='mt-4 border-t border-[#E2EAE7] pt-4 text-[10px] font-semibold text-[#71807B]'>
            {pagination?.total ?? rooms?.length ?? 0} room
            {(pagination?.total ?? rooms?.length ?? 0) === 1 ? '' : 's'} found
          </p>
        </aside>

        <div className='flex min-w-0 flex-col gap-7 sm:gap-9'>
          {isLoading && (
            <p className='py-12 text-center text-[#0D4949]'>Searching rooms…</p>
          )}
          {!isLoading &&
            rooms?.map((room, index) => {
              return (
                <RoomItem
                  key={room._id}
                  room={room}
                  detailHref={buildRoomDetailUrl(room._id, searchParams)}
                  isPriority={index === 0}
                />
              );
            })}
          {!isLoading && rooms?.length === 0 && (
            <div className='rounded-xl bg-white px-8 py-12 text-center shadow-lg'>
              <p className='text-xl font-semibold text-[#0D4949]'>
                {isPriceFiltered
                  ? 'No rooms in this price range'
                  : 'No rooms available'}
              </p>
              <p className='mt-2 text-sm'>
                {isPriceFiltered
                  ? 'Try another price range or clear the filter.'
                  : 'Try different dates or fewer guests.'}
              </p>
            </div>
          )}
          {isError && (
            <p className='py-12 text-center text-red-700'>
              Unable to load rooms. Please try again.
            </p>
          )}
          {!isLoading &&
            !isError &&
            pagination &&
            pagination.totalPages > 1 && (
              <div className='w-full py-2'>
                <Pagination
                  currentPage={Math.min(page, pagination.totalPages)}
                  totalPages={pagination.totalPages}
                  onChangePage={handleChangePage}
                />
              </div>
            )}
        </div>
      </div>
      <Facilities />
      <Policies />
      <Footer />
    </div>
  );
}
