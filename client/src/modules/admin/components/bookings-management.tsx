'use client';

import { Pagination } from '@/components/core';
import { useDeferredValue, useState } from 'react';

import { useAdminBookingsApi, useUpdateAdminBookingApi } from '../common';
import type { TAdminBooking, TUpdateAdminBookingPayload } from '../common';
import { formatCurrency } from '@/utils';

type TBookingStatus = NonNullable<TUpdateAdminBookingPayload['bookingStatus']>;
type TPaymentStatus = NonNullable<TUpdateAdminBookingPayload['paymentStatus']>;

const bookingStatuses: TBookingStatus[] = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
];

const paymentStatuses: TPaymentStatus[] = [
  'unpaid',
  'pending',
  'paid',
  'failed',
  'refunded',
];

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={`fill-none stroke-current stroke-2 ${className}`}>
      <circle cx='11' cy='11' r='7' />
      <path d='m20 20-4-4' />
    </svg>
  );
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={`fill-none stroke-current stroke-2 ${className}`}>
      <rect x='3' y='5' width='18' height='16' rx='2' />
      <path d='M8 3v4m8-4v4M3 10h18' />
    </svg>
  );
}

function CreditCardIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={`fill-none stroke-current stroke-2 ${className}`}>
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path d='M3 10h18' />
    </svg>
  );
}

function LoadingIcon({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={`inline-block rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

const getRoomsLabel = (booking: TAdminBooking) => {
  const names = booking.bookingItems
    .map((item) =>
      typeof item.roomId === 'string' ? null : item.roomId?.title
    )
    .filter(Boolean);

  return names.length > 0 ? names.join(', ') : 'Phòng không còn tồn tại';
};

export default function BookingsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const bookingsQuery = useAdminBookingsApi({
    page,
    limit: 8,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const updateBooking = useUpdateAdminBookingApi();
  const bookings = bookingsQuery.data?.data ?? [];
  const pagination = bookingsQuery.data?.pagination;

  const handleUpdate = (bookingId: string, data: TUpdateAdminBookingPayload) =>
    updateBooking.mutate({ bookingId, data });

  return (
    <section className='space-y-5'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-semibold text-[#738a88] uppercase'>
            Vận hành đặt phòng
          </p>
          <h2 className='mt-1 text-3xl font-extrabold text-[#0b5555]'>
            Quản lý booking
          </h2>
          <p className='mt-1 text-sm text-slate-500'>
            Theo dõi thanh toán và cập nhật hành trình lưu trú của khách.
          </p>
        </div>

        <div className='relative w-full sm:max-w-sm'>
          <SearchIcon className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder='Tìm mã booking, khách hoặc phòng...'
            className='h-12 w-full rounded-full border border-slate-200 bg-white pr-5 pl-11 text-sm transition outline-none focus:border-[#0b5555] focus:ring-4 focus:ring-[#0b5555]/10'
          />
        </div>
      </div>

      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,71,69,0.06)]'>
        {bookingsQuery.isLoading ? (
          <div className='flex min-h-72 items-center justify-center'>
            <LoadingIcon className='size-7 animate-spin text-[#0b5555]' />
          </div>
        ) : bookingsQuery.isError ? (
          <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
            <p className='font-semibold text-slate-800'>
              Không thể tải danh sách booking
            </p>
            <button
              type='button'
              onClick={() => bookingsQuery.refetch()}
              className='mt-4 rounded-full bg-[#0b5555] px-5 py-2.5 text-sm font-semibold text-white'>
              Thử lại
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
            <CalendarIcon className='size-9 text-slate-300' />
            <p className='mt-3 font-semibold text-slate-700'>
              Không tìm thấy booking
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1180px] text-left'>
              <thead className='border-b border-slate-100 bg-[#f4f8f7] text-xs text-slate-500 uppercase'>
                <tr>
                  <th className='px-5 py-4 font-semibold'>Booking / khách</th>
                  <th className='px-5 py-4 font-semibold'>Phòng & thời gian</th>
                  <th className='px-5 py-4 font-semibold'>Tổng tiền</th>
                  <th className='px-5 py-4 font-semibold'>Thanh toán</th>
                  <th className='px-5 py-4 font-semibold'>Booking</th>
                  <th className='px-5 py-4 font-semibold'>Ngày tạo</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {bookings.map((booking) => {
                  const isUpdating =
                    updateBooking.isPending &&
                    updateBooking.variables?.bookingId === booking._id;

                  return (
                    <tr
                      key={booking._id}
                      className='align-top transition hover:bg-slate-50/80'>
                      <td className='px-5 py-5'>
                        <p className='font-semibold text-[#0b5555]'>
                          {booking.bookingCode}
                        </p>
                        <p className='mt-2 font-medium text-slate-800'>
                          {booking.userId?.full_name ?? 'Tài khoản đã xóa'}
                        </p>
                        <p className='mt-0.5 text-xs text-slate-500'>
                          {booking.userId?.email ?? 'Không có email'}
                        </p>
                      </td>
                      <td className='max-w-[280px] px-5 py-5'>
                        <p className='line-clamp-2 font-medium text-slate-800'>
                          {getRoomsLabel(booking)}
                        </p>
                        <p className='mt-2 flex items-center gap-1.5 text-xs text-slate-500'>
                          <CalendarIcon className='size-3.5' />
                          {formatDate(booking.checkInDate)} –{' '}
                          {formatDate(booking.checkOutDate)}
                        </p>
                        <p className='mt-1 text-xs text-slate-500'>
                          {booking.totalNights} đêm ·{' '}
                          {booking.bookingItems.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{' '}
                          phòng
                        </p>
                      </td>
                      <td className='px-5 py-5'>
                        <p className='font-bold whitespace-nowrap text-slate-900'>
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <p className='mt-1 text-xs text-slate-400 uppercase'>
                          {booking.paymentMethod}
                        </p>
                      </td>
                      <td className='px-5 py-5'>
                        <label
                          className='sr-only'
                          htmlFor={`payment-${booking._id}`}>
                          Trạng thái thanh toán
                        </label>
                        <div className='relative'>
                          <CreditCardIcon className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400' />
                          <select
                            id={`payment-${booking._id}`}
                            value={booking.paymentStatus}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleUpdate(booking._id, {
                                paymentStatus: event.target
                                  .value as TPaymentStatus,
                              })
                            }
                            className='h-10 min-w-36 rounded-full border border-slate-200 bg-white pr-8 pl-9 text-sm font-medium capitalize outline-none focus:border-[#0b5555]'>
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className='px-5 py-5'>
                        <label
                          className='sr-only'
                          htmlFor={`booking-${booking._id}`}>
                          Trạng thái booking
                        </label>
                        <select
                          id={`booking-${booking._id}`}
                          value={booking.bookingStatus}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleUpdate(booking._id, {
                              bookingStatus: event.target
                                .value as TBookingStatus,
                            })
                          }
                          className='h-10 min-w-36 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium capitalize outline-none focus:border-[#0b5555]'>
                          {bookingStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='px-5 py-5 text-sm whitespace-nowrap text-slate-500'>
                        {formatDate(booking.createdAt)}
                        {isUpdating && (
                          <LoadingIcon className='ml-2 size-4 animate-spin text-[#0b5555]' />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className='border-t border-slate-100 px-5 py-4'>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onChangePage={setPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
