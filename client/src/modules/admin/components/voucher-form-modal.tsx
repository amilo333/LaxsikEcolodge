'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  TAdminVoucher,
  TAdminVoucherPayload,
  useCreateAdminVoucherApi,
  useUpdateAdminVoucherApi,
} from '../common';

const voucherSchema = z
  .object({
    code: z.string().trim().min(2, 'Vui lòng nhập mã voucher.'),
    discountType: z.enum(['percent', 'amount']),
    discountValue: z.number().positive('Giá trị giảm phải lớn hơn 0.'),
    quantity: z.number().int().min(0, 'Số lượt sử dụng không hợp lệ.'),
    startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu.'),
    endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc.'),
    status: z.enum(['active', 'inactive']),
  })
  .superRefine((values, context) => {
    if (values.discountType === 'percent' && values.discountValue > 100) {
      context.addIssue({
        code: 'custom',
        path: ['discountValue'],
        message: 'Phần trăm giảm không được lớn hơn 100%.',
      });
    }

    if (values.endDate < values.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Ngày kết thúc phải từ ngày bắt đầu trở đi.',
      });
    }
  });

type TVoucherFormValues = z.infer<typeof voucherSchema>;

type TVoucherFormModalProps = {
  voucher: TAdminVoucher | null;
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10';

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDateInput(date);
};

export function VoucherFormModal({ voucher, onClose }: TVoucherFormModalProps) {
  const createVoucher = useCreateAdminVoucherApi();
  const updateVoucher = useUpdateAdminVoucherApi();
  const isEditing = Boolean(voucher);
  const isPending = createVoucher.isPending || updateVoucher.isPending;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TVoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: voucher?.code ?? '',
      discountType: voucher?.discountType ?? 'percent',
      discountValue: voucher?.discountValue ?? 10,
      quantity: voucher?.quantity ?? 1,
      startDate: voucher?.startDate.slice(0, 10) ?? formatDateInput(new Date()),
      endDate: voucher?.endDate.slice(0, 10) ?? getDefaultEndDate(),
      status: voucher?.status ?? 'active',
    },
  });
  const discountType = useWatch({ control, name: 'discountType' });

  const onSubmit = async (values: TVoucherFormValues) => {
    const payload: TAdminVoucherPayload = {
      ...values,
      code: values.code.trim().toUpperCase(),
      startDate: new Date(`${values.startDate}T00:00:00`).toISOString(),
      endDate: new Date(`${values.endDate}T23:59:59.999`).toISOString(),
    };

    try {
      if (voucher) {
        await updateVoucher.mutateAsync({
          voucherId: voucher._id,
          data: payload,
        });
      } else {
        await createVoucher.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Mutation hooks display the API error.
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='voucher-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='max-h-[92vh] w-full max-w-[680px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#E4ECE9] bg-white/95 px-5 py-4 backdrop-blur sm:px-6'>
          <div>
            <h2
              id='voucher-form-title'
              className='font-lora text-xl font-semibold text-[#153F3D]'>
              {isEditing ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}
            </h2>
            <p className='mt-1 text-[11px] text-[#75827E]'>
              Thiết lập mức giảm, số lượt sử dụng và thời gian áp dụng.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label='Đóng'
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1] text-lg text-[#38514D] hover:bg-[#E2EBE8] disabled:opacity-50'>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Mã voucher
              <input
                {...register('code')}
                placeholder='Ví dụ: SUMMER20'
                className={`${inputClassName} uppercase`}
              />
              {errors.code && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.code.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Loại giảm giá
              <select {...register('discountType')} className={inputClassName}>
                <option value='percent'>Theo phần trăm</option>
                <option value='amount'>Theo số tiền</option>
              </select>
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              {discountType === 'percent' ? 'Mức giảm (%)' : 'Mức giảm (VND)'}
              <input
                type='number'
                min='1'
                max={discountType === 'percent' ? '100' : undefined}
                {...register('discountValue', { valueAsNumber: true })}
                className={inputClassName}
              />
              {errors.discountValue && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.discountValue.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Số lượt sử dụng
              <input
                type='number'
                min='0'
                {...register('quantity', { valueAsNumber: true })}
                className={inputClassName}
              />
              {errors.quantity && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.quantity.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Trạng thái
              <select {...register('status')} className={inputClassName}>
                <option value='active'>Đang bật</option>
                <option value='inactive'>Đã tắt</option>
              </select>
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Ngày bắt đầu
              <input
                type='date'
                {...register('startDate')}
                className={inputClassName}
              />
              {errors.startDate && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.startDate.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Ngày kết thúc
              <input
                type='date'
                {...register('endDate')}
                className={inputClassName}
              />
              {errors.endDate && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.endDate.message}
                </span>
              )}
            </label>
          </div>

          <div className='mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#E4ECE9] pt-5 sm:flex-row'>
            <button
              type='button'
              onClick={onClose}
              disabled={isPending}
              className='h-11 rounded-full border border-[#C9D8D4] px-6 text-xs font-bold text-[#46605B] disabled:opacity-50'>
              Hủy
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='h-11 rounded-full bg-[#0D4949] px-7 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(13,73,73,0.2)] disabled:cursor-wait disabled:opacity-60'>
              {isPending
                ? 'Đang lưu…'
                : isEditing
                  ? 'Lưu thay đổi'
                  : 'Tạo voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
