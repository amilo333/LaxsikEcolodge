'use client';

import { formatCurrency } from '@/utils';
import Link from 'next/link';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

const getNumericValue = (value: unknown) => {
  const resolvedValue = Array.isArray(value) ? value[0] : value;
  const number = Number(resolvedValue ?? 0);

  return Number.isFinite(number) ? number : 0;
};

const formatCompactCurrency = (value: unknown) => {
  const amount = getNumericValue(value);

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toLocaleString('vi-VN', {
      maximumFractionDigits: 1,
    })} tỷ`;
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('vi-VN', {
      maximumFractionDigits: 1,
    })} tr`;
  }

  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000).toLocaleString('vi-VN')}k`;
  }

  return amount.toLocaleString('vi-VN');
};

const tooltipStyle = {
  border: '1px solid #DDE7E4',
  borderRadius: '12px',
  boxShadow: '0 12px 30px rgba(13, 73, 73, 0.12)',
  color: '#263F3C',
  fontSize: '11px',
};

const formatGrowthNote = (growth: number | null | undefined) => {
  if (growth == null) return 'Chưa có dữ liệu tháng trước';

  return `${growth >= 0 ? '+' : ''}${growth.toLocaleString('vi-VN', {
    maximumFractionDigits: 1,
  })}% so với tháng trước`;
};

function BookingTrendChart({ data }: { data: TAdminSummary['bookingTrend'] }) {
  return (
    <div className='overflow-x-auto'>
      <div
        role='img'
        aria-label='Biểu đồ booking, khách và doanh thu 6 tháng gần nhất'
        className='h-[260px] min-w-[560px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ top: 12, right: 4, bottom: 4, left: -18 }}>
            <defs>
              <linearGradient id='guest-area' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor='#D18A17' stopOpacity='0.2' />
                <stop offset='100%' stopColor='#D18A17' stopOpacity='0.01' />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke='#E7EEEB'
              strokeDasharray='4 4'
            />
            <XAxis
              dataKey='label'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71807B', fontSize: 11, fontWeight: 600 }}
              tickMargin={10}
            />
            <YAxis
              yAxisId='activity'
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={42}
              tick={{ fill: '#8A9692', fontSize: 10 }}
            />
            <YAxis
              yAxisId='revenue'
              orientation='right'
              axisLine={false}
              tickLine={false}
              width={64}
              tick={{ fill: '#8A9692', fontSize: 10 }}
              tickFormatter={formatCompactCurrency}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: '#F2F6F4', opacity: 0.7 }}
              labelStyle={{ color: '#163D3B', fontWeight: 800 }}
              formatter={(value, name) => {
                const amount = getNumericValue(value);
                const label = String(name ?? '');

                return [
                  label === 'Doanh thu'
                    ? formatCurrency(amount)
                    : amount.toLocaleString('vi-VN'),
                  label,
                ];
              }}
            />
            <Bar
              yAxisId='revenue'
              dataKey='paidRevenue'
              name='Doanh thu'
              fill='#DCECE7'
              maxBarSize={34}
              radius={[9, 9, 2, 2]}
            />
            <Area
              yAxisId='activity'
              type='monotone'
              dataKey='guests'
              name='Khách'
              stroke='#D18A17'
              strokeWidth={3}
              fill='url(#guest-area)'
              dot={{ fill: '#D18A17', r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 3 }}
            />
            <Line
              yAxisId='activity'
              type='monotone'
              dataKey='bookings'
              name='Booking'
              stroke='#0D5A56'
              strokeWidth={3}
              dot={{ fill: '#0D5A56', r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BookingStatusChart({
  data,
}: {
  data: TAdminSummary['bookingStatus'];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const chartData = total
    ? data.map((item) => ({
        name: STATUS_META[item.status].label,
        value: item.count,
        color: STATUS_META[item.status].color,
      }))
    : [{ name: 'Chưa có dữ liệu', value: 1, color: '#E8EFED' }];

  return (
    <div className='grid items-center gap-6 sm:grid-cols-[170px_1fr]'>
      <div
        role='img'
        aria-label='Biểu đồ tỷ lệ trạng thái booking'
        className='relative mx-auto h-44 w-44'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart accessibilityLayer>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={53}
              outerRadius={76}
              paddingAngle={total ? 2 : 0}
              cornerRadius={5}
              stroke='#FFFFFF'
              strokeWidth={2}>
              {chartData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={false}
                formatter={(value, name) => [
                  `${getNumericValue(value).toLocaleString('vi-VN')} booking`,
                  String(name ?? ''),
                ]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-2xl font-black text-[#163D3B]'>
            {total.toLocaleString('vi-VN')}
          </span>
          <span className='text-[10px] font-bold text-[#7A8682]'>Booking</span>
        </div>
      </div>

      <div className='space-y-3'>
        {data.length > 0 ? (
          data.map((item) => (
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
          ))
        ) : (
          <p className='text-center text-xs text-[#7A8682] sm:text-left'>
            Chưa có dữ liệu trạng thái.
          </p>
        )}
      </div>
    </div>
  );
}

function RoomOccupancyChart({
  data,
}: {
  data: TAdminSummary['roomPerformance'];
}) {
  if (data.length === 0) {
    return (
      <div className='flex h-[260px] items-center justify-center rounded-[16px] bg-[#F7F9F8] text-xs text-[#7A8682]'>
        Chưa có phòng đang mở bán.
      </div>
    );
  }

  return (
    <div
      role='img'
      aria-label='Biểu đồ công suất phòng trong tháng hiện tại'
      className='h-[260px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          accessibilityLayer
          data={data}
          layout='vertical'
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid
            horizontal={false}
            stroke='#E7EEEB'
            strokeDasharray='4 4'
          />
          <XAxis
            type='number'
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8A9692', fontSize: 10 }}
            tickFormatter={(value) => `${getNumericValue(value)}%`}
          />
          <YAxis
            type='category'
            dataKey='title'
            axisLine={false}
            tickLine={false}
            width={118}
            tick={{ fill: '#556560', fontSize: 10, fontWeight: 600 }}
            tickFormatter={(value) => {
              const label = String(value);
              return label.length > 18 ? `${label.slice(0, 17)}…` : label;
            }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: '#F2F6F4', opacity: 0.75 }}
            formatter={(value) => [
              `${getNumericValue(value).toLocaleString('vi-VN')}%`,
              'Công suất',
            ]}
          />
          <Bar
            dataKey='occupancyRate'
            name='Công suất'
            fill='#0D5A56'
            maxBarSize={28}
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminOverview() {
  const summaryQuery = useAdminSummaryApi();
  const summary = summaryQuery.data;
  const bookings = summary?.recentBookings ?? [];
  const bookingTrend = summary?.bookingTrend ?? [];
  const bookingStatus = summary?.bookingStatus ?? [];
  const roomPerformance = summary?.roomPerformance ?? [];
  const stats = [
    {
      label: 'Doanh thu tháng',
      value: summaryQuery.isLoading
        ? '—'
        : formatCurrency(summary?.currentMonthRevenue ?? 0),
      note: formatGrowthNote(summary?.revenueGrowthPercent),
      color: 'bg-[#EAF4F1] text-[#0D665A]',
    },
    {
      label: 'Công suất phòng',
      value: summaryQuery.isLoading
        ? '—'
        : `${(summary?.occupancyRate ?? 0).toLocaleString('vi-VN')}%`,
      note: `${summary?.occupiedRoomNights ?? 0}/${summary?.availableRoomNights ?? 0} đêm phòng`,
      color: 'bg-[#EAF1FB] text-[#245D9C]',
    },
    {
      label: 'Booking tháng',
      value: summaryQuery.isLoading
        ? '—'
        : (summary?.currentMonthBookings ?? 0).toLocaleString('vi-VN'),
      note: formatGrowthNote(summary?.bookingGrowthPercent),
      color: 'bg-[#FFF3DB] text-[#97610B]',
    },
    {
      label: 'Giá trị booking TB',
      value: summaryQuery.isLoading
        ? '—'
        : formatCurrency(summary?.averageBookingValue ?? 0),
      note: `${summary?.currentMonthPaidBookings ?? 0} booking đã thanh toán`,
      color: 'bg-[#F0ECFA] text-[#6745A1]',
    },
  ];
  const operationalItems = [
    {
      label: 'Check-in hôm nay',
      value: summary?.checkInsToday ?? 0,
      color: 'bg-[#EAF4F1] text-[#0D665A]',
    },
    {
      label: 'Check-out hôm nay',
      value: summary?.checkOutsToday ?? 0,
      color: 'bg-[#EAF1FB] text-[#245D9C]',
    },
    {
      label: 'Chờ xác nhận',
      value: summary?.pendingBookings ?? 0,
      color: 'bg-[#FFF3DB] text-[#97610B]',
    },
    {
      label: 'Chưa thanh toán',
      value: summary?.unpaidBookings ?? 0,
      color: 'bg-[#FCEBEC] text-[#A33A43]',
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

      <div className='grid gap-6 xl:grid-cols-[1.35fr_1fr]'>
        <section className='rounded-[16px] border border-[#DDE7E4] bg-white p-5 shadow-[0_12px_38px_rgba(13,73,73,0.06)] sm:p-6'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
              Công suất theo loại phòng
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              Top 5 loại phòng trong tháng hiện tại
            </p>
          </div>
          <div className='mt-5'>
            {summaryQuery.isLoading ? (
              <div className='h-[260px] animate-pulse rounded-[16px] bg-[#F2F6F4]' />
            ) : (
              <RoomOccupancyChart data={roomPerformance} />
            )}
          </div>
        </section>

        <section className='rounded-[16px] border border-[#DDE7E4] bg-white p-5 shadow-[0_12px_38px_rgba(13,73,73,0.06)] sm:p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
                Cần xử lý hôm nay
              </h2>
              <p className='mt-1 text-[11px] text-[#7A8682]'>
                Các đầu việc vận hành cần chú ý
              </p>
            </div>
            <Link
              href='/admin?section=bookings'
              className='shrink-0 rounded-full border border-[#C9D8D4] px-3 py-2 text-[10px] font-bold text-[#0D665A] hover:bg-[#EAF4F1]'>
              Xem booking
            </Link>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
            {operationalItems.map((item) => (
              <article
                key={item.label}
                className='rounded-[14px] border border-[#E4ECE9] bg-[#FAFCFB] p-4'>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${item.color}`}>
                  {item.label}
                </span>
                <p className='mt-3 text-2xl font-black text-[#163D3B]'>
                  {summaryQuery.isLoading
                    ? '—'
                    : item.value.toLocaleString('vi-VN')}
                </p>
              </article>
            ))}
          </div>

          <p className='mt-4 rounded-xl bg-[#F5F8F7] px-4 py-3 text-[11px] text-[#65736F]'>
            {summaryQuery.isLoading
              ? 'Đang kiểm tra tình trạng phòng…'
              : `${summary?.maintenanceRooms ?? 0} phòng đang bảo trì.`}
          </p>
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
