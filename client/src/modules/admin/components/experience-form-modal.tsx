'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  TAdminExperience,
  TAdminExperienceKind,
  useCreateAdminExperienceApi,
  useUpdateAdminExperienceApi,
} from '../common';

const experienceSchema = z.object({
  title: z.string().trim().min(2, 'Vui lòng nhập tiêu đề.'),
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự.'),
  status: z.enum(['active', 'inactive']),
});

type TExperienceForm = z.infer<typeof experienceSchema>;

type TExperienceFormModalProps = {
  kind: TAdminExperienceKind;
  item: TAdminExperience | null;
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10';

export function ExperienceFormModal({
  kind,
  item,
  onClose,
}: TExperienceFormModalProps) {
  const createItem = useCreateAdminExperienceApi(kind);
  const updateItem = useUpdateAdminExperienceApi(kind);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      status: item?.status ?? 'active',
    },
  });
  const isPending = createItem.isPending || updateItem.isPending;
  const label = kind === 'dining' ? 'Dining' : 'Spa';

  const onSubmit = async (values: TExperienceForm) => {
    setFileError('');

    if (!item && !thumbnail) {
      setFileError('Vui lòng chọn ảnh đại diện.');
      return;
    }

    if (kind === 'dining' && images.length > 5) {
      setFileError('Chỉ được chọn tối đa 5 ảnh chi tiết.');
      return;
    }

    const data = new FormData();
    data.append('title', values.title);
    data.append('description', values.description);
    data.append('status', values.status);
    if (thumbnail) data.append('thumbnail', thumbnail);
    if (kind === 'dining') {
      images.forEach((image) => data.append('images', image));
    }

    try {
      if (item) {
        await updateItem.mutateAsync({ experienceId: item._id, data });
      } else {
        await createItem.mutateAsync(data);
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
      aria-labelledby='experience-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='max-h-[92vh] w-full max-w-[720px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#E4ECE9] bg-white/95 px-5 py-4 backdrop-blur sm:px-6'>
          <div>
            <h2
              id='experience-form-title'
              className='font-lora text-xl font-semibold text-[#153F3D]'>
              {item ? `Chỉnh sửa ${label}` : `Thêm ${label}`}
            </h2>
            <p className='mt-1 text-xs text-[#75827E]'>
              Dữ liệu và hình ảnh sẽ được lưu qua API hiện có.
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
          <div className='space-y-4'>
            <label className='block text-xs font-bold text-[#344B47]'>
              Tiêu đề
              <input
                {...register('title')}
                placeholder={`Tên ${label}`}
                className={inputClassName}
              />
              {errors.title && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.title.message}
                </span>
              )}
            </label>

            <label className='block text-xs font-bold text-[#344B47]'>
              Mô tả
              <textarea
                {...register('description')}
                rows={5}
                placeholder={`Mô tả ${label}`}
                className='mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 py-3 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
              {errors.description && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.description.message}
                </span>
              )}
            </label>

            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='text-xs font-bold text-[#344B47]'>
                Trạng thái
                <select {...register('status')} className={inputClassName}>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </label>

              <label className='text-xs font-bold text-[#344B47]'>
                Ảnh đại diện {item ? '(không bắt buộc)' : ''}
                <input
                  type='file'
                  accept='image/*'
                  onChange={(event) =>
                    setThumbnail(event.target.files?.[0] ?? null)
                  }
                  className={`${inputClassName} file:mr-3 file:border-0 file:bg-transparent file:text-[10px] file:font-bold`}
                />
              </label>
            </div>

            {kind === 'dining' && (
              <label className='block text-xs font-bold text-[#344B47]'>
                Ảnh chi tiết, tối đa 5 {item ? '(chọn để thay thế)' : ''}
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={(event) =>
                    setImages(Array.from(event.target.files ?? []))
                  }
                  className={`${inputClassName} file:mr-3 file:border-0 file:bg-transparent file:text-[10px] file:font-bold`}
                />
              </label>
            )}
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
              disabled={isPending}
              className='h-11 rounded-full bg-[#0D4949] px-7 text-xs font-extrabold text-white disabled:cursor-wait disabled:opacity-60'>
              {isPending ? 'Đang lưu…' : 'Lưu nội dung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
