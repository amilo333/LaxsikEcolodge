'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  TAdminExperience,
  TAdminExperienceKind,
  TAdminExperienceService,
  useCreateAdminExperienceServiceApi,
  useUpdateAdminExperienceServiceApi,
} from '../common';

const serviceSchema = z.object({
  parentId: z.string().min(1, 'Vui lòng chọn nội dung cha.'),
  title: z.string().trim().min(2, 'Vui lòng nhập tên dịch vụ.'),
  description: z.string().trim().min(3, 'Vui lòng nhập mô tả.'),
  status: z.enum(['active', 'inactive']),
});

type TServiceForm = z.infer<typeof serviceSchema>;

type TServiceFormModalProps = {
  kind: TAdminExperienceKind;
  service: TAdminExperienceService | null;
  parents: TAdminExperience[];
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10';

const getParentId = (
  kind: TAdminExperienceKind,
  service: TAdminExperienceService | null
) => {
  const parent = kind === 'dining' ? service?.diningId : service?.spaId;
  return typeof parent === 'string' ? parent : parent?._id;
};

export function ServiceFormModal({
  kind,
  service,
  parents,
  onClose,
}: TServiceFormModalProps) {
  const createService = useCreateAdminExperienceServiceApi(kind);
  const updateService = useUpdateAdminExperienceServiceApi(kind);
  const [icon, setIcon] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      parentId: getParentId(kind, service) ?? parents[0]?._id ?? '',
      title: service?.title ?? '',
      description: service?.description ?? '',
      status: service?.status ?? 'active',
    },
  });
  const isPending = createService.isPending || updateService.isPending;
  const label = kind === 'dining' ? 'Dining' : 'Spa';

  const onSubmit = async (values: TServiceForm) => {
    setFileError('');

    if (!service && !icon) {
      setFileError('Vui lòng chọn icon dịch vụ.');
      return;
    }

    const data = new FormData();
    data.append(kind === 'dining' ? 'diningId' : 'spaId', values.parentId);
    data.append('title', values.title);
    data.append('description', values.description);
    data.append('status', values.status);
    if (icon) data.append('icon', icon);

    try {
      if (service) {
        await updateService.mutateAsync({ serviceId: service._id, data });
      } else {
        await createService.mutateAsync(data);
      }
      onClose();
    } catch {
      // Mutation hooks show API errors.
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='service-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-[640px] overflow-hidden rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='flex items-center justify-between border-b border-[#E4ECE9] px-5 py-4 sm:px-6'>
          <div>
            <h2
              id='service-form-title'
              className='font-lora text-xl font-semibold text-[#153F3D]'>
              {service ? 'Chỉnh sửa dịch vụ' : `Thêm dịch vụ ${label}`}
            </h2>
            <p className='mt-1 text-xs text-[#75827E]'>
              Service sẽ hiển thị trên trang {label} tương ứng.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1] text-lg text-[#38514D]'>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Thuộc nội dung {label}
              <select {...register('parentId')} className={inputClassName}>
                {parents.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.title}
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.parentId.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Tên dịch vụ
              <input
                {...register('title')}
                placeholder='Tên dịch vụ'
                className={inputClassName}
              />
              {errors.title && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.title.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Mô tả
              <textarea
                {...register('description')}
                rows={4}
                placeholder='Thời gian, nội dung hoặc thông tin dịch vụ'
                className='mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 py-3 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Trạng thái
              <select {...register('status')} className={inputClassName}>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Icon {service ? '(không bắt buộc)' : ''}
              <input
                type='file'
                accept='image/*'
                onChange={(event) => setIcon(event.target.files?.[0] ?? null)}
                className={`${inputClassName} file:mr-3 file:border-0 file:bg-transparent file:text-[10px] file:font-bold`}
              />
            </label>
          </div>

          {fileError && (
            <p className='mt-4 rounded-xl bg-[#FCEBEC] px-4 py-3 text-xs font-bold text-[#A33A43]'>
              {fileError}
            </p>
          )}

          <div className='mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#E4ECE9] pt-5 sm:flex-row'>
            <button
              type='button'
              onClick={onClose}
              disabled={isPending}
              className='h-11 rounded-full border border-[#C9D8D4] px-6 text-xs font-bold text-[#46605B]'>
              Hủy
            </button>
            <button
              type='submit'
              disabled={isPending || parents.length === 0}
              className='h-11 rounded-full bg-[#0D4949] px-7 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60'>
              {isPending ? 'Đang lưu…' : 'Lưu dịch vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
