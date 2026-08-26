'use client';

import { formatCurrency } from '@/utils';
import { TAdminSummary, useAdminSummaryApi } from '../common';

const formatAdminDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

const STATUS_META = {
  pending: { label: 'Chờ xác nhận', color: '#D18A17' },
  confirmed: { label: 'Đã xác nhận', color: '#2D75B6' },
  completed: { label: 'Hoàn thành', color: '#16856F' },
  cancelled: { label: 'Đã hủy', color: '#C85A64' },
} as const;

type TChartPoint = { x: number; y: number };

const createSmoothPath = (points: TChartPoint[]) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const afterNext = points[index + 2] ?? next;
    const controlOne = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const controlTwo = {
      x: next.x - (afterNext.x - current.x) / 6,
      y: next.y - (afterNext.y - current.y) / 6,
    };

    path += ` C ${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${next.x} ${next.y}`;
  }

  return path;
};

function BookingTrendChart({ data }: { data: TAdminSummary['bookingTrend'] }) {
  const maxRevenue = Math.max(...data.map((item) => item.paidRevenue), 1);
  const maxActivity = Math.max(
    ...data.flatMap((item) => [item.bookings, item.guests]),
    1
  );
  const startX = 58;
  const stepX = 86;
  const baselineY = 172;
  const chartHeight = 118;
  const bookingPoints = data.map((item, index) => ({
    x: startX + index * stepX,
    y: baselineY - (item.bookings / maxActivity) * chartHeight,
  }));
  const guestPoints = data.map((item, index) => ({
    x: startX + index * stepX,
    y: baselineY - (item.guests / maxActivity) * chartHeight,
  }));
  const bookingPath = createSmoothPath(bookingPoints);
  const guestPath = createSmoothPath(guestPoints);
  const guestAreaPath = guestPath
    ? `${guestPath} L ${guestPoints.at(-1)?.x} ${baselineY} L ${guestPoints[0].x} ${baselineY} Z`
    : '';

  return (
    <div className='overflow-x-auto'>
      <svg
        viewBox='0 0 550 220'
        role='img'
        aria-label='Biểu đồ booking, khách và doanh thu 6 tháng gần nhất'
        className='min-w-[520px]'>
        <defs>
          <linearGradient id='guest-area' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#D18A17' stopOpacity='0.2' />
            <stop offset='100%' stopColor='#D18A17' stopOpacity='0' />
          </linearGradient>
        </defs>
        {[54, 93, 132, 172].map((y) => (
          <line
            key={y}
            x1='38'
            x2='528'
            y1={y}
            y2={y}
            stroke='#E7EEEB'
            strokeWidth='1'
          />
        ))}

        {data.map((item, index) => {
          const x = startX + index * stepX;
          const barHeight = (item.paidRevenue / maxRevenue) * chartHeight;

          return (
            <g key={item.month}>
              <rect
                x={x - 16}
                y={baselineY - barHeight}
                width='32'
                height={barHeight}
                rx='9'
                fill='#DCECE7'>
                <title>{`${item.label}: ${formatCurrency(item.paidRevenue)} doanh thu`}</title>
              </rect>
              <text
                x={x}
                y='202'
                textAnchor='middle'
                fill='#71807B'
                fontSize='11'
                fontWeight='600'>
                {item.label}
              </text>
            </g>
          );
        })}

        {data.length > 1 && (
          <>
            <path d={guestAreaPath} fill='url(#guest-area)' />
            <path
              d={bookingPath}
              fill='none'
              stroke='#0D5A56'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d={guestPath}
              fill='none'
              stroke='#D18A17'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </>
        )}

        {data.map((item, index) => (
          <g key={`${item.month}-points`}>
            <circle
              cx={bookingPoints[index].x}
              cy={bookingPoints[index].y}
              r='4.5'
              fill='#0D5A56'
              stroke='white'
              strokeWidth='2'>
              <title>{`${item.bookings} booking`}</title>
            </circle>
            <circle
              cx={guestPoints[index].x}
              cy={guestPoints[index].y}
              r='4.5'
              fill='#D18A17'
              stroke='white'
              strokeWidth='2'>
              <title>{`${item.guests} khách đặt phòng`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BookingStatusChart({
  data,
}: {
  data: TAdminSummary['bookingStatus'];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentPercent = 0;
  const gradientSegments = data.map((item) => {
    const start = currentPercent;
    const value = total > 0 ? (item.count / total) * 100 : 0;
    currentPercent += value;
    return `${STATUS_META[item.status].color} ${start}% ${currentPercent}%`;
  });
  const background = total
    ? `conic-gradient(${gradientSegments.join(', ')})`
    : '#E8EFED';

  return (
    <div className='grid items-center gap-6 sm:grid-cols-[170px_1fr]'>
      <div
        className='relative mx-auto flex h-40 w-40 items-center justify-center rounded-full'
        style={{ background }}>
        <div className='flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#E7EEEB]'>
          <span className='text-2xl font-black text-[#163D3B]'>
            {total.toLocaleString('vi-VN')}
          </span>
          <span className='text-[10px] font-bold text-[#7A8682]'>Booking</span>
        </div>
      </div>

      <div className='space-y-3'>
        {data.map((item) => (
          <div
            key={item.status}
            className='flex items-center justify-between gap-4'>
            <span className='flex items-center gap-2 text-[11px] text-[#556560]'>
              <span
                className='h-2.5 w-2.5 rounded-full'
                style={{ backgroundColor: STATUS_META[item.status].color }}
              />
              {STATUS_META[item.status].label}
            </span>
            <span className='text-xs font-extrabold text-[#263F3C]'>
              {item.count.toLocaleString('vi-VN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminOverview() {
  const summaryQuery = useAdminSummaryApi();
  const summary = summaryQuery.data;
  const bookings = summary?.recentBookings ?? [];
  const bookingTrend = summary?.bookingTrend ?? [];
  const bookingStatus = summary?.bookingStatus ?? [];
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

      <div className='grid gap-6 xl:grid-cols-[1.55fr_1fr]'>
        <section className='rounded-[16px] border border-[#DDE7E4] bg-white p-5 shadow-[0_12px_38px_rgba(13,73,73,0.06)] sm:p-6'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
                Booking, khách & doanh thu
              </h2>
              <p className='mt-1 text-[11px] text-[#7A8682]'>
                Dữ liệu 6 tháng gần nhất từ hệ thống
              </p>
            </div>
            <div className='flex items-center gap-4 text-[10px] text-[#6C7975]'>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-[#0D5A56]' />
                Booking
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-[#D18A17]' />
                Khách
              </span>
              <span className='flex items-center gap-1.5'>
                <span className='h-2.5 w-2.5 rounded-[3px] bg-[#DCECE7]' />
                Doanh thu
              </span>
            </div>
          </div>
          <div className='mt-4'>
            {summaryQuery.isLoading ? (
              <div className='h-[220px] animate-pulse rounded-[16px] bg-[#F2F6F4]' />
            ) : (
              <BookingTrendChart data={bookingTrend} />
            )}
          </div>
        </section>

        <section className='rounded-[16px] border border-[#DDE7E4] bg-white p-5 shadow-[0_12px_38px_rgba(13,73,73,0.06)] sm:p-6'>
          <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
            Trạng thái booking
          </h2>
          <p className='mt-1 text-[11px] text-[#7A8682]'>
            Tỷ lệ trạng thái trên toàn hệ thống
          </p>
          <div className='mt-7'>
            {summaryQuery.isLoading ? (
              <div className='h-40 animate-pulse rounded-[16px] bg-[#F2F6F4]' />
            ) : (
              <BookingStatusChart data={bookingStatus} />
            )}
          </div>
        </section>
      </div>

      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='flex items-center justify-between border-b border-[#E5ECEA] px-5 py-4 sm:px-6'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
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
