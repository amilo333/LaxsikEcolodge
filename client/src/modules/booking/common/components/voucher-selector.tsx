'use client';

import { Button } from '@/components/core';
import axios from 'axios';
import { useValidateVoucherApi } from '../hooks';
import { useBookingStore } from '../stores';

const getVoucherErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'Unable to apply this voucher.';
  }

  return 'Unable to apply this voucher.';
};

export function VoucherSelector() {
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
      setVoucherError('Please enter a voucher code.');
      return;
    }

    validateVoucher.mutate(normalizedCode, {
      onSuccess: applyVoucher,
      onError: (error) => setVoucherError(getVoucherErrorMessage(error)),
    });
  };

  return (
    <div className='rounded-[16px] border border-[#DCE4E1] bg-[#F8FAF9] p-4 sm:p-5'>
      <div>
        <p className='text-[11px] font-bold tracking-[0.12em] text-[#0D4949]/60 uppercase'>
          Special offer
        </p>
        <h2 className='mt-0.5 text-sm font-bold'>Add a voucher</h2>
      </div>

      <div className='mt-4 flex gap-2'>
        <label htmlFor='voucher-code' className='sr-only'>
          Voucher code
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
          placeholder='Enter voucher code'
          autoComplete='off'
          className='h-11 min-w-0 flex-1 rounded-full border border-[#C9D4D0] bg-white px-4 text-sm font-semibold tracking-[0.08em] transition outline-none placeholder:font-normal placeholder:tracking-normal focus:border-[#0D4949] disabled:bg-[#EEF3F1]'
        />

        {appliedVoucher ? (
          <Button
            onClick={removeVoucher}
            className='h-11! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-xs! text-[#0D4949]!'>
            Remove
          </Button>
        ) : (
          <Button
            isDisabled={validateVoucher.isPending}
            onClick={handleApplyVoucher}
            className='h-11! w-auto! min-w-[88px]! rounded-full! px-5! text-xs!'>
            {validateVoucher.isPending ? 'Applying…' : 'Apply'}
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
          Voucher {appliedVoucher.code} applied
        </p>
      )}
    </div>
  );
}
