import axios from 'axios';

export const getTrustedVnpayUrl = (payUrl: string) => {
  const url = new URL(payUrl);
  const hostname = url.hostname.toLowerCase();
  const isVnpayHost =
    hostname === 'vnpayment.vn' || hostname.endsWith('.vnpayment.vn');

  if (url.protocol !== 'https:' || !isVnpayHost) {
    throw new Error('The payment gateway returned an invalid redirect URL.');
  }

  return url.toString();
};

export const getPaymentErrorMessage = (
  error: unknown,
  fallback = 'Unable to start the payment. Please try again.'
) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};
