'use client';

import { formatCurrency } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import type { TAdminBooking, TUpdateAdminBookingPayload } from '../common';
import { AdminSelect, type TAdminSelectOption } from './admin-select';

type TBookingStatus = TAdminBooking['bookingStatus'];
type TPaymentStatus = TAdminBooking['paymentStatus'];

type TBookingDetailDialogProps = {
  booking: TAdminBooking;
  isPending: boolean;
  onClose: () => void;
  onUpdate: (data: TUpdateAdminBookingPayload) => void;
};

const BOOKING_STATUS_OPTIONS: Array<TAdminSelectOption<TBookingStatus>> = [
  {
    value: 'pending',
    label: 'Chờ xác nhận',
    description: 'Booking mới cần xử lý',
    dotClass: 'bg-amber-400 text-amber-400',
  },
  {
    value: 'confirmed',
    label: 'Đã xác nhận',
    description: 'Phòng đã được giữ cho khách',
    dotClass: 'bg-emerald-500 text-emerald-500',
  },
  {
    value: 'cancelled',
    label: 'Đã hủy',
    description: 'Không còn giữ phòng',
    dotClass: 'bg-slate-400 text-slate-400',
  },
  {
    value: 'completed',
    label: 'Đã hoàn thành',
    description: 'Khách đã kết thúc lưu trú',
    dotClass: 'bg-sky-500 text-sky-500',
  },
];

const PAYMENT_STATUS_OPTIONS: Array<TAdminSelectOption<TPaymentStatus>> = [
  {
    value: 'unpaid',
    label: 'Chưa thanh toán',
    description: 'Chưa ghi nhận giao dịch',
    dotClass: 'bg-slate-400 text-slate-400',
  },
  {
    value: 'pending',
    label: 'Đang xử lý',
    description: 'Đang chờ kết quả thanh toán',
    dotClass: 'bg-amber-400 text-amber-400',
  },
  {
    value: 'paid',
    label: 'Đã thanh toán',
    description: 'Giao dịch thành công',
    dotClass: 'bg-emerald-500 text-emerald-500',
  },
  {
    value: 'failed',
    label: 'Thanh toán lỗi',
    description: 'Giao dịch không thành công',
    dotClass: 'bg-rose-500 text-rose-500',
  },
  {
    value: 'refunded',
    label: 'Đã hoàn tiền',
    description: 'Khoản tiền đã được hoàn lại',
    dotClass: 'bg-violet-500 text-violet-500',
  },
];

const BOOKING_STATUS_STYLES: Record<TBookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-600',
  completed: 'bg-sky-100 text-sky-700',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`));

const formatCreatedAt = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

function CloseIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <path d='m6 6 12 12M18 6 6 18' strokeLinecap='round' />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <rect x='3' y='5' width='18' height='16' rx='2' />
      <path d='M8 3v4m8-4v4M3 10h18' />
    </svg>
  );
}

export function BookingDetailDialog({
  booking,
  isPending,
  onClose,
  onUpdate,
}: TBookingDetailDialogProps) {
  const [bookingStatus, setBookingStatus] = useState(booking.bookingStatus);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasChanges =
    bookingStatus !== booking.bookingStatus ||
    paymentStatus !== booking.paymentStatus;
  const bookingStatusLabel =
    BOOKING_STATUS_OPTIONS.find((item) => item.value === booking.bookingStatus)
      ?.label ?? booking.bookingStatus;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPending, onClose]);

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='booking-detail-title'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/70 p-3 backdrop-blur-sm sm:p-5'>
      <div className='max-h-[94vh] w-full max-w-[860px] overflow-y-auto rounded-[22px] bg-[#F8FAF9] shadow-[0_30px_100px_rgba(0,0,0,0.3)]'>
        <header className='sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#DDE7E3] bg-white/95 px-5 py-4 backdrop-blur sm:px-7 sm:py-5'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <p className='text-[10px] font-extrabold tracking-[0.12em] text-[#71837D] uppercase'>
                Chi tiết booking
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${BOOKING_STATUS_STYLES[booking.bookingStatus]}`}>
                {bookingStatusLabel}
              </span>
            </div>
            <h2
              id='booking-detail-title'
              className='mt-1 truncate font-[family-name:var(--font-lora)] text-xl font-bold text-[#0D4949] sm:text-2xl'>
              {booking.bookingCode}
            </h2>
            <p className='mt-1 text-[10px] text-slate-500'>
              Tạo lúc {formatCreatedAt(booking.createdAt)}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label='Đóng chi tiết booking'
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDF3F1] text-[#3A5A55] transition hover:bg-[#DFEAE6] disabled:opacity-50'>
            <CloseIcon />
          </button>
        </header>

        <div className='grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px]'>
          <div className='space-y-5'>
            <section className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-[16px] border border-[#DCE7E3] bg-white p-4'>
                <div className='flex items-center gap-2 text-[#0D665A]'>
                  <CalendarIcon />
                  <p className='text-[9px] font-extrabold tracking-[0.1em] uppercase'>
                    Nhận phòng
                  </p>
                </div>
                <p className='mt-2 text-sm font-extrabold text-[#173F3D]'>
                  {formatDate(booking.checkInDate)}
                </p>
                <p className='mt-1 text-[10px] text-slate-500'>Sau 15:00</p>
              </div>
              <div className='rounded-[16px] border border-[#DCE7E3] bg-white p-4'>
                <div className='flex items-center gap-2 text-[#9A6845]'>
                  <CalendarIcon />
                  <p className='text-[9px] font-extrabold tracking-[0.1em] uppercase'>
                    Trả phòng
                  </p>
                </div>
                <p className='mt-2 text-sm font-extrabold text-[#173F3D]'>
                  {formatDate(booking.checkOutDate)}
                </p>
                <p className='mt-1 text-[10px] text-slate-500'>
                  {booking.totalNights} đêm
                </p>
              </div>
            </section>

            <section className='rounded-[18px] border border-[#DCE7E3] bg-white p-5'>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>
                Thông tin khách hàng
              </h3>
              <dl className='mt-4 grid gap-x-5 gap-y-3 text-xs sm:grid-cols-2'>
                <div>
                  <dt className='text-[9px] font-bold text-slate-400 uppercase'>
                    Họ tên liên hệ
                  </dt>
                  <dd className='mt-1 font-semibold text-slate-700'>
                    {booking.customerInfo.fullNameContact}
                  </dd>
                </div>
                <div>
                  <dt className='text-[9px] font-bold text-slate-400 uppercase'>
                    Tài khoản
                  </dt>
                  <dd className='mt-1 font-semibold text-slate-700'>
                    {booking.userId?.full_name ?? 'Tài khoản đã xóa'}
                  </dd>
                </div>
                <div>
                  <dt className='text-[9px] font-bold text-slate-400 uppercase'>
                    Điện thoại
                  </dt>
                  <dd className='mt-1 font-semibold text-slate-700'>
                    {booking.customerInfo.phoneContact}
                  </dd>
                </div>
                <div>
                  <dt className='text-[9px] font-bold text-slate-400 uppercase'>
                    Email
                  </dt>
                  <dd className='mt-1 font-semibold break-all text-slate-700'>
                    {booking.customerInfo.emailContact}
                  </dd>
                </div>
              </dl>
              {booking.customerInfo.note && (
                <div className='mt-4 rounded-xl bg-[#F3F6F5] px-4 py-3'>
                  <p className='text-[9px] font-bold text-slate-400 uppercase'>
                    Ghi chú
                  </p>
                  <p className='mt-1 text-xs leading-5 text-slate-600'>
                    {booking.customerInfo.note}
                  </p>
                </div>
              )}
            </section>

            <section className='overflow-hidden rounded-[18px] border border-[#DCE7E3] bg-white'>
              <div className='border-b border-[#E4ECE9] px-5 py-4'>
                <h3 className='text-xs font-extrabold text-[#173F3D]'>
                  Phòng đã đặt
                </h3>
              </div>
              <div className='divide-y divide-[#E7EEEB]'>
                {booking.bookingItems.map((item, index) => {
                  const room =
                    typeof item.roomId === 'string' ? null : item.roomId;
                  const lineTotal =
                    item.pricePerNight * item.quantity * booking.totalNights;

                  return (
                    <div
                      key={`${booking._id}-${room?._id ?? index}`}
                      className='flex items-start justify-between gap-4 px-5 py-4'>
                      <div>
                        <p className='text-xs font-bold text-slate-700'>
                          {room?.title ?? 'Phòng đã xóa'}
                        </p>
                        <p className='mt-1 text-[10px] text-slate-500'>
                          {item.quantity} phòng × {booking.totalNights} đêm ×{' '}
                          {formatCurrency(item.pricePerNight)}
                        </p>
                      </div>
                      <p className='shrink-0 text-xs font-extrabold text-[#0D4949]'>
                        {formatCurrency(lineTotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className='space-y-5'>
            <section className='rounded-[18px] border border-[#DCE7E3] bg-white p-5'>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>
                Thanh toán
              </h3>
              <dl className='mt-4 space-y-2.5 text-[10px] text-slate-600'>
                <div className='flex justify-between gap-3'>
                  <dt>Tạm tính</dt>
                  <dd>{formatCurrency(booking.subtotal)}</dd>
                </div>
                {booking.discountAmount > 0 && (
                  <div className='flex justify-between gap-3 text-emerald-700'>
                    <dt>Giảm giá</dt>
                    <dd>− {formatCurrency(booking.discountAmount)}</dd>
                  </div>
                )}
                <div className='flex justify-between gap-3'>
                  <dt>Phí dịch vụ</dt>
                  <dd>{formatCurrency(booking.serviceChargeAmount)}</dd>
                </div>
                <div className='flex justify-between gap-3'>
                  <dt>Thuế</dt>
                  <dd>{formatCurrency(booking.taxAmount)}</dd>
                </div>
                <div className='flex items-end justify-between gap-3 border-t border-[#DCE7E3] pt-3'>
                  <dt className='font-bold text-slate-700'>Tổng thanh toán</dt>
                  <dd className='text-base font-extrabold text-[#0D4949]'>
                    {formatCurrency(booking.totalAmount)}
                  </dd>
                </div>
              </dl>
              <p className='mt-3 rounded-lg bg-[#F3F6F5] px-3 py-2 text-[9px] font-bold text-slate-500 uppercase'>
                Phương thức: {booking.paymentMethod}
              </p>
            </section>

            <section className='rounded-[18px] border border-[#DCE7E3] bg-white p-5'>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>
                Cập nhật trạng thái
              </h3>
              <div className='mt-4'>
                <p className='text-[10px] font-bold text-slate-500'>
                  Trạng thái booking
                </p>
                <AdminSelect
                  value={bookingStatus}
                  options={BOOKING_STATUS_OPTIONS}
                  onChange={setBookingStatus}
                  ariaLabel='Trạng thái booking'
                  disabled={isPending}
                  placement='top'
                  className='mt-1.5'
                />
              </div>

              <div className='mt-4'>
                <p className='text-[10px] font-bold text-slate-500'>
                  Trạng thái thanh toán
                </p>
                <AdminSelect
                  value={paymentStatus}
                  options={PAYMENT_STATUS_OPTIONS}
                  onChange={setPaymentStatus}
                  ariaLabel='Trạng thái thanh toán'
                  disabled={isPending}
                  placement='top'
                  className='mt-1.5'
                />
              </div>

              <button
                type='button'
                disabled={!hasChanges || isPending}
                onClick={() => onUpdate({ bookingStatus, paymentStatus })}
                className='mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0D4949] px-5 text-xs font-extrabold text-white transition hover:bg-[#083D3D] disabled:cursor-not-allowed disabled:opacity-45'>
                {isPending && (
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                )}
                {isPending ? 'Đang cập nhật…' : 'Lưu trạng thái'}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
