import Image from 'next/image';

import { TCheckoutPaymentMethod } from '../types';

type TPaymentMethodSelectorProps = {
  value: TCheckoutPaymentMethod;
  onChange: (value: TCheckoutPaymentMethod) => void;
  error?: string;
  isDisabled?: boolean;
};

export function PaymentMethodSelector({
  value,
  onChange,
  error,
  isDisabled = false,
}: TPaymentMethodSelectorProps) {
  return (
    <fieldset>
      <legend className='text-sm font-bold text-[#0D4949]'>
        Payment method
      </legend>
      <p className='mt-1 text-xs leading-5 text-[#68726E]'>
        Fast and secure online payment through Vietnam&apos;s trusted payment
        gateway.
      </p>

      <label
        className={`relative mt-3 block overflow-hidden rounded-[20px] border border-[#D8E7EA] bg-[linear-gradient(135deg,#F4FBFD_0%,#FFFFFF_50%,#FFF7F3_100%)] p-4 shadow-[0_16px_38px_rgba(18,78,76,0.08)] transition-all sm:p-5 ${
          isDisabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:-translate-y-0.5 hover:border-[#80B8C4] hover:shadow-[0_20px_46px_rgba(18,78,76,0.12)]'
        }`}>
        <input
          type='radio'
          name='paymentMethod'
          value='vnpay'
          checked={value === 'vnpay'}
          onChange={() => onChange('vnpay')}
          disabled={isDisabled}
          className='sr-only'
        />

        <span className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5'>
          <span className='relative flex h-[86px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-[#E1E8E8] bg-white shadow-[0_8px_22px_rgba(15,65,78,0.08)] sm:w-[210px]'>
            <Image
              src='/images/vnpay-logo.jpg'
              alt='VNPay payment gateway'
              fill
              loading='eager'
              sizes='(min-width: 640px) 210px, 100vw'
              className='scale-[3.4] object-contain'
            />
          </span>

          <span className='min-w-0 flex-1'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-[#E7F7F8] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#087A86] uppercase'>
              <svg
                aria-hidden='true'
                viewBox='0 0 20 20'
                className='h-3.5 w-3.5 fill-current'>
                <path d='M10 1.5 16.5 4v4.9c0 4.2-2.7 7.9-6.5 9.6-3.8-1.7-6.5-5.4-6.5-9.6V4L10 1.5Zm3.1 5.7-4 4-2.2-2.1-1.1 1.1 3.3 3.3 5.1-5.2-1.1-1.1Z' />
              </svg>
              Secure payment
            </span>
            <span className='mt-2 block text-base font-bold text-[#0D4949]'>
              Pay securely with VNPay
            </span>
            <span className='mt-1 block text-xs leading-5 text-[#5F6D6B] sm:text-sm'>
              Scan a VNPay QR code or pay with a supported bank account or card.
            </span>
          </span>

          <span className='absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B7F88] text-white shadow-sm sm:static sm:h-8 sm:w-8 sm:shrink-0'>
            <svg
              aria-hidden='true'
              viewBox='0 0 20 20'
              className='h-4 w-4 fill-current'>
              <path d='m7.8 14.3-4-4 1.4-1.4 2.6 2.6 7-7 1.4 1.4-8.4 8.4Z' />
            </svg>
            <span className='sr-only'>Selected</span>
          </span>
        </span>

        <span className='mt-4 flex items-start gap-2 border-t border-[#DCE9E9] pt-3 text-[11px] leading-5 text-[#6B7473]'>
          <svg
            aria-hidden='true'
            viewBox='0 0 20 20'
            className='mt-0.5 h-3.5 w-3.5 shrink-0 fill-[#A66641]'>
            <path d='M6.5 8V6.5a3.5 3.5 0 1 1 7 0V8H15a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 15 18H5a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 5 8h1.5Zm1.7 0h3.6V6.5a1.8 1.8 0 1 0-3.6 0V8Z' />
          </svg>
          You will be redirected to VNPay to complete the transaction after
          confirming.
        </span>
      </label>

      {error && <p className='mt-2 text-xs text-[#B33939]'>{error}</p>}
    </fieldset>
  );
}
