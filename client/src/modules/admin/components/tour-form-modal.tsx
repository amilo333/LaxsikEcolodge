'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TTour } from '@/modules/tours/types';
import { useCreateAdminTourApi, useUpdateAdminTourApi } from '../common';

const getHighlights = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const tourSchema = z.object({
  title: z.string().trim().min(2, 'Vui lòng nhập tên tour.'),
  eyebrow: z.string().trim().min(2, 'Vui lòng nhập nhãn ngắn.'),
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự.'),
  duration: z.string().trim().min(1, 'Vui lòng nhập thời lượng.'),
  rhythm: z.string().trim().min(1, 'Vui lòng nhập độ khó.'),
  highlightsText: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập ít nhất một điểm nổi bật.')
    .refine(
      (value) => getHighlights(value).length <= 8,
      'Chỉ được nhập tối đa 8 điểm nổi bật.'
    ),
  sortOrder: z.number().int().min(0, 'Thứ tự không hợp lệ.'),
  status: z.enum(['active', 'inactive']),
});

type TTourForm = z.infer<typeof tourSchema>;

type TTourFormModalProps = {
  tour: TTour | null;
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10';

export function TourFormModal({ tour, onClose }: TTourFormModalProps) {
  const createTour = useCreateAdminTourApi();
  const updateTour = useUpdateAdminTourApi();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TTourForm>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: tour?.title ?? '',
      eyebrow: tour?.eyebrow ?? '',
      description: tour?.description ?? '',
      duration: tour?.duration ?? '',
      rhythm: tour?.rhythm ?? '',
      highlightsText: tour?.highlights.join('\n') ?? '',
      sortOrder: tour?.sortOrder ?? 0,
      status: tour?.status ?? 'active',
    },
  });
  const isPending = createTour.isPending || updateTour.isPending;

  const onSubmit = async (values: TTourForm) => {
    setFileError('');

    if (!tour && !thumbnail) {
      setFileError('Vui lòng chọn ảnh đại diện cho tour.');
      return;
    }

    const data = new FormData();
    data.append('title', values.title);
    data.append('eyebrow', values.eyebrow);
    data.append('description', values.description);
    data.append('duration', values.duration);
    data.append('rhythm', values.rhythm);
    data.append(
      'highlights',
      JSON.stringify(getHighlights(values.highlightsText))
    );
    data.append('sortOrder', String(values.sortOrder));
    data.append('status', values.status);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      if (tour) {
        await updateTour.mutateAsync({ tourId: tour._id, data });
      } else {
        await createTour.mutateAsync(data);
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
      aria-labelledby='tour-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#E4ECE9] bg-white/95 px-5 py-4 backdrop-blur sm:px-6'>
          <div>
            <h2
              id='tour-form-title'
              className='font-lora text-xl font-semibold text-[#153F3D]'>
              {tour ? 'Chỉnh sửa tour' : 'Thêm tour mới'}
            </h2>
            <p className='mt-1 text-xs text-[#75827E]'>
              Nội dung đang hoạt động sẽ xuất hiện trên trang Tours.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label='Đóng biểu mẫu'
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1] text-lg text-[#38514D] disabled:opacity-50'>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Tên tour
              <input
                {...register('title')}
                placeholder='Ví dụ: Hau Chu Ngai Highland Trail'
                className={inputClassName}
              />
              {errors.title && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.title.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Nhãn ngắn
              <input
                {...register('eyebrow')}
                placeholder='Ví dụ: Remote paths & mountain villages'
                className={inputClassName}
              />
              {errors.eyebrow && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.eyebrow.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Mô tả
              <textarea
                {...register('description')}
                rows={5}
                placeholder='Mô tả hành trình và trải nghiệm chính'
                className='mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 py-3 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
              {errors.description && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.description.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Thời lượng
              <input
                {...register('duration')}
                placeholder='Ví dụ: 5–8 giờ'
                className={inputClassName}
              />
              {errors.duration && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.duration.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Độ khó / nhịp
              <input
                {...register('rhythm')}
                placeholder='Ví dụ: Trung bình'
                className={inputClassName}
              />
              {errors.rhythm && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.rhythm.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Điểm nổi bật (mỗi dòng một mục, tối đa 8)
              <textarea
                {...register('highlightsText')}
                rows={5}
                placeholder={
                  'Rừng tre và đường mòn\nThác Cầu Mây\nBản Giàng Tả Chải'
                }
                className='mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 py-3 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
              {errors.highlightsText && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.highlightsText.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Thứ tự hiển thị
              <input
                type='number'
                min='0'
                {...register('sortOrder', { valueAsNumber: true })}
                className={inputClassName}
              />
              {errors.sortOrder && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.sortOrder.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Trạng thái
              <select {...register('status')} className={inputClassName}>
                <option value='active'>Đang hiển thị</option>
                <option value='inactive'>Đang ẩn</option>
              </select>
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Ảnh đại diện {tour ? '(không bắt buộc)' : ''}
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
              className='h-11 rounded-full border border-[#C9D8D4] px-6 text-xs font-bold text-[#46605B] disabled:opacity-50'>
              Hủy
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='h-11 rounded-full bg-[#0D4949] px-7 text-xs font-extrabold text-white disabled:cursor-wait disabled:opacity-60'>
              {isPending ? 'Đang lưu…' : tour ? 'Lưu thay đổi' : 'Tạo tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
