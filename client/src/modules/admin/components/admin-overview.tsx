'use client';

import {
  Button,
  Card,
  Chip,
  ProgressBar,
  Skeleton,
  Spinner,
  Tabs,
} from '@heroui/react';
import { formatCurrency } from '@/utils';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { localizeTranslatedText } from '@/utils/localized-content';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TAdminAnalytics,
  TAdminAnalyticsGroup,
  TAdminAnalyticsPeriod,
  TAdminRoomOccupancy,
  TAdminBooking,
  TAdminSummary,
  TUpdateAdminBookingPayload,
  useAdminAnalyticsApi,
  useAdminRoomOccupancyApi,
  useAdminSummaryApi,
  useUpdateAdminBookingApi,
} from '../common';
import { AdminSelect } from './admin-select';
import { BookingDetailDialog } from './booking-detail-dialog';

const getCurrentMonthRange = () => {
  const vietnamToday = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const year = vietnamToday.getUTCFullYear();
  const month = vietnamToday.getUTCMonth();
  return {
    dateFrom: `${year}-${String(month + 1).padStart(2, '0')}-01`,
    days: new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
  };
};

const formatRangeDay = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));

const addDaysToDateKey = (value: string, days: number) =>
  new Date(new Date(`${value}T00:00:00.000Z`).getTime() + days * 86_400_000)
    .toISOString()
    .slice(0, 10);

const formatAdminDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

const STATUS_META = {
  pending: {
    label: 'Chờ xác nhận',
    color: '#D18A17',
    chipColor: 'warning' as const,
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#2D75B6',
    chipColor: 'accent' as const,
  },
  completed: {
    label: 'Hoàn thành',
    color: '#16856F',
    chipColor: 'success' as const,
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#C85A64',
    chipColor: 'danger' as const,
  },
} as const;

const ANALYTICS_PERIOD_OPTIONS: Array<{
  value: TAdminAnalyticsPeriod;
  label: string;
  description: string;
}> = [
  { value: 'today', label: 'Hôm nay', description: 'Từ 00:00 đến hiện tại' },
  { value: 'yesterday', label: 'Hôm qua', description: 'Trọn ngày hôm qua' },
  { value: 'last7Days', label: '7 ngày qua', description: '7 ngày gần nhất' },
  {
    value: 'thisMonth',
    label: 'Tháng này',
    description: 'Từ đầu tháng đến nay',
  },
  { value: 'lastMonth', label: 'Tháng trước', description: 'Trọn tháng trước' },
];

const ANALYTICS_GROUP_OPTIONS: Array<{
  value: TAdminAnalyticsGroup;
  label: string;
}> = [
  { value: 'day', label: 'Theo ngày' },
  { value: 'weekday', label: 'Theo thứ' },
  { value: 'month', label: 'Theo tháng' },
];

const formatAnalyticsRange = (dateFrom?: string, dateTo?: string) => {
  if (!dateFrom || !dateTo) return 'Đang tải khoảng thời gian…';

  const formatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  });
  return `${formatter.format(new Date(dateFrom))} – ${formatter.format(
    new Date(new Date(dateTo).getTime() - 1)
  )}`;
};

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

type TDashboardIcon = 'revenue' | 'booking' | 'night' | 'customer';

function DashboardIcon({ name }: { name: TDashboardIcon }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    'aria-hidden': true,
    className: 'h-5 w-5 fill-none stroke-current stroke-[1.8]',
  };

  if (name === 'revenue') {
    return (
      <svg {...commonProps}>
        <rect x='3.5' y='6' width='17' height='12' rx='3' />
        <path d='M7 10h4M7 14h2M16.5 10.5v3M15 12h3' strokeLinecap='round' />
      </svg>
    );
  }

  if (name === 'booking') {
    return (
      <svg {...commonProps}>
        <rect x='4' y='4.5' width='16' height='16' rx='3' />
        <path
          d='M8 2.8v3.4M16 2.8v3.4M4 9h16M8 13h3M8 16h6'
          strokeLinecap='round'
        />
      </svg>
    );
  }

  if (name === 'night') {
    return (
      <svg {...commonProps}>
        <path
          d='M4 17.5v-7M20 17.5v-4.2a2.8 2.8 0 0 0-2.8-2.8H9.5v7'
          strokeLinecap='round'
        />
        <path d='M4 15h16M4 19.5v-2h16v2M7.2 10.5V8.8c0-.7.6-1.3 1.3-1.3h3c.7 0 1.3.6 1.3 1.3v1.7' />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx='12' cy='8' r='3.2' />
      <path
        d='M5.5 20c.4-4 2.7-6 6.5-6s6.1 2 6.5 6M18.2 7.2a2.5 2.5 0 0 1 0 4.6M20.3 18.5c-.2-2.2-1.2-3.7-3-4.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-[1.8]'>
      <rect x='3.5' y='5' width='17' height='15.5' rx='3' />
      <path d='M8 3v4M16 3v4M3.5 9.5h17' strokeLinecap='round' />
    </svg>
  );
}

function ChartEmptyState({ label }: { label: string }) {
  return (
    <div className='flex h-[270px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D7E3DF] bg-[#F8FBFA] px-6 text-center'>
      <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#76928B] shadow-sm'>
        <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
          className='h-5 w-5 fill-none stroke-current stroke-[1.8]'>
          <path d='M4 19V9M10 19V5M16 19v-7M22 19H2' strokeLinecap='round' />
        </svg>
      </span>
      <p className='mt-3 text-sm font-bold text-[#35534E]'>Chưa có dữ liệu</p>
      <p className='mt-1 max-w-xs text-xs leading-5 text-[#7A8C87]'>{label}</p>
    </div>
  );
}

function ChartSkeleton({ height = 270 }: { height?: number }) {
  return (
    <Skeleton
      animationType='shimmer'
      className='w-full rounded-2xl bg-[#EDF3F1]'
      style={{ height }}
    />
  );
}

function MetricSparkline({
  data,
  dataKey,
  color,
  gradientId,
}: {
  data: TAdminAnalytics['trend'];
  dataKey: 'revenue' | 'bookings' | 'roomNights';
  color: string;
  gradientId: string;
}) {
  if (data.length < 2) return null;

  return (
    <div className='pointer-events-none absolute right-3 bottom-3 h-12 w-24 opacity-75 transition-opacity group-hover:opacity-100'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 3, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity='0.32' />
              <stop offset='100%' stopColor={color} stopOpacity='0' />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function AnalyticsMetricCard({
  label,
  value,
  note,
  growth,
  icon,
  accent,
  surface,
  isLoading,
  trend,
  trendKey,
}: {
  label: string;
  value: string;
  note: string;
  growth?: number | null;
  icon: TDashboardIcon;
  accent: string;
  surface: string;
  isLoading: boolean;
  trend: TAdminAnalytics['trend'];
  trendKey?: 'revenue' | 'bookings' | 'roomNights';
}) {
  return (
    <Card
      variant='default'
      className='group min-h-[156px] overflow-hidden border border-white/80 p-0 shadow-[0_15px_45px_rgba(13,73,73,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(13,73,73,0.13)]'>
      <div
        className='relative flex h-full min-h-[156px] flex-col p-5'
        style={{
          background: `linear-gradient(135deg, ${surface} 0%, #FFFFFF 78%)`,
        }}>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-extrabold tracking-[0.01em] text-[#4B625D]'>
              {label}
            </p>
            {isLoading ? (
              <Skeleton
                animationType='shimmer'
                className='mt-3 h-8 w-32 rounded-lg'
              />
            ) : (
              <p className='mt-2 text-[26px] leading-tight font-black tracking-[-0.03em] text-[#153F3C]'>
                {value}
              </p>
            )}
          </div>
          <span
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm'
            style={{ backgroundColor: `${accent}18`, color: accent }}>
            <DashboardIcon name={icon} />
          </span>
        </div>

        <div className='mt-auto flex min-h-7 items-end pr-24'>
          {isLoading ? (
            <Skeleton
              animationType='shimmer'
              className='h-5 w-36 rounded-full'
            />
          ) : growth !== undefined ? (
            growth == null ? (
              <span className='text-[11px] font-medium text-[#71817D]'>
                Chưa có dữ liệu kỳ trước
              </span>
            ) : (
              <Chip
                size='sm'
                variant='soft'
                color={growth >= 0 ? 'success' : 'danger'}
                className='font-bold'>
                {growth >= 0 ? '↗' : '↘'}{' '}
                {Math.abs(growth).toLocaleString('vi-VN', {
                  maximumFractionDigits: 1,
                })}
                % so với kỳ trước
              </Chip>
            )
          ) : (
            <span className='text-[11px] font-semibold text-[#657873]'>
              {note}
            </span>
          )}
        </div>

        {!isLoading && trendKey && (
          <MetricSparkline
            data={trend}
            dataKey={trendKey}
            color={accent}
            gradientId={`metric-${trendKey}`}
          />
        )}
      </div>
    </Card>
  );
}

function RevenueTrendChart({ data }: { data: TAdminAnalytics['trend'] }) {
  if (data.length === 0 || data.every((item) => item.revenue === 0)) {
    return (
      <ChartEmptyState label='Chưa có doanh thu đã thu trong khoảng thời gian này.' />
    );
  }

  return (
    <div className='w-full'>
      <div
        role='img'
        aria-label='Biểu đồ doanh thu đặt phòng'
        className='h-[270px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 12, right: 4, bottom: 4, left: 2 }}>
            <defs>
              <linearGradient id='revenue-bars' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor='#178579' />
                <stop offset='100%' stopColor='#0D4949' />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke='#DFE9E6'
              strokeDasharray='4 4'
            />
            <XAxis
              dataKey='label'
              axisLine={false}
              tickLine={false}
              interval='preserveStartEnd'
              minTickGap={22}
              tick={{ fill: '#647772', fontSize: 11, fontWeight: 650 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={64}
              tick={{ fill: '#82918D', fontSize: 11 }}
              tickFormatter={formatCompactCurrency}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: '#EAF3F0', opacity: 0.72, radius: 10 }}
              labelStyle={{ color: '#163D3B', fontWeight: 800 }}
              formatter={(value) => [
                formatCurrency(getNumericValue(value)),
                'Doanh thu đã thu',
              ]}
            />
            <Bar
              dataKey='revenue'
              name='Doanh thu đã thu'
              fill='url(#revenue-bars)'
              activeBar={{ fill: '#D18A17' }}
              maxBarSize={34}
              radius={[10, 10, 3, 3]}
              animationDuration={850}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RoomActivityChart({ data }: { data: TAdminAnalytics['trend'] }) {
  if (
    data.length === 0 ||
    data.every((item) => item.roomNights === 0 && item.bookings === 0)
  ) {
    return (
      <ChartEmptyState label='Chưa có booking hoặc đêm phòng trong khoảng thời gian này.' />
    );
  }

  return (
    <div className='w-full'>
      <div
        role='img'
        aria-label='Biểu đồ đêm phòng và số booking'
        className='h-[270px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ top: 6, right: 2, bottom: 4, left: -12 }}>
            <defs>
              <linearGradient id='room-night-area' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0%' stopColor='#16856F' stopOpacity='0.3' />
                <stop offset='100%' stopColor='#16856F' stopOpacity='0.02' />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke='#DFE9E6'
              strokeDasharray='4 4'
            />
            <XAxis
              dataKey='label'
              axisLine={false}
              tickLine={false}
              interval='preserveStartEnd'
              minTickGap={22}
              tick={{ fill: '#647772', fontSize: 11, fontWeight: 650 }}
              tickMargin={10}
            />
            <YAxis
              yAxisId='roomNights'
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={42}
              tick={{ fill: '#82918D', fontSize: 11 }}
            />
            <YAxis
              yAxisId='bookings'
              orientation='right'
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={34}
              tick={{ fill: '#A5762A', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: '#C4D7D1', strokeDasharray: '4 4' }}
              labelStyle={{ color: '#163D3B', fontWeight: 800 }}
              formatter={(value, name) => [
                getNumericValue(value).toLocaleString('vi-VN'),
                String(name ?? ''),
              ]}
            />
            <Legend
              verticalAlign='top'
              align='right'
              height={34}
              iconType='circle'
              iconSize={8}
              wrapperStyle={{ color: '#5F716C', fontSize: 11, fontWeight: 700 }}
            />
            <Area
              yAxisId='roomNights'
              type='monotone'
              dataKey='roomNights'
              name='Đêm phòng'
              stroke='#16856F'
              strokeWidth={3}
              fill='url(#room-night-area)'
              activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2 }}
              animationDuration={850}
            />
            <Line
              yAxisId='bookings'
              type='monotone'
              dataKey='bookings'
              name='Booking'
              stroke='#D18A17'
              strokeWidth={3}
              dot={{ fill: '#D18A17', r: 3, stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2 }}
              animationDuration={850}
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
          data.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div key={item.status} className='space-y-1.5'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='flex items-center gap-2 text-xs font-semibold text-[#556560]'>
                    <span
                      className='h-2.5 w-2.5 rounded-full ring-4 ring-current/10'
                      style={{
                        backgroundColor: STATUS_META[item.status].color,
                      }}
                    />
                    {STATUS_META[item.status].label}
                  </span>
                  <span className='text-xs font-extrabold text-[#263F3C]'>
                    {item.count.toLocaleString('vi-VN')}{' '}
                    <span className='font-medium text-[#8A9692]'>
                      (
                      {percentage.toLocaleString('vi-VN', {
                        maximumFractionDigits: 0,
                      })}
                      %)
                    </span>
                  </span>
                </div>
                <ProgressBar
                  aria-label={`Tỷ lệ ${STATUS_META[item.status].label}`}
                  value={percentage}
                  maxValue={100}
                  size='sm'>
                  <ProgressBar.Track className='h-1.5 bg-[#EDF2F0]'>
                    <ProgressBar.Fill
                      className='rounded-full'
                      style={{
                        backgroundColor: STATUS_META[item.status].color,
                      }}
                    />
                  </ProgressBar.Track>
                </ProgressBar>
              </div>
            );
          })
        ) : (
          <p className='text-center text-xs text-[#7A8682] sm:text-left'>
            Chưa có dữ liệu trạng thái.
          </p>
        )}
      </div>
    </div>
  );
}

const ROOM_CHART_COLORS = [
  '#0D665A',
  '#2D75B6',
  '#F3A137',
  '#8C63D7',
  '#E66779',
  '#3AB3B0',
];

const getRoomChartColor = (roomId: string) => {
  const hash = Array.from(roomId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
  return ROOM_CHART_COLORS[hash % ROOM_CHART_COLORS.length];
};

function RoomTypePerformance({
  data,
}: {
  data: TAdminAnalytics['roomPerformance'];
}) {
  const totalRoomNights = data.reduce(
    (total, room) => total + room.roomNights,
    0
  );
  const leadingRooms = data.slice(0, 5);
  const remainingRooms = data.slice(5);
  const chartRooms =
    remainingRooms.length > 0
      ? [
          ...leadingRooms,
          {
            roomId: 'other',
            title: 'Khác',
            bookings: remainingRooms.reduce(
              (total, room) => total + room.bookings,
              0
            ),
            roomNights: remainingRooms.reduce(
              (total, room) => total + room.roomNights,
              0
            ),
            grossRevenue: remainingRooms.reduce(
              (total, room) => total + room.grossRevenue,
              0
            ),
          },
        ]
      : leadingRooms;
  const chartData = totalRoomNights
    ? chartRooms.map((room) => ({
        ...room,
        color: getRoomChartColor(room.roomId),
      }))
    : [
        {
          roomId: 'empty',
          title: 'Chưa có dữ liệu',
          bookings: 0,
          roomNights: 1,
          grossRevenue: 0,
          color: '#E8EFED',
        },
      ];

  return (
    <div className='grid overflow-hidden rounded-[14px] border border-[#E1E9E6] lg:grid-cols-[1fr_1.18fr]'>
      <div className='border-b border-[#E1E9E6] p-5 lg:border-r lg:border-b-0'>
        <p className='text-xs font-extrabold text-[#263F3C]'>
          Tỷ trọng đêm phòng
        </p>
        <div className='relative mx-auto mt-3 h-[260px] max-w-[360px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart accessibilityLayer>
              <Pie
                data={chartData}
                dataKey='roomNights'
                nameKey='title'
                cx='50%'
                cy='48%'
                innerRadius={60}
                outerRadius={96}
                paddingAngle={totalRoomNights ? 2 : 0}
                cornerRadius={5}
                stroke='#FFFFFF'
                strokeWidth={3}>
                {chartData.map((room) => (
                  <Cell key={room.roomId} fill={room.color} />
                ))}
              </Pie>
              {totalRoomNights > 0 && (
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    `${getNumericValue(value).toLocaleString('vi-VN')} đêm phòng`,
                    String(name ?? ''),
                  ]}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-2'>
            <span className='text-2xl font-black text-[#163D3B]'>
              {totalRoomNights.toLocaleString('vi-VN')}
            </span>
            <span className='text-[11px] font-bold text-[#7A8682]'>
              đêm phòng
            </span>
          </div>
        </div>
        {totalRoomNights > 0 && (
          <div className='flex flex-wrap justify-center gap-x-4 gap-y-2'>
            {chartData.map((room) => (
              <span
                key={room.roomId}
                className='flex items-center gap-1.5 text-[11px] font-semibold text-[#556560]'>
                <span
                  className='h-2.5 w-2.5 rounded-[3px]'
                  style={{ backgroundColor: room.color }}
                />
                {room.title}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className='min-w-0'>
        <div className='border-b border-[#E1E9E6] px-5 py-4'>
          <p className='text-xs font-extrabold text-[#263F3C]'>
            Chi tiết từng loại phòng
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[580px] text-left text-xs'>
            <thead className='bg-[#F6F8F7] text-[#65736F]'>
              <tr>
                <th className='px-4 py-3'>STT</th>
                <th className='px-4 py-3'>Loại phòng</th>
                <th className='px-4 py-3 text-right'>Booking</th>
                <th className='px-4 py-3 text-right'>Đêm phòng</th>
                <th className='px-4 py-3 text-right'>Giá trị đặt phòng</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#E8EEEC]'>
              {data.slice(0, 10).map((room, index) => (
                <tr key={room.roomId}>
                  <td className='px-4 py-3 text-[#7A8682]'>{index + 1}</td>
                  <td className='px-4 py-3 font-bold text-[#263F3C]'>
                    {room.title}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    {room.bookings.toLocaleString('vi-VN')}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    {room.roomNights.toLocaleString('vi-VN')}
                  </td>
                  <td className='px-4 py-3 text-right font-bold'>
                    {formatCurrency(room.grossRevenue)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-14 text-center text-[#7A8682]'>
                    Chưa có dữ liệu đặt phòng trong kỳ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RoomOccupancyChart({
  data,
}: {
  data: TAdminRoomOccupancy['roomPerformance'];
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
      aria-label='Biểu đồ công suất phòng trong khoảng ngày đã chọn'
      className='h-[260px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          accessibilityLayer
          data={data}
          layout='vertical'
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <defs>
            <linearGradient id='occupancy-bar' x1='0' x2='1' y1='0' y2='0'>
              <stop offset='0%' stopColor='#0D4949' />
              <stop offset='100%' stopColor='#34A084' />
            </linearGradient>
          </defs>
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
            fill='url(#occupancy-bar)'
            maxBarSize={28}
            radius={[0, 9, 9, 0]}
            animationDuration={850}>
            {data.map((room) => (
              <Cell
                key={room.roomId}
                fill={
                  room.occupancyRate >= 85 ? '#D18A17' : 'url(#occupancy-bar)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminOverview() {
  const locale = useLocale();
  const summaryQuery = useAdminSummaryApi();
  const [analyticsPeriod, setAnalyticsPeriod] =
    useState<TAdminAnalyticsPeriod>('last7Days');
  const [analyticsGroup, setAnalyticsGroup] =
    useState<TAdminAnalyticsGroup>('day');
  const analyticsQuery = useAdminAnalyticsApi({
    period: analyticsPeriod,
    groupBy: analyticsGroup,
  });
  const [initialRange] = useState(getCurrentMonthRange);
  const [occupancyRange, setOccupancyRange] = useState(initialRange);
  const [draftStart, setDraftStart] = useState(initialRange.dateFrom);
  const [draftDays, setDraftDays] = useState(String(initialRange.days));
  const [rangeError, setRangeError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<TAdminBooking | null>(
    null
  );
  const updateBooking = useUpdateAdminBookingApi();
  const occupancyQuery = useAdminRoomOccupancyApi(occupancyRange);
  const summary = summaryQuery.data;
  const analytics = analyticsQuery.data;
  const occupancy = occupancyQuery.data;
  const bookings = summary?.recentBookings ?? [];
  const handleUpdateBooking = (data: TUpdateAdminBookingPayload) => {
    if (!selectedBooking) return;
    updateBooking.mutate(
      { bookingId: selectedBooking._id, data },
      { onSuccess: () => setSelectedBooking(null) }
    );
  };
  const bookingStatus = summary?.bookingStatus ?? [];
  const roomPerformance = (occupancy?.roomPerformance ?? []).map((room) => ({
    ...room,
    title: localizeTranslatedText(room, 'title', room.title, locale),
  }));
  const analyticsTrend = analytics?.trend ?? [];
  const analyticsRoomPerformance = (analytics?.roomPerformance ?? []).map(
    (room) => ({
      ...room,
      title: localizeTranslatedText(room, 'title', room.title, locale),
    })
  );
  const applyOccupancyRange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const days = Number(draftDays);
    if (!draftStart || !Number.isInteger(days) || days < 1 || days > 366) {
      setRangeError('Chọn ngày bắt đầu và số ngày từ 1 đến 366.');
      return;
    }
    setRangeError('');
    setOccupancyRange({ dateFrom: draftStart, days });
  };
  const analyticsStats = [
    {
      label: 'Doanh thu đã thu',
      value: formatCurrency(analytics?.metrics.revenue ?? 0),
      note: 'Tiền thực tế đã thu',
      growth: analytics?.metrics.revenueGrowthPercent,
      icon: 'revenue' as const,
      accent: '#0D665A',
      surface: '#E8F4F0',
      trendKey: 'revenue' as const,
    },
    {
      label: 'Booking trong kỳ',
      value: (analytics?.metrics.bookings ?? 0).toLocaleString('vi-VN'),
      note: 'Booking hợp lệ',
      growth: analytics?.metrics.bookingGrowthPercent,
      icon: 'booking' as const,
      accent: '#2D75B6',
      surface: '#EAF2FB',
      trendKey: 'bookings' as const,
    },
    {
      label: 'Đêm phòng đã đặt',
      value: (analytics?.metrics.roomNights ?? 0).toLocaleString('vi-VN'),
      note: `${analytics?.metrics.bookedRooms ?? 0} lượt phòng trong booking`,
      icon: 'night' as const,
      accent: '#D18A17',
      surface: '#FFF5DF',
      trendKey: 'roomNights' as const,
    },
    {
      label: 'Khách đặt phòng',
      value: (analytics?.metrics.customers ?? 0).toLocaleString('vi-VN'),
      note: `${formatCurrency(analytics?.metrics.averageBookingValue ?? 0)} / booking`,
      icon: 'customer' as const,
      accent: '#8C63D7',
      surface: '#F3EEFC',
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
      <section className='space-y-4'>
        <div className='relative overflow-visible rounded-[22px] border border-[#D8E5E1] bg-[linear-gradient(120deg,#F3F8F6_0%,#FFFFFF_56%,#FFF8E9_100%)] px-5 py-5 shadow-[0_16px_45px_rgba(13,73,73,0.07)] sm:px-6'>
          <div className='pointer-events-none absolute top-0 right-0 h-28 w-52 overflow-hidden rounded-tr-[22px] opacity-60'>
            <span className='absolute -top-16 right-3 h-36 w-36 rounded-full border border-[#BFD8D0] bg-white/30' />
            <span className='absolute top-9 right-28 h-20 w-20 rounded-full border border-[#E9C982] bg-white/35' />
          </div>
          <div className='relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center'>
            <div>
              <Chip
                size='sm'
                variant='soft'
                color='success'
                className='mb-2 font-bold tracking-[0.08em] uppercase'>
                Tổng quan kinh doanh
              </Chip>
              <h1 className='font-lora text-2xl font-semibold tracking-[-0.02em] text-[#163D3B]'>
                Bức tranh kinh doanh
              </h1>
              <p className='mt-1.5 max-w-2xl text-xs leading-5 text-[#657873]'>
                Theo dõi doanh thu thực thu, booking và hiệu quả phòng trong
                cùng một màn hình.
              </p>
            </div>
            <AdminSelect
              value={analyticsPeriod}
              options={ANALYTICS_PERIOD_OPTIONS}
              onChange={setAnalyticsPeriod}
              ariaLabel='Chọn khoảng thống kê'
              leadingIcon={<CalendarIcon />}
              className='w-full shrink-0 sm:w-[220px]'
            />
          </div>
        </div>

        {analyticsQuery.isError && (
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F1CDCD] bg-[#FFF5F5] p-4 text-xs text-[#943B3B]'>
            <span>Không thể tải bức tranh kinh doanh. Vui lòng thử lại.</span>
            <Button
              size='sm'
              variant='tertiary'
              onPress={() => void analyticsQuery.refetch()}
              className='font-bold text-[#943B3B]'>
              Tải lại
            </Button>
          </div>
        )}

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {analyticsStats.map((stat) => (
            <AnalyticsMetricCard
              key={stat.label}
              {...stat}
              isLoading={analyticsQuery.isLoading}
              trend={analyticsTrend}
            />
          ))}
        </div>

        <Card
          variant='default'
          className='overflow-hidden border border-[#DDE7E4] bg-white p-0 shadow-[0_16px_48px_rgba(13,73,73,0.08)]'>
          <div className='flex flex-col justify-between gap-4 border-b border-[#E5ECEA] px-5 py-4 sm:flex-row sm:items-end sm:px-6'>
            <div>
              <p className='text-sm font-extrabold text-[#263F3C]'>
                Diễn biến đặt phòng
              </p>
              <div className='mt-1 flex items-center gap-2 text-xs text-[#7A8682]'>
                <span>
                  {formatAnalyticsRange(
                    analytics?.trendDateFrom,
                    analytics?.trendDateTo
                  )}
                </span>
                {analyticsQuery.isFetching && !analyticsQuery.isLoading && (
                  <span className='inline-flex items-center gap-1.5 font-semibold text-[#0D665A]'>
                    <Spinner size='sm' color='success' />
                    Đang cập nhật
                  </span>
                )}
              </div>
            </div>
            <Tabs
              selectedKey={analyticsGroup}
              onSelectionChange={(key) =>
                setAnalyticsGroup(String(key) as TAdminAnalyticsGroup)
              }
              aria-label='Nhóm số liệu thống kê'
              className='w-full sm:w-auto'>
              <Tabs.ListContainer>
                <Tabs.List className='w-full bg-[#F0F4F2] sm:w-auto'>
                  {ANALYTICS_GROUP_OPTIONS.map((option) => (
                    <Tabs.Tab
                      key={option.value}
                      id={option.value}
                      className='h-9 min-w-[92px] text-xs font-bold data-[selected=true]:text-[#0D665A]'>
                      {option.label}
                      <Tabs.Indicator className='bg-white shadow-[0_5px_14px_rgba(13,73,73,0.12)]' />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          <div className='grid xl:grid-cols-2'>
            <div className='border-b border-[#E5ECEA] p-5 sm:p-6 xl:border-r xl:border-b-0'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h2 className='text-sm font-extrabold text-[#263F3C]'>
                    Doanh thu
                  </h2>
                  <p className='mt-1 text-xs text-[#7A8682]'>
                    Số tiền thực tế đã thu
                  </p>
                </div>
                <span className='text-lg font-black text-[#163D3B]'>
                  {analyticsQuery.isLoading
                    ? '—'
                    : formatCurrency(analytics?.metrics.revenue ?? 0)}
                </span>
              </div>
              <div className='mt-4'>
                {analyticsQuery.isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <RevenueTrendChart data={analyticsTrend} />
                )}
              </div>
            </div>

            <div className='p-5 sm:p-6'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h2 className='text-sm font-extrabold text-[#263F3C]'>
                    Đêm phòng
                  </h2>
                  <p className='mt-1 text-xs text-[#7A8682]'>
                    Kèm số booking trong cùng kỳ
                  </p>
                </div>
                <span className='text-lg font-black text-[#163D3B]'>
                  {analyticsQuery.isLoading
                    ? '—'
                    : `${(analytics?.metrics.roomNights ?? 0).toLocaleString('vi-VN')} đêm`}
                </span>
              </div>
              <div className='mt-4'>
                {analyticsQuery.isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <RoomActivityChart data={analyticsTrend} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Card
        variant='default'
        className='border border-[#DDE7E4] bg-white p-5 shadow-[0_16px_48px_rgba(13,73,73,0.08)] sm:p-6'>
        <div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-end'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
              Phòng trống và đã sử dụng theo ngày
            </h2>
            <p className='mt-1 max-w-3xl text-xs leading-5 text-[#7A8682]'>
              Tính theo phòng đang mở bán. Booking chờ xác nhận hoặc đã xác nhận
              được tính là phòng đang giữ; ngày trả phòng không tính là đêm lưu
              trú.
            </p>
          </div>
          <form
            onSubmit={applyOccupancyRange}
            className='flex flex-wrap items-end gap-2'>
            <label className='text-[11px] font-bold text-[#556560]'>
              Từ ngày
              <input
                type='date'
                required
                value={draftStart}
                onChange={(event) => setDraftStart(event.target.value)}
                className='mt-1 block h-10 rounded-xl border border-[#D5E2DE] bg-white px-3 text-xs text-[#173F3D] shadow-sm transition outline-none focus:border-[#0D665A] focus:ring-4 focus:ring-[#0D665A]/10'
              />
            </label>
            <label className='text-[11px] font-bold text-[#556560]'>
              Số ngày
              <input
                type='number'
                min={1}
                max={366}
                required
                value={draftDays}
                onChange={(event) => setDraftDays(event.target.value)}
                className='mt-1 block h-10 w-24 rounded-xl border border-[#D5E2DE] bg-white px-3 text-xs text-[#173F3D] shadow-sm transition outline-none focus:border-[#0D665A] focus:ring-4 focus:ring-[#0D665A]/10'
              />
            </label>
            <Button
              type='submit'
              size='sm'
              className='h-10 rounded-xl bg-[#0D4949] px-5 text-xs font-bold text-white'>
              Xem thống kê
            </Button>
          </form>
        </div>
        {rangeError && (
          <p className='mt-2 text-xs text-red-700'>{rangeError}</p>
        )}
        <Chip
          size='sm'
          variant='soft'
          color='success'
          className='mt-4 w-fit font-bold'>
          {formatRangeDay(occupancyRange.dateFrom)} –{' '}
          {formatRangeDay(
            addDaysToDateKey(occupancyRange.dateFrom, occupancyRange.days - 1)
          )}
          {' · '}
          {occupancyRange.days} ngày
        </Chip>

        {occupancyQuery.isLoading ? (
          <div className='mt-4'>
            <ChartSkeleton height={190} />
          </div>
        ) : occupancyQuery.isError ? (
          <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F1CDCD] bg-[#FFF5F5] p-4 text-xs text-[#943B3B]'>
            <span>Không thể tải thống kê phòng. Vui lòng thử lại.</span>
            <Button
              size='sm'
              variant='tertiary'
              onPress={() => void occupancyQuery.refetch()}
              className='font-bold text-[#943B3B]'>
              Tải lại
            </Button>
          </div>
        ) : occupancy ? (
          <>
            <div className='mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
              {[
                {
                  label: 'Tổng phòng mở bán',
                  value: occupancy.totalRooms.toLocaleString('vi-VN'),
                  note: 'Số phòng mỗi ngày',
                },
                {
                  label: 'Đã đặt / sử dụng',
                  value: occupancy.occupiedRoomNights.toLocaleString('vi-VN'),
                  note: 'Đêm phòng trong kỳ',
                },
                {
                  label: 'Còn trống',
                  value: occupancy.freeRoomNights.toLocaleString('vi-VN'),
                  note: 'Đêm phòng trong kỳ',
                },
                {
                  label: 'Công suất phòng',
                  value: `${occupancy.occupancyRate.toLocaleString('vi-VN')}%`,
                  note: 'Tỷ lệ đêm phòng đã sử dụng',
                  progress: occupancy.occupancyRate,
                },
              ].map((item) => (
                <Card
                  variant='secondary'
                  key={item.label}
                  className='gap-1 rounded-2xl border border-[#E2EBE7] bg-[#F8FAF9] p-4 shadow-none'>
                  <p className='text-xs font-bold text-[#697974]'>
                    {item.label}
                  </p>
                  <p className='mt-1 text-2xl font-black text-[#163D3B]'>
                    {item.value}
                  </p>
                  <p className='text-[11px] text-[#7A8682]'>{item.note}</p>
                  {item.progress !== undefined && (
                    <ProgressBar
                      aria-label='Công suất phòng'
                      value={item.progress}
                      maxValue={100}
                      size='sm'
                      className='mt-2'>
                      <ProgressBar.Track className='bg-[#DFEAE7]'>
                        <ProgressBar.Fill className='bg-[#0D665A]' />
                      </ProgressBar.Track>
                    </ProgressBar>
                  )}
                </Card>
              ))}
            </div>
            <div className='mt-5 grid gap-5 xl:grid-cols-2'>
              <div>
                <h3 className='text-xs font-extrabold text-[#173F3D]'>
                  Theo từng ngày
                </h3>
                <div className='mt-2 max-h-[320px] overflow-auto rounded-[12px] border border-[#E2EBE7]'>
                  <table className='w-full text-left text-xs'>
                    <thead className='sticky top-0 bg-[#F4F8F6] text-[#556560]'>
                      <tr>
                        <th className='px-3 py-2'>Ngày</th>
                        <th className='px-3 py-2 text-right'>Đã đặt</th>
                        <th className='px-3 py-2 text-right'>Còn trống</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#EBF0ED]'>
                      {occupancy.dailyOccupancy.map((day) => (
                        <tr key={day.date}>
                          <td className='px-3 py-2'>
                            {formatRangeDay(day.date)}
                          </td>
                          <td className='px-3 py-2 text-right font-bold'>
                            {day.usedRooms}
                          </td>
                          <td className='px-3 py-2 text-right font-bold text-[#0D665A]'>
                            {day.freeRooms}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className='text-xs font-extrabold text-[#173F3D]'>
                  Theo loại phòng
                </h3>
                <div className='mt-2 max-h-[320px] overflow-auto rounded-[12px] border border-[#E2EBE7]'>
                  <table className='w-full text-left text-xs'>
                    <thead className='sticky top-0 bg-[#F4F8F6] text-[#556560]'>
                      <tr>
                        <th className='px-3 py-2'>Loại phòng</th>
                        <th className='px-3 py-2 text-right'>Đã đặt</th>
                        <th className='px-3 py-2 text-right'>Còn trống</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#EBF0ED]'>
                      {roomPerformance.map((room) => (
                        <tr key={room.roomId}>
                          <td className='px-3 py-2'>
                            <span className='font-bold'>{room.title}</span>
                            <span className='block text-[10px] text-[#7A8682]'>
                              {room.quantity} phòng mở bán
                            </span>
                          </td>
                          <td className='px-3 py-2 text-right font-bold'>
                            {room.bookedRoomNights}
                          </td>
                          <td className='px-3 py-2 text-right font-bold text-[#0D665A]'>
                            {room.freeRoomNights}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className='mt-2 text-[11px] leading-5 text-[#7A8682]'>
                  Đơn vị: đêm phòng. Phòng bảo trì hoặc ngừng bán không nằm
                  trong số phòng trống.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Card>

      <div className='grid gap-6 2xl:grid-cols-[1.65fr_0.85fr]'>
        <Card
          variant='default'
          className='border border-[#DDE7E4] bg-white p-5 shadow-[0_16px_48px_rgba(13,73,73,0.08)] sm:p-6'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
              Hiệu quả loại phòng
            </h2>
            <p className='mt-1 text-xs text-[#7A8682]'>
              Phân tích theo các booking trong khoảng thời gian đã chọn
            </p>
          </div>
          <div className='mt-5 grid gap-3 sm:grid-cols-3'>
            {[
              {
                label: 'Giá trị trung bình / booking',
                value: formatCurrency(
                  analytics?.metrics.averageBookingValue ?? 0
                ),
              },
              {
                label: 'Số đêm trung bình / booking',
                value: `${analytics?.metrics.averageNights ?? 0} đêm`,
              },
              {
                label: 'Số phòng trung bình / booking',
                value: `${analytics?.metrics.averageRooms ?? 0} phòng`,
              },
            ].map((item) => (
              <Card
                key={item.label}
                variant='secondary'
                className='gap-1 rounded-2xl bg-[#F6F9F8] p-4 shadow-none'>
                <p className='text-xs font-bold text-[#697974]'>{item.label}</p>
                <div className='mt-1 text-base font-black text-[#163D3B]'>
                  {analyticsQuery.isLoading ? (
                    <Skeleton
                      animationType='shimmer'
                      className='h-6 w-24 rounded-lg'
                    />
                  ) : (
                    item.value
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className='mt-4'>
            {analyticsQuery.isLoading ? (
              <ChartSkeleton height={380} />
            ) : (
              <RoomTypePerformance data={analyticsRoomPerformance} />
            )}
          </div>
        </Card>

        <Card
          variant='default'
          className='border border-[#DDE7E4] bg-white p-5 shadow-[0_16px_48px_rgba(13,73,73,0.08)] sm:p-6'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
                Trạng thái booking
              </h2>
              <p className='mt-1 text-xs text-[#7A8682]'>
                Tỷ lệ trạng thái trên toàn hệ thống
              </p>
            </div>
            <Chip
              size='sm'
              variant='soft'
              color='default'
              className='shrink-0 font-bold'>
              Toàn thời gian
            </Chip>
          </div>
          <div className='mt-7'>
            {summaryQuery.isLoading ? (
              <ChartSkeleton height={210} />
            ) : (
              <BookingStatusChart data={bookingStatus} />
            )}
          </div>
        </Card>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.35fr_1fr]'>
        <Card
          variant='default'
          className='border border-[#DDE7E4] bg-white p-5 shadow-[0_16px_48px_rgba(13,73,73,0.08)] sm:p-6'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
              Công suất theo loại phòng
            </h2>
            <p className='mt-1 text-xs text-[#7A8682]'>
              Top 5 loại phòng trong khoảng ngày đã chọn
            </p>
          </div>
          <div className='mt-5'>
            {occupancyQuery.isLoading ? (
              <ChartSkeleton height={260} />
            ) : occupancyQuery.isError ? (
              <p className='py-12 text-center text-xs text-[#9A3838]'>
                Không thể tải công suất phòng.
              </p>
            ) : (
              <RoomOccupancyChart data={roomPerformance.slice(0, 5)} />
            )}
          </div>
        </Card>

        <Card
          variant='default'
          className='border border-[#DDE7E4] bg-white p-5 shadow-[0_16px_48px_rgba(13,73,73,0.08)] sm:p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
                Cần xử lý hôm nay
              </h2>
              <p className='mt-1 text-xs text-[#7A8682]'>
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
              <Card
                variant='secondary'
                key={item.label}
                className='gap-1 rounded-2xl border border-[#E4ECE9] bg-[#FAFCFB] p-4 shadow-none'>
                <Chip
                  size='sm'
                  variant='soft'
                  className={`w-fit font-extrabold ${item.color}`}>
                  {item.label}
                </Chip>
                <div className='mt-3 text-2xl font-black text-[#163D3B]'>
                  {summaryQuery.isLoading ? (
                    <Skeleton
                      animationType='shimmer'
                      className='h-8 w-16 rounded-lg'
                    />
                  ) : (
                    item.value.toLocaleString('vi-VN')
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className='mt-4 rounded-xl bg-[#F5F8F7] px-4 py-3 text-[11px] text-[#65736F]'>
            {summaryQuery.isLoading
              ? 'Đang kiểm tra tình trạng phòng…'
              : `${summary?.maintenanceRooms ?? 0} phòng đang bảo trì.`}
          </p>
        </Card>
      </div>

      <Card
        variant='default'
        className='gap-0 overflow-hidden border border-[#DDE7E4] bg-white p-0 shadow-[0_16px_48px_rgba(13,73,73,0.08)]'>
        <div className='flex items-center justify-between border-b border-[#E5ECEA] px-5 py-4 sm:px-6'>
          <div>
            <h2 className='font-lora text-lg font-semibold text-[#163D3B]'>
              Booking gần đây
            </h2>
            <p className='mt-1 text-xs text-[#7A8682]'>
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
                <tr
                  key={booking._id}
                  onClick={() => setSelectedBooking(booking)}
                  className='cursor-pointer hover:bg-[#FAFCFB]'>
                  <td className='px-6 py-4 font-extrabold text-[#0D4949]'>
                    <button
                      type='button'
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                      className='hover:underline'>
                      {booking.bookingCode}
                    </button>
                  </td>
                  <td className='px-4 py-4'>
                    {booking.userId?.full_name ??
                      booking.customerInfo.fullNameContact}
                  </td>
                  <td className='px-4 py-4 text-[#71807B]'>
                    {formatAdminDate(booking.createdAt)}
                  </td>
                  <td className='px-4 py-4'>
                    <Chip
                      size='sm'
                      variant='soft'
                      color={STATUS_META[booking.bookingStatus].chipColor}
                      className='font-bold'>
                      {STATUS_META[booking.bookingStatus].label}
                    </Chip>
                  </td>
                  <td className='px-6 py-4 text-right font-bold'>
                    {formatCurrency(booking.totalAmount)}
                  </td>
                </tr>
              ))}
              {summaryQuery.isLoading &&
                Array.from({ length: 3 }, (_, index) => (
                  <tr key={`booking-skeleton-${index}`}>
                    {Array.from({ length: 5 }, (__, cellIndex) => (
                      <td
                        key={cellIndex}
                        className='px-4 py-4 first:pl-6 last:pr-6'>
                        <Skeleton
                          animationType='shimmer'
                          className={`h-5 rounded-lg ${cellIndex === 4 ? 'ml-auto w-24' : 'w-28'}`}
                        />
                      </td>
                    ))}
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
      </Card>
      {selectedBooking && (
        <BookingDetailDialog
          key={selectedBooking._id}
          booking={selectedBooking}
          isPending={
            updateBooking.isPending &&
            updateBooking.variables?.bookingId === selectedBooking._id
          }
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
}
