'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { createVnpayPaymentApi, getVnpayPaymentStatusApi } from '../apis';
import { usePaymentStore } from '../stores';
import { getTrustedVnpayUrl } from '../utils';

const useCreateVnpayPaymentApi = () =>
  useMutation({ mutationFn: createVnpayPaymentApi });

export const useVnpayPaymentStatusApi = (
  bookingId: string | null,
  enabled: boolean
) =>
  useQuery({
    queryKey: ['vnpay-payment-status', bookingId],
    queryFn: () => getVnpayPaymentStatusApi(bookingId!),
    enabled: Boolean(bookingId) && enabled,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === 'pending' ? 10000 : false,
  });

export const useStartVnpayPayment = () => {
  const paymentMutation = useCreateVnpayPaymentApi();
  const setHandoff = usePaymentStore((state) => state.setHandoff);

  const startPayment = async (bookingId: string) => {
    const payment = await paymentMutation.mutateAsync({ bookingId });
    const trustedPayUrl = getTrustedVnpayUrl(payment.payUrl);

    setHandoff({
      provider: 'vnpay',
      bookingId: payment.bookingId,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      createdAt: new Date().toISOString(),
    });

    window.location.assign(trustedPayUrl);
  };

  return {
    startPayment,
    isPending: paymentMutation.isPending,
    reset: paymentMutation.reset,
  };
};
