'use client';

import { Button } from '@/components/core';
import axios from 'axios';
import { useValidateVoucherApi } from '../hooks';
import { useBookingStore } from '../stores';
import { useTranslations } from 'next-intl';

export function VoucherSelector() {
  const t = useTranslations('Booking.voucher');
  const voucherCode = useBookingStore((state) => state.voucherCode);
  const appliedVoucher = useBookingStore((state) => state.appliedVoucher);
  const voucherError = useBookingStore((state) => state.voucherError);
  const setVoucherCode = useBookingStore((state) => state.setVoucherCode);
  const setVoucherError = useBookingStore((state) => state.setVoucherError);
  const applyVoucher = useBookingStore((state) => state.applyVoucher);
  const removeVoucher = useBookingStore((state) => state.removeVoucher);
  const validateVoucher = useValidateVoucherApi();

  const handleApplyVoucher = () => {
    const normalizedCode = voucherCode.trim().toUpperCase();

    if (!normalizedCode) {
      setVoucherError(t('required'));
      return;
    }

    validateVoucher.mutate(normalizedCode, {
      onSuccess: applyVoucher,
      onError: (error) => {
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : null;
        setVoucherError(message ?? t('applyError'));
      },
    });
  };

  return (
    <div className='rounded-[16px] border border-[#DCE4E1] bg-[#F8FAF9] p-4 sm:p-5'>
      <div>
        <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
          {t('eyebrow')}
        </p>
        <h2 className='mt-0.5 text-sm font-bold'>{t('title')}</h2>
      </div>

      <div className='mt-4 flex gap-2'>
        <label htmlFor='voucher-code' className='sr-only'>
          {t('code')}
        </label>
        <input
          id='voucher-code'
          name='voucherCode'
          value={voucherCode}
          disabled={Boolean(appliedVoucher)}
          onChange={(event) => setVoucherCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !appliedVoucher) {
              handleApplyVoucher();
            }
          }}
          placeholder={t('placeholder')}
          autoComplete='off'
          className='h-11 min-w-0 flex-1 rounded-full border border-[#C9D4D0] bg-white px-4 text-sm font-semibold transition outline-none placeholder:font-normal focus:border-[#0D4949] disabled:bg-[#EEF3F1]'
        />

        {appliedVoucher ? (
          <Button
            onClick={removeVoucher}
            className='h-11! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-xs! text-[#0D4949]!'>
            {t('remove')}
          </Button>
        ) : (
          <Button
            isDisabled={validateVoucher.isPending}
            onClick={handleApplyVoucher}
            className='h-11! w-auto! min-w-[88px]! rounded-full! px-5! text-xs!'>
            {validateVoucher.isPending ? t('applying') : t('apply')}
          </Button>
        )}
      </div>

      {voucherError && (
        <p className='mt-2 text-xs font-medium text-[#B33939]' role='alert'>
          {voucherError}
        </p>
      )}

      {appliedVoucher && (
        <p
          className='mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#236B51]'
          role='status'>
          <span className='flex h-4 w-4 items-center justify-center rounded-full bg-[#236B51] text-[10px] text-white'>
            ✓
          </span>
          {t('applied', { code: appliedVoucher.code })}
        </p>
      )}
    </div>
  );
}
