const DAY_MS = 24 * 60 * 60 * 1000;
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

export const DASHBOARD_PERIODS = [
  "today",
  "yesterday",
  "last7Days",
  "thisMonth",
  "lastMonth",
];

export const DASHBOARD_GROUPS = ["day", "weekday", "month"];

const toVietnamBoundary = (year, month, day) =>
  new Date(Date.UTC(year, month, day) - VIETNAM_OFFSET_MS);

const getVietnamParts = (date) => {
  const vietnamDate = new Date(date.getTime() + VIETNAM_OFFSET_MS);
  return {
    year: vietnamDate.getUTCFullYear(),
    month: vietnamDate.getUTCMonth(),
    day: vietnamDate.getUTCDate(),
    weekday: vietnamDate.getUTCDay(),
  };
};

const getPeriodRange = (period, now) => {
  const current = getVietnamParts(now);
  const todayStart = toVietnamBoundary(
    current.year,
    current.month,
    current.day,
  );
  const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);

  if (period === "today") {
    return {
      start: todayStart,
      end: tomorrowStart,
      previousStart: new Date(todayStart.getTime() - DAY_MS),
      previousEnd: todayStart,
    };
  }

  if (period === "yesterday") {
    const yesterdayStart = new Date(todayStart.getTime() - DAY_MS);
    return {
      start: yesterdayStart,
      end: todayStart,
      previousStart: new Date(yesterdayStart.getTime() - DAY_MS),
      previousEnd: yesterdayStart,
    };
  }

  if (period === "last7Days") {
    const start = new Date(todayStart.getTime() - 6 * DAY_MS);
    return {
      start,
      end: tomorrowStart,
      previousStart: new Date(start.getTime() - 7 * DAY_MS),
      previousEnd: start,
    };
  }

  const thisMonthStart = toVietnamBoundary(current.year, current.month, 1);
  const nextMonthStart = toVietnamBoundary(current.year, current.month + 1, 1);
  const lastMonthStart = toVietnamBoundary(current.year, current.month - 1, 1);

  if (period === "thisMonth") {
    return {
      start: thisMonthStart,
      end: nextMonthStart,
      previousStart: lastMonthStart,
      previousEnd: thisMonthStart,
    };
  }

  return {
    start: lastMonthStart,
    end: thisMonthStart,
    previousStart: toVietnamBoundary(current.year, current.month - 2, 1),
    previousEnd: lastMonthStart,
  };
};

const getTrendRange = (range, groupBy) => {
  if (groupBy !== "month") {
    return { start: range.start, end: range.end };
  }

  const lastIncludedDay = new Date(range.end.getTime() - 1);
  const lastMonth = getVietnamParts(lastIncludedDay);
  return {
    start: toVietnamBoundary(lastMonth.year, lastMonth.month - 5, 1),
    end: toVietnamBoundary(lastMonth.year, lastMonth.month + 1, 1),
  };
};

export const parseDashboardAnalyticsParams = (
  period = "last7Days",
  groupBy = "day",
  now = new Date(),
) => {
  if (!DASHBOARD_PERIODS.includes(period)) {
    throw new RangeError("Invalid dashboard period");
  }
  if (!DASHBOARD_GROUPS.includes(groupBy)) {
    throw new RangeError("Invalid dashboard group");
  }

  const range = getPeriodRange(period, now);
  const trendRange = getTrendRange(range, groupBy);
  return {
    period,
    groupBy,
    ...range,
    trendStart: trendRange.start,
    trendEnd: trendRange.end,
    dataStart: new Date(
      Math.min(range.previousStart.getTime(), trendRange.start.getTime()),
    ),
    dataEnd: new Date(Math.max(range.end.getTime(), trendRange.end.getTime())),
  };
};

const isInRange = (value, start, end) => {
  const time = new Date(value).getTime();
  return time >= start.getTime() && time < end.getTime();
};

const getCollectedAmount = (booking) => {
  if (booking.paymentStatus === "refunded") return 0;
  if (Number.isFinite(booking.paidAmount)) return booking.paidAmount;
  if (booking.paymentStatus === "paid") return booking.totalAmount ?? 0;
  if (booking.paymentStatus === "deposit_paid") {
    return booking.depositAmount ?? 0;
  }
  return 0;
};

const getBookedRoomCount = (booking) =>
  (booking.bookingItems ?? []).reduce(
    (total, item) => total + Number(item.quantity ?? 0),
    0,
  );

const getRoomNights = (booking) =>
  getBookedRoomCount(booking) * Number(booking.totalNights ?? 0);

const getCustomerKey = (booking) =>
  booking.userId?._id?.toString?.() ??
  booking.userId?.toString?.() ??
  booking.customerInfo?.emailContact?.toLowerCase() ??
  booking._id?.toString?.();

const calculateMetrics = (bookings) => {
  const activeBookings = bookings.filter(
    (booking) => booking.bookingStatus !== "cancelled",
  );
  const revenue = activeBookings.reduce(
    (total, booking) => total + getCollectedAmount(booking),
    0,
  );
  const roomNights = activeBookings.reduce(
    (total, booking) => total + getRoomNights(booking),
    0,
  );
  const bookedRooms = activeBookings.reduce(
    (total, booking) => total + getBookedRoomCount(booking),
    0,
  );
  const customers = new Set(activeBookings.map(getCustomerKey).filter(Boolean))
    .size;

  return {
    revenue,
    bookings: activeBookings.length,
    roomNights,
    bookedRooms,
    customers,
    averageBookingValue:
      activeBookings.length > 0
        ? Math.round(revenue / activeBookings.length)
        : 0,
    averageNights:
      activeBookings.length > 0
        ? Math.round(
            (activeBookings.reduce(
              (total, booking) => total + Number(booking.totalNights ?? 0),
              0,
            ) /
              activeBookings.length) *
              10,
          ) / 10
        : 0,
    averageRooms:
      activeBookings.length > 0
        ? Math.round((bookedRooms / activeBookings.length) * 10) / 10
        : 0,
  };
};

const getGrowth = (current, previous) =>
  previous > 0
    ? Math.round(((current - previous) / previous) * 1000) / 10
    : null;

const formatDayKey = (date) => {
  const { year, month, day } = getVietnamParts(date);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
};

const formatMonthKey = (date) => {
  const { year, month } = getVietnamParts(date);
  return `${year}-${String(month + 1).padStart(2, "0")}`;
};

const WEEKDAY_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

const createBuckets = (params) => {
  if (params.groupBy === "weekday") {
    return [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({
      key: String(weekday),
      label: WEEKDAY_LABELS[weekday],
      revenue: 0,
      bookings: 0,
      roomNights: 0,
    }));
  }

  if (params.groupBy === "month") {
    const startParts = getVietnamParts(params.trendStart);
    return Array.from({ length: 6 }, (_, index) => {
      const date = toVietnamBoundary(
        startParts.year,
        startParts.month + index,
        1,
      );
      return {
        key: formatMonthKey(date),
        label: new Intl.DateTimeFormat("vi-VN", {
          month: "short",
          year: "2-digit",
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(date),
        revenue: 0,
        bookings: 0,
        roomNights: 0,
      };
    });
  }

  const dayCount = Math.max(
    1,
    Math.round(
      (params.trendEnd.getTime() - params.trendStart.getTime()) / DAY_MS,
    ),
  );
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(params.trendStart.getTime() + index * DAY_MS);
    return {
      key: formatDayKey(date),
      label: new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date),
      revenue: 0,
      bookings: 0,
      roomNights: 0,
    };
  });
};

const createTrend = (bookings, params) => {
  const buckets = createBuckets(params);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  bookings
    .filter(
      (booking) =>
        booking.bookingStatus !== "cancelled" &&
        isInRange(booking.createdAt, params.trendStart, params.trendEnd),
    )
    .forEach((booking) => {
      const bookingDate = new Date(booking.createdAt);
      const parts = getVietnamParts(bookingDate);
      const key =
        params.groupBy === "weekday"
          ? String(parts.weekday)
          : params.groupBy === "month"
            ? formatMonthKey(bookingDate)
            : formatDayKey(bookingDate);
      const bucket = bucketMap.get(key);
      if (!bucket) return;
      bucket.revenue += getCollectedAmount(booking);
      bucket.bookings += 1;
      bucket.roomNights += getRoomNights(booking);
    });

  return buckets;
};

const createRoomPerformance = (bookings) => {
  const rooms = new Map();

  bookings
    .filter((booking) => booking.bookingStatus !== "cancelled")
    .forEach((booking) => {
      (booking.bookingItems ?? []).forEach((item) => {
        const room = item.roomId;
        const roomId = (room?._id ?? room)?.toString?.() ?? "unknown";
        const title = room?.title ?? "Phòng không còn tồn tại";
        const quantity = Number(item.quantity ?? 0);
        const roomNights = quantity * Number(booking.totalNights ?? 0);
        const grossRevenue = Number(item.pricePerNight ?? 0) * roomNights;
        const current = rooms.get(roomId) ?? {
          roomId,
          title,
          bookingIds: new Set(),
          roomNights: 0,
          grossRevenue: 0,
        };
        current.bookingIds.add(
          booking._id?.toString?.() ?? booking.bookingCode,
        );
        current.roomNights += roomNights;
        current.grossRevenue += grossRevenue;
        rooms.set(roomId, current);
      });
    });

  return Array.from(rooms.values())
    .map(({ bookingIds, ...room }) => ({
      ...room,
      bookings: bookingIds.size,
    }))
    .sort(
      (first, second) =>
        second.roomNights - first.roomNights ||
        second.grossRevenue - first.grossRevenue,
    );
};

export const summarizeBookingAnalytics = (bookings, params) => {
  const currentBookings = bookings.filter((booking) =>
    isInRange(booking.createdAt, params.start, params.end),
  );
  const previousBookings = bookings.filter((booking) =>
    isInRange(booking.createdAt, params.previousStart, params.previousEnd),
  );
  const metrics = calculateMetrics(currentBookings);
  const previousMetrics = calculateMetrics(previousBookings);

  return {
    period: params.period,
    groupBy: params.groupBy,
    dateFrom: params.start.toISOString(),
    dateTo: params.end.toISOString(),
    trendDateFrom: params.trendStart.toISOString(),
    trendDateTo: params.trendEnd.toISOString(),
    trendDateFrom: params.trendStart.toISOString(),
    trendDateTo: params.trendEnd.toISOString(),
    metrics: {
      ...metrics,
      revenueGrowthPercent: getGrowth(metrics.revenue, previousMetrics.revenue),
      bookingGrowthPercent: getGrowth(
        metrics.bookings,
        previousMetrics.bookings,
      ),
    },
    trend: createTrend(bookings, params),
    roomPerformance: createRoomPerformance(currentBookings),
  };
};
