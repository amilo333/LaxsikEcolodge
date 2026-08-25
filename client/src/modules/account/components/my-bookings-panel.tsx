'use client';

import { Button } from '@/components/core';
import { useMyBookingsApi } from '@/modules/booking/common/hooks';
import { formatCurrency, formatStayDate } from '@/modules/booking/common/utils';
import Link from 'next/link';

const BOOKING_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  completed: 'Đã hoàn thành',
};

const PAYMENT_STATUS_LABELS = {
  unpaid: 'Chưa thanh toán',
  pending: 'Đang xử lý',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán lỗi',
  refunded: 'Đã hoàn tiền',
};

export function MyBookingsPanel() {
  const bookingsQuery = useMyBookingsApi();

  if (bookingsQuery.isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2].map((item) => (
          <div
            key={item}
            className='h-[220px] animate-pulse rounded-[16px] bg-white/75'
          />
        ))}
      </div>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <div className='rounded-[16px] border border-[#E7B8B8] bg-white p-7 text-center'>
        <h2 className='text-lg font-extrabold text-[#8F2F2F]'>
          Không thể tải danh sách booking
        </h2>
        <p className='mt-2 text-sm text-[#6E7774]'>
          Vui lòng kiểm tra lại kết nối và thử lại.
        </p>
        <Button
          onClick={() => void bookingsQuery.refetch()}
          className='mx-auto mt-5 h-11! w-auto! rounded-full! px-6! text-sm!'>
          Thử lại
        </Button>
      </div>
    );
  }

  const bookings = bookingsQuery.data ?? [];

  if (bookings.length === 0) {
    return (
      <div className='rounded-[16px] border border-[#DCE7E3] bg-white p-8 text-center shadow-[0_16px_45px_rgba(13,73,73,0.08)]'>
        <span className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF5F3] text-2xl'>
          ⌂
        </span>
        <h2 className='mt-5 text-xl font-extrabold text-[#193D3B]'>
          Bạn chưa đặt phòng nào
        </h2>
        <p className='mt-2 text-sm text-[#6E7B77]'>
          Các booking được tạo từ tài khoản này sẽ xuất hiện tại đây.
        </p>
        <Link
          href='/rooms'
          className='mt-6 inline-flex h-11 items-center rounded-full bg-[#0D4949] px-7 text-sm font-bold text-white'>
          Xem phòng
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {bookings.map((booking) => {
        const roomCount = booking.bookingItems.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return (
          <article
            key={booking._id}
            className='overflow-hidden rounded-[16px] border border-[#DCE7E3] bg-white shadow-[0_16px_45px_rgba(13,73,73,0.08)]'>
            <div className='flex flex-col gap-3 border-b border-[#E4ECE9] bg-[#F6F9F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-[10px] font-bold tracking-[0.14em] text-[#75827E] uppercase'>
                  Mã booking
                </p>
                <p className='mt-1 text-sm font-extrabold text-[#193D3B]'>
                  {booking.bookingCode}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <span className='rounded-full bg-[#E7F1EE] px-3 py-1.5 text-[10px] font-bold text-[#0D665A]'>
                  {BOOKING_STATUS_LABELS[booking.bookingStatus]}
                </span>
                <span className='rounded-full bg-[#FFF4DC] px-3 py-1.5 text-[10px] font-bold text-[#97610B]'>
                  {PAYMENT_STATUS_LABELS[booking.paymentStatus]}
                </span>
              </div>
            </div>

            <div className='grid gap-5 p-5 md:grid-cols-[1fr_auto]'>
              <div>
                <p className='text-sm font-extrabold text-[#193D3B]'>
                  {formatStayDate(booking.checkInDate)} —{' '}
                  {formatStayDate(booking.checkOutDate)}
                </p>
                <p className='mt-1 text-xs text-[#71807B]'>
                  {booking.totalNights} đêm · {roomCount} phòng
                </p>

                <div className='mt-4 space-y-2 border-t border-[#E8EEEC] pt-4'>
                  {booking.bookingItems.map((item, index) => {
                    const room =
                      typeof item.roomId === 'string' ? null : item.roomId;

                    return (
                      <div
                        key={room?._id ?? `${booking._id}-${index}`}
                        className='flex items-center justify-between gap-4 text-xs'>
                        <span className='font-semibold text-[#354A46]'>
                          {item.quantity} × {room?.title ?? 'Phòng đã đặt'}
                        </span>
                        <span className='shrink-0 text-[#6E7A77]'>
                          {formatCurrency(
                            item.pricePerNight *
                              item.quantity *
                              booking.totalNights
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className='border-t border-[#E4ECE9] pt-4 text-left md:min-w-[180px] md:border-t-0 md:border-l md:pt-0 md:pl-5 md:text-right'>
                <p className='text-[10px] font-bold tracking-[0.12em] text-[#75827E] uppercase'>
                  Tổng thanh toán
                </p>
                <p className='mt-2 text-xl font-extrabold text-[#0D4949]'>
                  {formatCurrency(booking.totalAmount)}
                </p>
                <p className='mt-2 text-[11px] text-[#78847F] uppercase'>
                  {booking.paymentMethod === 'vnpay'
                    ? 'VNPAY'
                    : booking.paymentMethod === 'momo'
                      ? 'MoMo'
                      : 'Chuyển khoản'}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
