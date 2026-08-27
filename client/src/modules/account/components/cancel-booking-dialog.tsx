'use client';

import { TBooking } from '@/modules/booking/common/types';
import { formatCurrency, formatStayDate } from '@/modules/booking/common/utils';
import { useEffect, useRef } from 'react';

type TCancelBookingDialogProps = {
  booking: TBooking | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelBookingDialog({
  booking,
  isPending,
  onClose,
  onConfirm,
}: TCancelBookingDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!booking) return;

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
  }, [booking, isPending, onClose]);

  if (!booking) return null;

  const roomCount = booking.bookingItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='cancel-booking-title'
      aria-describedby='cancel-booking-description'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/70 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-[500px] overflow-hidden rounded-[24px] border border-white/40 bg-white shadow-[0_32px_100px_rgba(1,31,30,0.38)]'>
        <div className='relative overflow-hidden bg-[#F7EFEB] px-6 pt-7 pb-6 text-center sm:px-8'>
          <div className='absolute -top-20 -right-16 h-44 w-44 rounded-full bg-[#C56B55]/10' />
          <div className='absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-[#0D4949]/7' />

          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label='Đóng hộp thoại'
            className='absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#DFCFC8] bg-white/80 text-xl text-[#6B514A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50'>
            ×
          </button>

          <div className='relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#A64242] shadow-[0_10px_28px_rgba(166,66,66,0.16)]'>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='h-8 w-8 fill-none stroke-current'
              strokeWidth='1.8'>
              <path d='M12 8v5m0 3.25v.25' strokeLinecap='round' />
              <path d='M10.3 3.9 2.4 17.6A1.6 1.6 0 0 0 3.8 20h16.4a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a1.96 1.96 0 0 0-3.4 0Z' />
            </svg>
          </div>

          <h2
            id='cancel-booking-title'
            className='font-lora relative mt-4 text-2xl font-semibold text-[#A15A48] uppercase'>
            Xác nhận hủy đặt phòng ?
          </h2>
          <p
            id='cancel-booking-description'
            className='relative mx-auto mt-2 max-w-[380px] text-xs leading-5 text-[#66736F]'>
            Booking sẽ chuyển sang trạng thái đã hủy và phòng sẽ được mở lại cho
            khách khác.
          </p>
        </div>

        <div className='px-6 py-6 sm:px-8'>
          <div className='rounded-[16px] border border-[#DDE7E3] bg-[#F8FAF9] p-4'>
            <div className='flex items-center justify-between gap-4 border-b border-[#E1E9E6] pb-3'>
              <div>
                <p className='text-[9px] font-bold tracking-[0.12em] text-[#78847F] uppercase'>
                  Mã booking
                </p>
                <p className='mt-1 text-sm font-extrabold text-[#193D3B]'>
                  {booking.bookingCode}
                </p>
              </div>
              <p className='text-base font-extrabold text-[#0D4949]'>
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>

            <div className='mt-3 grid grid-cols-2 gap-3 text-[10px]'>
              <div>
                <p className='text-[#7A8581]'>Nhận phòng</p>
                <p className='mt-1 font-bold text-[#294B48]'>
                  {formatStayDate(booking.checkInDate)}
                </p>
              </div>
              <div>
                <p className='text-[#7A8581]'>Thời gian lưu trú</p>
                <p className='mt-1 font-bold text-[#294B48]'>
                  {roomCount} phòng · {booking.totalNights} đêm
                </p>
              </div>
            </div>
          </div>

          <div className='mt-4 flex gap-3 rounded-[14px] border border-[#ECD8B2] bg-[#FFF8E9] px-4 py-3 text-[10px] leading-4 text-[#765820]'>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              className='mt-0.5 h-4 w-4 shrink-0 fill-none stroke-current'
              strokeWidth='1.8'>
              <circle cx='12' cy='12' r='9' />
              <path
                d='M12 7v5l3 2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <p>
              Chính sách chỉ cho phép hủy tối thiểu 48 giờ trước giờ nhận phòng.
              Thao tác này không thể hoàn tác.
            </p>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={isPending}
              className='h-12 rounded-full border border-[#B9CBC5] bg-white px-5 text-xs font-bold text-[#315A55] transition hover:border-[#0D4949] hover:bg-[#F4F8F7] disabled:cursor-not-allowed disabled:opacity-50'>
              Giữ đặt phòng
            </button>
            <button
              type='button'
              onClick={onConfirm}
              disabled={isPending}
              className='flex h-12 items-center justify-center gap-2 rounded-full bg-[#A64242] px-5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(166,66,66,0.22)] transition hover:bg-[#913838] disabled:cursor-wait disabled:opacity-70'>
              {isPending && (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              )}
              {isPending ? 'Đang hủy booking…' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
