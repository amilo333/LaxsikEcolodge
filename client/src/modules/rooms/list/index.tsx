'use client';
import { Pagination } from '@/components/core';
import { Footer, Header } from '@/components/layouts';
import { Facilities, Policies } from '../common';
import { RoomItem } from '../common/components/room-item';
import { useAvailableRoomsApi, useRoomListApi } from '../common/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { buildRoomDetailUrl, localizeRoomContent } from '@/utils';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const PRICE_RANGES: Array<{
  key: 'all' | 'under2m' | '2to3m' | '3to5m' | 'over5m';
  minPrice?: number;
  maxPrice?: number;
}> = [
  { key: 'all' },
  { key: 'under2m', maxPrice: 2_000_000 },
  { key: '2to3m', minPrice: 2_000_000, maxPrice: 3_000_000 },
  { key: '3to5m', minPrice: 3_000_000, maxPrice: 5_000_000 },
  { key: 'over5m', minPrice: 5_000_000 },
];

const CAPACITY_OPTIONS = [
  { key: 'all', value: undefined },
  { key: 'two', value: 2 },
  { key: 'three', value: 3 },
  { key: 'four', value: 4 },
  { key: 'five', value: 5 },
] as const;

const AREA_RANGES = [
  { key: 'all', minArea: undefined, maxArea: undefined },
  { key: 'compact', minArea: undefined, maxArea: 35 },
  { key: 'medium', minArea: 36, maxArea: 45 },
  { key: 'spacious', minArea: 46, maxArea: undefined },
] as const;

const BED_OPTIONS = [
  { key: 'all', value: undefined },
  { key: 'king', value: 'king' },
  { key: 'single', value: 'single' },
] as const;

const VIEW_OPTIONS = [
  { key: 'all', value: undefined },
  { key: 'mountain', value: 'mountain' },
  { key: 'valley', value: 'valley' },
  { key: 'terrace', value: 'terrace' },
  { key: 'pool', value: 'pool' },
] as const;

function FilterPills({
  title,
  options,
  activeKey,
  onChange,
}: {
  title: string;
  options: Array<{ key: string; label: string }>;
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <section className='border-t border-[#E2EAE7] pt-4'>
      <h3 className='text-[11px] font-bold tracking-[0.08em] text-[#0D4949]/70 uppercase'>
        {title}
      </h3>
      <div className='mt-2.5 flex flex-wrap gap-2'>
        {options.map((option) => {
          const isActive = activeKey === option.key;

          return (
            <button
              key={option.key}
              type='button'
              aria-pressed={isActive}
              onClick={() => onChange(option.key)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none ${
                isActive
                  ? 'border-[#0D4949] bg-[#0D4949] text-white shadow-sm'
                  : 'border-[#D5E1DD] bg-[#F8FAF9] text-[#52615C] hover:border-[#0D4949]/50 hover:bg-[#EEF5F3]'
              }`}>
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function RoomListModule() {
  const t = useTranslations('Rooms.list');
  const locale = useLocale();
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
  const minCapacityParam = Number(searchParams.get('minCapacity'));
  const minCapacity =
    Number.isInteger(minCapacityParam) && minCapacityParam > 0
      ? minCapacityParam
      : undefined;
  const minAreaParam = Number(searchParams.get('minArea'));
  const maxAreaParam = Number(searchParams.get('maxArea'));
  const minArea =
    Number.isFinite(minAreaParam) && minAreaParam > 0
      ? minAreaParam
      : undefined;
  const maxArea =
    Number.isFinite(maxAreaParam) && maxAreaParam > 0
      ? maxAreaParam
      : undefined;
  const bed = searchParams.get('bed') || undefined;
  const view = searchParams.get('view') || undefined;
  const hasFireplace = searchParams.get('hasFireplace') === 'true';
  const hasRoomFilters = Boolean(
    minPrice !== undefined ||
    maxPrice !== undefined ||
    minCapacity !== undefined ||
    minArea !== undefined ||
    maxArea !== undefined ||
    bed ||
    view ||
    hasFireplace
  );
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
      ...(minCapacity !== undefined ? { minCapacity } : {}),
      ...(minArea !== undefined ? { minArea } : {}),
      ...(maxArea !== undefined ? { maxArea } : {}),
      ...(bed ? { bed } : {}),
      ...(view ? { view } : {}),
      ...(hasFireplace ? { hasFireplace } : {}),
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
    minCapacity,
    minArea,
    maxArea,
    bed,
    view,
    hasFireplace,
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

  const updateRoomFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) params.delete(key);
      else params.set(key, value);
    });

    params.delete('page');
    const query = params.toString();
    router.push(`/rooms${query ? `?${query}` : ''}`);
  };

  const clearRoomFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    [
      'minPrice',
      'maxPrice',
      'minCapacity',
      'minArea',
      'maxArea',
      'bed',
      'view',
      'hasFireplace',
      'page',
    ].forEach((key) => params.delete(key));
    const query = params.toString();
    router.push(`/rooms${query ? `?${query}` : ''}`);
  };

  const activeCapacity =
    CAPACITY_OPTIONS.find((option) => option.value === minCapacity)?.key ??
    'all';
  const activeArea =
    AREA_RANGES.find(
      (range) => range.minArea === minArea && range.maxArea === maxArea
    )?.key ?? 'all';
  const activeBed =
    BED_OPTIONS.find((option) => option.value === bed)?.key ?? 'all';
  const activeView =
    VIEW_OPTIONS.find((option) => option.value === view)?.key ?? 'all';

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
                  {t('yourStay')}
                </p>
                <h2 className='font-lora mt-0.5 text-xl font-semibold'>
                  {t('availableRooms')}
                </h2>
              </div>
            </div>

            <div className='flex flex-col gap-3 border-y border-[#0D4949]/10 py-4 sm:flex-row sm:items-center sm:gap-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6'>
              <div>
                <p className='text-[11px] font-bold text-[#0D4949]/55 uppercase'>
                  {t('dates')}
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
                    {t('guestCount', { count: Number(guests) })}
                  </span>
                )}
                {roomCount && (
                  <span className='rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-[#0D4949]/10'>
                    {t('roomCount', { count: Number(roomCount) })}
                  </span>
                )}
              </div>
            </div>

            <Link
              href='/rooms'
              className='inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0D4949]/20 bg-white px-5 text-sm font-semibold transition-colors hover:border-[#0D4949] hover:bg-[#0D4949] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none'>
              {t('clearSearch')}
            </Link>
          </div>
        </div>
      )}

      <div
        className={`mx-auto grid w-[92%] gap-7 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start xl:w-[88%] ${
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
              <p className='text-[10px] font-bold tracking-[0.12em] text-[#0D4949]/55 uppercase'>
                {t('filters.eyebrow')}
              </p>
              <p className='mt-0.5 text-sm font-bold text-[#0D4949]'>
                {t('filters.title')}
              </p>
            </div>
          </div>

          <div className='mt-4 flex flex-wrap gap-2 lg:flex-col'>
            <h3 className='mb-0.5 text-[11px] font-bold tracking-[0.08em] text-[#0D4949]/70 uppercase'>
              {t('pricePerNight')}
            </h3>
            {PRICE_RANGES.map((range) => {
              const isActive =
                minPrice === range.minPrice && maxPrice === range.maxPrice;

              return (
                <button
                  key={range.key}
                  type='button'
                  aria-pressed={isActive}
                  onClick={() => handlePriceRangeChange(range)}
                  className={`rounded-full border px-3.5 py-2 text-[10px] font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none sm:text-[11px] lg:w-full lg:px-4 lg:text-left ${
                    isActive
                      ? 'border-[#0D4949] bg-[#0D4949] text-white shadow-sm'
                      : 'border-[#D5E1DD] bg-[#F8FAF9] text-[#52615C] hover:border-[#0D4949]/50 hover:bg-[#EEF5F3]'
                  }`}>
                  {t(`priceRanges.${range.key}`)}
                </button>
              );
            })}
          </div>

          <div className='mt-4 space-y-4'>
            <FilterPills
              title={t('filters.capacity')}
              options={CAPACITY_OPTIONS.map((option) => ({
                key: option.key,
                label: t(`filters.capacityOptions.${option.key}`),
              }))}
              activeKey={activeCapacity}
              onChange={(key) => {
                const option = CAPACITY_OPTIONS.find(
                  (item) => item.key === key
                );
                updateRoomFilters({
                  minCapacity: option?.value ? String(option.value) : undefined,
                });
              }}
            />

            <FilterPills
              title={t('filters.area')}
              options={AREA_RANGES.map((option) => ({
                key: option.key,
                label: t(`filters.areaOptions.${option.key}`),
              }))}
              activeKey={activeArea}
              onChange={(key) => {
                const option = AREA_RANGES.find((item) => item.key === key);
                updateRoomFilters({
                  minArea: option?.minArea ? String(option.minArea) : undefined,
                  maxArea: option?.maxArea ? String(option.maxArea) : undefined,
                });
              }}
            />

            <FilterPills
              title={t('filters.bed')}
              options={BED_OPTIONS.map((option) => ({
                key: option.key,
                label: t(`filters.bedOptions.${option.key}`),
              }))}
              activeKey={activeBed}
              onChange={(key) => {
                const option = BED_OPTIONS.find((item) => item.key === key);
                updateRoomFilters({ bed: option?.value });
              }}
            />

            <FilterPills
              title={t('filters.view')}
              options={VIEW_OPTIONS.map((option) => ({
                key: option.key,
                label: t(`filters.viewOptions.${option.key}`),
              }))}
              activeKey={activeView}
              onChange={(key) => {
                const option = VIEW_OPTIONS.find((item) => item.key === key);
                updateRoomFilters({ view: option?.value });
              }}
            />

            <section className='border-t border-[#E2EAE7] pt-4'>
              <button
                type='button'
                aria-pressed={hasFireplace}
                onClick={() =>
                  updateRoomFilters({
                    hasFireplace: hasFireplace ? undefined : 'true',
                  })
                }
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[11px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0D4949] focus-visible:ring-offset-2 focus-visible:outline-none ${
                  hasFireplace
                    ? 'border-[#0D4949] bg-[#EAF3F0] text-[#0D4949]'
                    : 'border-[#D5E1DD] bg-[#F8FAF9] text-[#52615C] hover:border-[#0D4949]/50'
                }`}>
                <span>{t('filters.fireplace')}</span>
                <span
                  aria-hidden='true'
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                    hasFireplace
                      ? 'border-[#0D4949] bg-[#0D4949] text-white'
                      : 'border-[#AAB9B4] bg-white text-transparent'
                  }`}>
                  ✓
                </span>
              </button>
            </section>
          </div>

          {hasRoomFilters && (
            <button
              type='button'
              onClick={clearRoomFilters}
              className='mt-4 w-full rounded-full border border-[#0D4949]/20 px-4 py-2 text-[11px] font-bold text-[#0D4949] transition-colors hover:border-[#0D4949] hover:bg-[#0D4949] hover:text-white'>
              {t('filters.clearAll')}
            </button>
          )}

          <p className='mt-4 border-t border-[#E2EAE7] pt-4 text-[10px] font-semibold text-[#71807B]'>
            {t('roomsFound', {
              count: pagination?.total ?? rooms?.length ?? 0,
            })}
          </p>
        </aside>

        <div className='flex min-w-0 flex-col gap-7 sm:gap-9'>
          {isLoading && (
            <p className='py-12 text-center text-[#0D4949]'>{t('searching')}</p>
          )}
          {!isLoading &&
            rooms?.map((room, index) => {
              return (
                <RoomItem
                  key={room._id}
                  room={localizeRoomContent(room, locale)}
                  detailHref={buildRoomDetailUrl(room._id, searchParams)}
                  isPriority={index === 0}
                />
              );
            })}
          {!isLoading && rooms?.length === 0 && (
            <div className='rounded-xl bg-white px-8 py-12 text-center shadow-lg'>
              <p className='text-xl font-semibold text-[#0D4949]'>
                {hasRoomFilters ? t('noRoomsFiltered') : t('noRooms')}
              </p>
              <p className='mt-2 text-sm'>
                {hasRoomFilters ? t('tryFilters') : t('tryDates')}
              </p>
            </div>
          )}
          {isError && (
            <p className='py-12 text-center text-red-700'>{t('loadError')}</p>
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
