'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import type { TRoom } from '@/modules/rooms/common/types';
import { useAdminBookingsApi, useUpdateAdminBookingApi } from '../common';
import type { TAdminBooking, TUpdateAdminBookingPayload } from '../common';
import { AdminSelect } from './admin-select';
import { BookingDetailDialog } from './booking-detail-dialog';

const DAY_IN_MS = 86_400_000;
const DAY_WIDTH = 58;
const ROOM_COLUMN_WIDTH = 230;
const BAR_HEIGHT = 34;
const BAR_GAP = 6;
const WEEKDAY_LABELS = [
  'CN',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];
const DAY_VIEW_OPTIONS = [
  { value: 14 as const, label: '14 ngày', description: 'Xem 2 tuần' },
  { value: 30 as const, label: '30 ngày', description: 'Xem toàn tháng' },
];

type TTimelineBar = {
  booking: TAdminBooking;
  quantity: number;
  startOffset: number;
  duration: number;
  lane: number;
};

const BOOKING_STATUS_CONFIG: Record<
  TAdminBooking['bookingStatus'],
  { label: string; barClass: string; dotClass: string }
> = {
  pending: {
    label: 'Chờ xác nhận',
    barClass: 'border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200',
    dotClass: 'bg-amber-400',
  },
  confirmed: {
    label: 'Đã xác nhận',
    barClass:
      'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Đã hủy',
    barClass:
      'border-slate-300 bg-slate-100 text-slate-500 opacity-70 hover:opacity-100',
    dotClass: 'bg-slate-400',
  },
  completed: {
    label: 'Đã hoàn thành',
    barClass: 'border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200',
    dotClass: 'bg-sky-500',
  },
};

const parseDateKey = (value: string) =>
  new Date(`${value.slice(0, 10)}T00:00:00.000Z`);

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (value: string, days: number) => {
  const date = parseDateKey(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
};

const differenceInDays = (later: string, earlier: string) =>
  Math.round(
    (parseDateKey(later).getTime() - parseDateKey(earlier).getTime()) /
      DAY_IN_MS
  );

const getTodayKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatRangeDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));

const getDayLabel = (value: string) =>
  WEEKDAY_LABELS[parseDateKey(value).getUTCDay()];

const getRoomId = (booking: TAdminBooking, itemIndex: number) => {
  const roomId = booking.bookingItems[itemIndex]?.roomId;
  if (!roomId) return null;
  return typeof roomId === 'string' ? roomId : roomId._id;
};

const buildTimelineBars = (
  roomId: string,
  bookings: TAdminBooking[],
  rangeStart: string,
  rangeEnd: string
) => {
  const rawBars = bookings
    .flatMap((booking) =>
      booking.bookingItems.map((item, itemIndex) => ({
        booking,
        quantity: item.quantity,
        roomId: getRoomId(booking, itemIndex),
      }))
    )
    .filter((item) => item.roomId === roomId)
    .map((item) => {
      const checkIn = item.booking.checkInDate.slice(0, 10);
      const checkOut = item.booking.checkOutDate.slice(0, 10);
      const visibleStart = checkIn < rangeStart ? rangeStart : checkIn;
      const visibleEnd = checkOut > rangeEnd ? rangeEnd : checkOut;

      return {
        booking: item.booking,
        quantity: item.quantity,
        startOffset: differenceInDays(visibleStart, rangeStart),
        duration: differenceInDays(visibleEnd, visibleStart),
      };
    })
    .filter((item) => item.duration > 0)
    .sort(
      (left, right) =>
        left.startOffset - right.startOffset || right.duration - left.duration
    );

  const laneEndOffsets: number[] = [];

  return rawBars.map<TTimelineBar>((bar) => {
    let lane = laneEndOffsets.findIndex(
      (laneEnd) => bar.startOffset >= laneEnd
    );

    if (lane === -1) {
      lane = laneEndOffsets.length;
      laneEndOffsets.push(bar.startOffset + bar.duration);
    } else {
      laneEndOffsets[lane] = bar.startOffset + bar.duration;
    }

    return { ...bar, lane };
  });
};

function SearchIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <circle cx='11' cy='11' r='7' />
      <path d='m20 20-4-4' />
    </svg>
  );
}

function TimelineViewIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path d='M8 5v14M3 10h18M13 10v9' />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={`h-4 w-4 fill-none stroke-current stroke-2 ${
        direction === 'right' ? 'rotate-180' : ''
      }`}>
      <path d='m15 18-6-6 6-6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <span className='h-7 w-7 animate-spin rounded-full border-2 border-[#0D4949]/25 border-t-[#0D4949]' />
  );
}

export default function BookingsManagement() {
  const [todayKey] = useState(getTodayKey);
  const [rangeStart, setRangeStart] = useState(() =>
    addDays(getTodayKey(), -2)
  );
  const [daysInView, setDaysInView] = useState<14 | 30>(14);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<TAdminBooking | null>(
    null
  );
  const deferredSearch = useDeferredValue(search.trim());
  const rangeEnd = addDays(rangeStart, daysInView);
  const days = useMemo(
    () =>
      Array.from({ length: daysInView }, (_, index) =>
        addDays(rangeStart, index)
      ),
    [daysInView, rangeStart]
  );

  const bookingsQuery = useAdminBookingsApi({
    page: 1,
    limit: 500,
    dateFrom: rangeStart,
    dateTo: rangeEnd,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const updateBooking = useUpdateAdminBookingApi();
  const bookings = useMemo(
    () => bookingsQuery.data?.data ?? [],
    [bookingsQuery.data?.data]
  );

  const timelineRooms = useMemo(() => {
    const roomMap = new Map<string, TRoom>();

    bookings.forEach((booking) => {
      booking.bookingItems.forEach((item) => {
        if (item.roomId && typeof item.roomId !== 'string') {
          roomMap.set(item.roomId._id, item.roomId);
        }
      });
    });

    return Array.from(roomMap.values()).sort((left, right) =>
      left.title.localeCompare(right.title, 'vi')
    );
  }, [bookings]);

  const activeBookings = bookings.filter(
    (booking) => booking.bookingStatus !== 'cancelled'
  );
  const arrivals = activeBookings.filter((booking) => {
    const checkIn = booking.checkInDate.slice(0, 10);
    return checkIn >= rangeStart && checkIn < rangeEnd;
  }).length;
  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === 'pending'
  ).length;
  const occupiedRoomNights = activeBookings.reduce((total, booking) => {
    const checkIn = booking.checkInDate.slice(0, 10);
    const checkOut = booking.checkOutDate.slice(0, 10);
    const visibleStart = checkIn < rangeStart ? rangeStart : checkIn;
    const visibleEnd = checkOut > rangeEnd ? rangeEnd : checkOut;
    const visibleNights = Math.max(
      0,
      differenceInDays(visibleEnd, visibleStart)
    );
    const roomCount = booking.bookingItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    return total + visibleNights * roomCount;
  }, 0);
  const isLoading = bookingsQuery.isLoading;
  const isError = bookingsQuery.isError;
  const timelineWidth = daysInView * DAY_WIDTH;
  const todayOffset =
    todayKey >= rangeStart && todayKey < rangeEnd
      ? differenceInDays(todayKey, rangeStart)
      : null;

  const handleUpdate = (data: TUpdateAdminBookingPayload) => {
    if (!selectedBooking) return;

    updateBooking.mutate(
      { bookingId: selectedBooking._id, data },
      { onSuccess: () => setSelectedBooking(null) }
    );
  };

  return (
    <section className='space-y-5'>
      <div className='flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between'>
        <div>
          <p className='text-xs font-semibold text-[#738A88] uppercase'>
            Sơ đồ lưu trú
          </p>
          <h2 className='mt-1 text-3xl font-extrabold text-[#0B5555]'>
            Lịch đặt phòng
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            Theo dõi phòng đã đặt theo thời gian. Nhấn vào một booking để xem
            chi tiết và cập nhật trạng thái.
          </p>
        </div>

        <div className='flex w-full flex-col gap-3 sm:flex-row xl:w-auto'>
          <label className='relative block min-w-0 flex-1 xl:w-[330px]'>
            <span className='sr-only'>Tìm booking</span>
            <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400'>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Tìm mã booking, khách hoặc phòng...'
              className='h-11 w-full rounded-full border border-slate-200 bg-white pr-4 pl-10 text-xs transition outline-none focus:border-[#0D4949] focus:ring-4 focus:ring-[#0D4949]/10'
            />
          </label>

          <AdminSelect
            value={daysInView}
            options={DAY_VIEW_OPTIONS}
            onChange={setDaysInView}
            ariaLabel='Số ngày hiển thị'
            leadingIcon={<TimelineViewIcon />}
            rounded='pill'
            className='w-full sm:w-[160px]'
          />
        </div>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {[
          {
            label: 'Booking trong kỳ',
            value: bookings.length,
            note: `${activeBookings.length} đang hoạt động`,
            color: 'bg-[#E6F2EE] text-[#0D665A]',
          },
          {
            label: 'Khách nhận phòng',
            value: arrivals,
            note: 'Trong khoảng đang xem',
            color: 'bg-[#E9F1FA] text-[#31658B]',
          },
          {
            label: 'Đêm phòng sử dụng',
            value: occupiedRoomNights,
            note: 'Không gồm booking đã hủy',
            color: 'bg-[#F3ECFA] text-[#76509A]',
          },
          {
            label: 'Chờ xác nhận',
            value: pendingBookings,
            note: 'Cần xử lý',
            color: 'bg-[#FFF3D9] text-[#9A6813]',
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className='rounded-[16px] border border-white/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,71,69,0.05)]'>
            <div className='flex items-center justify-between gap-3'>
              <p className='text-[10px] font-extrabold text-slate-500 uppercase'>
                {stat.label}
              </p>
              <span className={`h-2.5 w-2.5 rounded-full ${stat.color}`} />
            </div>
            <p className='mt-2 text-2xl font-black text-[#153F3D]'>
              {stat.value}
            </p>
            <p className='mt-0.5 text-[10px] text-slate-400'>{stat.note}</p>
          </article>
        ))}
      </div>

      <div className='overflow-hidden rounded-[20px] border border-[#D8E4E0] bg-white shadow-[0_18px_55px_rgba(15,71,69,0.07)]'>
        <div className='flex flex-col gap-3 border-b border-[#E0E9E6] bg-[#FAFBFB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setRangeStart(addDays(rangeStart, -daysInView))}
              aria-label='Xem khoảng thời gian trước'
              className='flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E4E0] bg-white text-[#315A55] transition hover:border-[#0D4949]'>
              <ChevronIcon direction='left' />
            </button>
            <button
              type='button'
              onClick={() => setRangeStart(addDays(todayKey, -2))}
              className='h-9 rounded-full border border-[#D8E4E0] bg-white px-4 text-[10px] font-extrabold text-[#315A55] transition hover:border-[#0D4949]'>
              Hôm nay
            </button>
            <button
              type='button'
              onClick={() => setRangeStart(addDays(rangeStart, daysInView))}
              aria-label='Xem khoảng thời gian sau'
              className='flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E4E0] bg-white text-[#315A55] transition hover:border-[#0D4949]'>
              <ChevronIcon direction='right' />
            </button>
            <p className='ml-1 text-xs font-extrabold text-[#173F3D]'>
              {formatRangeDate(rangeStart)} –{' '}
              {formatRangeDate(addDays(rangeEnd, -1))}
            </p>
          </div>

          <div className='flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-bold text-slate-500'>
            {Object.entries(BOOKING_STATUS_CONFIG).map(([status, config]) => (
              <span key={status} className='flex items-center gap-1.5'>
                <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                {config.label}
              </span>
            ))}
          </div>
        </div>

        <div className='border-b border-[#E6EDEA] bg-[#F5F8F7] px-4 py-2 text-[9px] text-slate-500 sm:hidden'>
          Vuốt ngang để xem thêm ngày trong timeline.
        </div>

        {isLoading ? (
          <div className='flex min-h-[380px] items-center justify-center'>
            <LoadingIcon />
          </div>
        ) : isError ? (
          <div className='flex min-h-[380px] flex-col items-center justify-center px-6 text-center'>
            <p className='font-semibold text-slate-700'>
              Không thể tải lịch booking
            </p>
            <button
              type='button'
              onClick={() => void bookingsQuery.refetch()}
              className='mt-4 rounded-full bg-[#0D4949] px-5 py-2.5 text-xs font-bold text-white'>
              Thử lại
            </button>
          </div>
        ) : timelineRooms.length === 0 ? (
          <div className='flex min-h-[380px] flex-col items-center justify-center px-6 text-center'>
            <p className='font-semibold text-slate-700'>
              Không tìm thấy phòng hoặc booking phù hợp
            </p>
            <p className='mt-1 text-xs text-slate-400'>
              Hãy đổi khoảng ngày hoặc từ khóa tìm kiếm.
            </p>
          </div>
        ) : (
          <div className='max-h-[680px] overflow-auto'>
            <div
              style={{ width: ROOM_COLUMN_WIDTH + timelineWidth }}
              className='min-w-full'>
              <div className='sticky top-0 z-30 flex border-b border-[#DCE7E3] bg-white'>
                <div
                  style={{ width: ROOM_COLUMN_WIDTH }}
                  className='sticky left-0 z-40 flex shrink-0 items-center border-r border-[#DCE7E3] bg-[#F3F7F5] px-4 py-3'>
                  <div>
                    <p className='text-[9px] font-extrabold tracking-[0.1em] text-[#71817C] uppercase'>
                      Loại phòng
                    </p>
                    <p className='mt-1 text-[10px] text-slate-400'>
                      {timelineRooms.length} loại phòng
                    </p>
                  </div>
                </div>

                <div style={{ width: timelineWidth }} className='flex shrink-0'>
                  {days.map((day) => {
                    const date = parseDateKey(day);
                    const isWeekend = [0, 6].includes(date.getUTCDay());
                    const isToday = day === todayKey;

                    return (
                      <div
                        key={day}
                        style={{ width: DAY_WIDTH }}
                        className={`shrink-0 border-r border-[#E6EDEA] px-1 py-2 text-center ${
                          isToday
                            ? 'bg-[#DCEEE8] text-[#0D665A]'
                            : isWeekend
                              ? 'bg-[#FBF6EF] text-[#9A6845]'
                              : 'bg-white text-slate-500'
                        }`}>
                        <p className='text-[8px] font-bold uppercase'>
                          {getDayLabel(day)}
                        </p>
                        <p className='mt-1 text-sm font-black'>
                          {date.getUTCDate()}
                        </p>
                        <p className='text-[8px] font-semibold'>
                          Thg {date.getUTCMonth() + 1}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                {timelineRooms.map((room) => {
                  const bars = buildTimelineBars(
                    room._id,
                    bookings,
                    rangeStart,
                    rangeEnd
                  );
                  const laneCount = Math.max(
                    1,
                    ...bars.map((bar) => bar.lane + 1)
                  );
                  const rowHeight = Math.max(
                    64,
                    laneCount * (BAR_HEIGHT + BAR_GAP) + 16
                  );

                  return (
                    <div
                      key={room._id}
                      style={{ minHeight: rowHeight }}
                      className='flex border-b border-[#E4ECE9] last:border-b-0'>
                      <div
                        style={{
                          width: ROOM_COLUMN_WIDTH,
                          minHeight: rowHeight,
                        }}
                        className='sticky left-0 z-20 flex shrink-0 items-center border-r border-[#DCE7E3] bg-white px-4 py-3 shadow-[5px_0_12px_rgba(21,63,61,0.04)]'>
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                room.status === 'available'
                                  ? 'bg-emerald-500'
                                  : room.status === 'maintenance'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                              }`}
                            />
                            <p className='truncate text-xs font-extrabold text-[#173F3D]'>
                              {room.title}
                            </p>
                          </div>
                          <p className='mt-1 pl-4 text-[9px] text-slate-400'>
                            Tổng {room.quantity} phòng · {bars.length} booking
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          width: timelineWidth,
                          minHeight: rowHeight,
                          backgroundSize: `${DAY_WIDTH}px 100%`,
                          backgroundImage:
                            'linear-gradient(to right, transparent calc(100% - 1px), #E8EEEC 1px)',
                        }}
                        className='relative shrink-0 bg-white'>
                        {todayOffset !== null && (
                          <div
                            style={{
                              left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2,
                            }}
                            className='pointer-events-none absolute inset-y-0 z-10 w-px bg-[#0D665A]/45'>
                            <span className='absolute -top-1 -left-1 h-2 w-2 rounded-full bg-[#0D665A]' />
                          </div>
                        )}

                        {bars.map((bar) => {
                          const config =
                            BOOKING_STATUS_CONFIG[bar.booking.bookingStatus];
                          const left = bar.startOffset * DAY_WIDTH + 4;
                          const width = Math.max(
                            24,
                            bar.duration * DAY_WIDTH - 8
                          );

                          return (
                            <button
                              key={`${bar.booking._id}-${room._id}`}
                              type='button'
                              onClick={() => setSelectedBooking(bar.booking)}
                              title={`${bar.booking.bookingCode} · ${bar.booking.customerInfo.fullNameContact} · ${bar.quantity} phòng`}
                              aria-label={`Xem ${bar.booking.bookingCode}, ${bar.booking.customerInfo.fullNameContact}`}
                              style={{
                                left,
                                width,
                                top: 8 + bar.lane * (BAR_HEIGHT + BAR_GAP),
                                height: BAR_HEIGHT,
                              }}
                              className={`absolute z-20 overflow-hidden rounded-lg border px-2.5 text-left shadow-sm transition hover:z-30 hover:-translate-y-0.5 hover:shadow-md ${config.barClass}`}>
                              <span className='block truncate text-[9px] font-extrabold'>
                                {bar.booking.bookingCode}
                              </span>
                              {width >= 90 && (
                                <span className='block truncate text-[8px] opacity-75'>
                                  {bar.booking.customerInfo.fullNameContact} ·{' '}
                                  {bar.quantity}P
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {bars.length === 0 && (
                          <p className='absolute top-1/2 left-4 -translate-y-1/2 text-[9px] text-slate-300'>
                            Không có booking trong khoảng này
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailDialog
          key={selectedBooking._id}
          booking={selectedBooking}
          isPending={
            updateBooking.isPending &&
            updateBooking.variables?.bookingId === selectedBooking._id
          }
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdate}
        />
      )}
    </section>
  );
}
