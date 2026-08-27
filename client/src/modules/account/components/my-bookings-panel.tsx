'use client';

import { Button } from '@/components/core';
import { useMyBookingsApi } from '@/modules/booking/common/hooks';
import { formatCurrency, formatStayDate } from '@/modules/booking/common/utils';
import Image from 'next/image';
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

const formatBookingDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export function MyBookingsPanel() {
  const bookingsQuery = useMyBookingsApi();

  if (bookingsQuery.isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2].map((item) => (
          <div
            key={item}
            className='h-[320px] animate-pulse rounded-[16px] bg-white/75'
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
    <div className='space-y-5'>
      {bookings.map((booking, bookingIndex) => {
        const roomCount = booking.bookingItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const amountAfterDiscount = Math.max(
          0,
          booking.subtotal - booking.discountAmount
        );
        const voucherCode =
          booking.voucherId && typeof booking.voucherId !== 'string'
            ? booking.voucherId.code
            : null;

        return (
          <article
            key={booking._id}
            className='overflow-hidden rounded-[18px] border border-[#DCE7E3] bg-white shadow-[0_16px_45px_rgba(13,73,73,0.08)]'>
            <div className='flex flex-col gap-3 border-b border-[#E4ECE9] bg-[#F6F9F8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-[10px] font-bold text-[#75827E] uppercase'>
                  Mã booking
                </p>
                <p className='mt-1 text-sm font-extrabold text-[#193D3B]'>
                  {booking.bookingCode}
                </p>
                <p className='mt-1 text-[10px] text-[#7A8581]'>
                  Đặt lúc {formatBookingDate(booking.createdAt)}
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

            <div className='grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_230px]'>
              <div className='min-w-0'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-[14px] bg-[#F4F7F6] px-4 py-3'>
                    <p className='text-[9px] font-bold text-[#75827E] uppercase'>
                      Nhận phòng
                    </p>
                    <p className='mt-1 text-xs font-bold text-[#193D3B]'>
                      {formatStayDate(booking.checkInDate)}
                    </p>
                  </div>
                  <div className='rounded-[14px] bg-[#F4F7F6] px-4 py-3'>
                    <p className='text-[9px] font-bold text-[#75827E] uppercase'>
                      Trả phòng
                    </p>
                    <p className='mt-1 text-xs font-bold text-[#193D3B]'>
                      {formatStayDate(booking.checkOutDate)}
                    </p>
                  </div>
                </div>

                <div className='mt-5 flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-extrabold text-[#193D3B]'>
                      Các phòng đã đặt
                    </p>
                    <p className='mt-0.5 text-[10px] text-[#71807B]'>
                      {roomCount} phòng · {booking.totalNights} đêm
                    </p>
                  </div>
                  <span className='rounded-full bg-[#EAF3F0] px-2.5 py-1 text-[9px] font-bold text-[#0D665A]'>
                    {booking.bookingItems.length} loại phòng
                  </span>
                </div>

                <div className='mt-3 divide-y divide-[#E3EAE7] overflow-hidden rounded-[16px] border border-[#DCE6E2]'>
                  {booking.bookingItems.map((item, index) => {
                    const room =
                      typeof item.roomId === 'string' ? null : item.roomId;
                    const lineTotal =
                      item.pricePerNight * item.quantity * booking.totalNights;
                    const roomHref = room ? `/rooms/${room._id}` : null;

                    return (
                      <div
                        key={room?._id ?? `${booking._id}-${index}`}
                        className='grid gap-3 p-3 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-center sm:gap-4'>
                        {room?.thumbnail && roomHref ? (
                          <Link
                            href={roomHref}
                            aria-label={`Xem ${room.title}`}
                            className='relative block h-[82px] overflow-hidden rounded-[12px] bg-[#E9EFED]'>
                            <Image
                              src={room.thumbnail}
                              alt={room.title}
                              fill
                              loading={bookingIndex === 0 ? 'eager' : 'lazy'}
                              sizes='104px'
                              className='object-cover transition-transform duration-300 hover:scale-105'
                            />
                          </Link>
                        ) : (
                          <div className='flex h-[82px] items-center justify-center rounded-[12px] bg-[#E9EFED] text-[#64807A]'>
                            <svg
                              aria-hidden='true'
                              viewBox='0 0 24 24'
                              className='h-7 w-7 fill-current'>
                              <path d='M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5V17h1.5v2H2.5v-2H4V5.5Zm2 6.5h12V5.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5V12Zm0 5h12v-3H6v3Z' />
                            </svg>
                          </div>
                        )}

                        <div className='min-w-0'>
                          {roomHref ? (
                            <Link
                              href={roomHref}
                              className='text-xs font-extrabold text-[#193D3B] transition-colors hover:text-[#A66641]'>
                              {room?.title}
                            </Link>
                          ) : (
                            <p className='text-xs font-extrabold text-[#193D3B]'>
                              Phòng đã đặt
                            </p>
                          )}

                          {room && (
                            <div className='mt-2 flex flex-wrap gap-1.5'>
                              {room.bed && (
                                <span className='rounded-full bg-[#F1F5F3] px-2 py-1 text-[9px] text-[#62706C]'>
                                  {room.bed}
                                </span>
                              )}
                              {room.area > 0 && (
                                <span className='rounded-full bg-[#F1F5F3] px-2 py-1 text-[9px] text-[#62706C]'>
                                  {room.area} m²
                                </span>
                              )}
                              {room.capacity > 0 && (
                                <span className='rounded-full bg-[#F1F5F3] px-2 py-1 text-[9px] text-[#62706C]'>
                                  {room.capacity} khách
                                </span>
                              )}
                              {room.views && (
                                <span className='rounded-full bg-[#F1F5F3] px-2 py-1 text-[9px] text-[#62706C]'>
                                  View {room.views}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className='border-t border-[#EDF1EF] pt-3 sm:min-w-[150px] sm:border-t-0 sm:pt-0 sm:text-right'>
                          <p className='text-sm font-extrabold text-[#0D4949]'>
                            {formatCurrency(lineTotal)}
                          </p>
                          <p className='mt-1 text-[9px] leading-4 text-[#6E7A77]'>
                            {item.quantity} phòng × {booking.totalNights} đêm
                          </p>
                          <p className='text-[9px] leading-4 text-[#6E7A77]'>
                            {formatCurrency(item.pricePerNight)} / phòng / đêm
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className='rounded-[16px] border border-[#DCE6E2] bg-[#FAFBFA] p-4 lg:self-start'>
                <div className='border-b border-[#DCE6E2] pb-3'>
                  <p className='text-[9px] font-bold text-[#75827E] uppercase'>
                    Thanh toán
                  </p>
                  <div className='mt-1 flex items-center justify-between gap-3'>
                    <p className='text-xs font-extrabold text-[#193D3B]'>
                      {booking.paymentMethod === 'vnpay'
                        ? 'VNPay'
                        : booking.paymentMethod === 'momo'
                          ? 'MoMo'
                          : 'Chuyển khoản'}
                    </p>
                    <span className='text-[9px] font-bold text-[#97610B]'>
                      {PAYMENT_STATUS_LABELS[booking.paymentStatus]}
                    </span>
                  </div>
                </div>

                <dl className='mt-4 space-y-2.5 text-[10px]'>
                  <div className='flex justify-between gap-3 text-[#5E6965]'>
                    <dt>Tạm tính tiền phòng</dt>
                    <dd>{formatCurrency(booking.subtotal)}</dd>
                  </div>
                  {booking.discountAmount > 0 && (
                    <>
                      <div className='flex justify-between gap-3 font-semibold text-[#236B51]'>
                        <dt>Voucher{voucherCode ? ` (${voucherCode})` : ''}</dt>
                        <dd>− {formatCurrency(booking.discountAmount)}</dd>
                      </div>
                      <div className='flex justify-between gap-3 text-[#71807B]'>
                        <dt>Sau giảm giá</dt>
                        <dd>{formatCurrency(amountAfterDiscount)}</dd>
                      </div>
                    </>
                  )}
                  <div className='flex justify-between gap-3 text-[#5E6965]'>
                    <dt>Phí dịch vụ (5%)</dt>
                    <dd>{formatCurrency(booking.taxAmount)}</dd>
                  </div>
                </dl>

                <div className='mt-4 border-t border-[#D5E0DC] pt-4'>
                  <p className='text-[9px] font-bold text-[#75827E] uppercase'>
                    Tổng thanh toán
                  </p>
                  <p className='mt-1 text-lg font-extrabold text-[#0D4949]'>
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>
              </aside>
            </div>
          </article>
        );
      })}
    </div>
  );
}
