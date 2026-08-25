'use client';

import { formatCurrency } from '@/utils';
import { useAdminSummaryApi } from '../common';

const formatAdminDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

export function AdminOverview() {
  const summaryQuery = useAdminSummaryApi();
  const summary = summaryQuery.data;
  const bookings = summary?.recentBookings ?? [];
  const stats = [
    {
      label: 'Người dùng',
      value: summaryQuery.isLoading
        ? '—'
        : (summary?.totalUsers ?? 0).toLocaleString('vi-VN'),
      note: `${summary?.activeUsers ?? 0} đang hoạt động`,
      color: 'bg-[#EAF4F1] text-[#0D665A]',
    },
    {
      label: 'Tổng số phòng',
      value: summaryQuery.isLoading
        ? '—'
        : (summary?.totalRooms ?? 0).toLocaleString('vi-VN'),
      note: `${summary?.availableRooms ?? 0} đang mở bán`,
      color: 'bg-[#EAF1FB] text-[#245D9C]',
    },
    {
      label: 'Booking',
      value: summaryQuery.isLoading
        ? '—'
        : (summary?.totalBookings ?? 0).toLocaleString('vi-VN'),
      note: `${summary?.pendingBookings ?? 0} chờ xác nhận`,
      color: 'bg-[#FFF3DB] text-[#97610B]',
    },
    {
      label: 'Doanh thu đã trả',
      value: summaryQuery.isLoading
        ? '—'
        : formatCurrency(summary?.paidRevenue ?? 0),
      note: 'Từ booking đã thanh toán',
      color: 'bg-[#F0ECFA] text-[#6745A1]',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <article
            key={stat.label}
            className='rounded-[16px] border border-[#DDE7E4] bg-white p-5 shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${stat.color}`}>
              {stat.label}
            </span>
            <p className='mt-4 truncate text-2xl font-black text-[#163D3B]'>
              {stat.value}
            </p>
            <p className='mt-1 text-[11px] text-[#74817D]'>{stat.note}</p>
          </article>
        ))}
      </div>

      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='flex items-center justify-between border-b border-[#E5ECEA] px-5 py-4 sm:px-6'>
          <div>
            <h2 className='text-base font-extrabold text-[#163D3B]'>
              Booking gần đây
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              5 đơn mới nhất trong hệ thống
            </p>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[720px] text-left'>
            <thead className='bg-[#F7F9F8] text-[10px] text-[#71807B] uppercase'>
              <tr>
                <th className='px-6 py-3 font-bold'>Mã booking</th>
                <th className='px-4 py-3 font-bold'>Khách hàng</th>
                <th className='px-4 py-3 font-bold'>Ngày tạo</th>
                <th className='px-4 py-3 font-bold'>Trạng thái</th>
                <th className='px-6 py-3 text-right font-bold'>Tổng tiền</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#E8EEEC] text-xs'>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id} className='hover:bg-[#FAFCFB]'>
                  <td className='px-6 py-4 font-extrabold text-[#0D4949]'>
                    {booking.bookingCode}
                  </td>
                  <td className='px-4 py-4'>
                    {booking.userId?.full_name ??
                      booking.customerInfo.fullNameContact}
                  </td>
                  <td className='px-4 py-4 text-[#71807B]'>
                    {formatAdminDate(booking.createdAt)}
                  </td>
                  <td className='px-4 py-4 capitalize'>
                    {booking.bookingStatus}
                  </td>
                  <td className='px-6 py-4 text-right font-bold'>
                    {formatCurrency(booking.totalAmount)}
                  </td>
                </tr>
              ))}
              {!summaryQuery.isLoading && bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-12 text-center text-[#7A8682]'>
                    Chưa có booking nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
