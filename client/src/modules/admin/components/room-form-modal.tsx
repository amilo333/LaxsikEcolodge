'use client';

import { TRoom } from '@/modules/rooms/common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  TAdminRoomPayload,
  useCreateAdminRoomApi,
  useUpdateAdminRoomApi,
} from '../common';

const roomSchema = z.object({
  title: z.string().trim().min(2, 'Vui lòng nhập tên phòng.'),
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự.'),
  price: z.number().min(0, 'Giá không hợp lệ.'),
  bed: z.string().trim().min(1, 'Vui lòng nhập loại giường.'),
  area: z.number().min(1, 'Diện tích không hợp lệ.'),
  capacity: z.number().int().min(1, 'Sức chứa không hợp lệ.'),
  quantity: z.number().int().min(0, 'Số lượng không hợp lệ.'),
  status: z.enum(['available', 'maintenance', 'inactive']),
  bathroom: z.string(),
  fireplace: z.string(),
  views: z.string(),
});

type TRoomFormModalProps = {
  room: TRoom | null;
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-3.5 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10';

export function RoomFormModal({ room, onClose }: TRoomFormModalProps) {
  const createRoom = useCreateAdminRoomApi();
  const updateRoom = useUpdateAdminRoomApi();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const isEditing = Boolean(room);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TAdminRoomPayload>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: room?.title ?? '',
      description: room?.description ?? '',
      price: room?.price ?? 0,
      bed: room?.bed ?? '',
      area: room?.area ?? 1,
      capacity: room?.capacity ?? 1,
      quantity: room?.quantity ?? 1,
      status: room?.status ?? 'available',
      bathroom: room?.bathroom ?? '',
      fireplace: room?.fireplace ?? '',
      views: room?.views ?? '',
    },
  });
  const isPending = createRoom.isPending || updateRoom.isPending;

  const onSubmit = async (data: TAdminRoomPayload) => {
    setFileError('');

    try {
      if (room) {
        await updateRoom.mutateAsync({ roomId: room._id, data });
        onClose();
        return;
      }

      if (!thumbnail) {
        setFileError('Vui lòng chọn ảnh đại diện cho phòng.');
        return;
      }

      if (images.length > 5) {
        setFileError('Chỉ được chọn tối đa 5 ảnh chi tiết.');
        return;
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append('thumbnail', thumbnail);
      images.forEach((image) => formData.append('images', image));

      await createRoom.mutateAsync(formData);
      onClose();
    } catch {
      // Mutation hooks display the API error.
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='room-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#E4ECE9] bg-white/95 px-5 py-4 backdrop-blur sm:px-6'>
          <div>
            <h2
              id='room-form-title'
              className='text-lg font-extrabold text-[#153F3D]'>
              {isEditing ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
            </h2>
            <p className='mt-1 text-[11px] text-[#75827E]'>
              {isEditing
                ? 'Cập nhật thông tin và trạng thái phòng.'
                : 'Ảnh sẽ được tải lên Cloudinary qua API hiện có.'}
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1] text-lg text-[#38514D] hover:bg-[#E2EBE8] disabled:opacity-50'>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Tên phòng
              <input
                {...register('title')}
                placeholder='Ví dụ: Deluxe Mountain View'
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
                placeholder='Mô tả chi tiết phòng'
                className='mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-3.5 py-3 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
              {errors.description && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.description.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Giá mỗi đêm (VND)
              <input
                type='number'
                min='0'
                {...register('price', { valueAsNumber: true })}
                className={inputClassName}
              />
              {errors.price && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.price.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Trạng thái
              <select {...register('status')} className={inputClassName}>
                <option value='available'>Available</option>
                <option value='maintenance'>Maintenance</option>
                <option value='inactive'>Inactive</option>
              </select>
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Loại giường
              <input
                {...register('bed')}
                placeholder='1 King Bed'
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              View
              <input
                {...register('views')}
                placeholder='Mountain view'
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Diện tích (m²)
              <input
                type='number'
                min='1'
                {...register('area', { valueAsNumber: true })}
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Sức chứa
              <input
                type='number'
                min='1'
                {...register('capacity', { valueAsNumber: true })}
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Tổng số phòng
              <input
                type='number'
                min='0'
                {...register('quantity', { valueAsNumber: true })}
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Phòng tắm
              <input
                {...register('bathroom')}
                placeholder='Private bathroom'
                className={inputClassName}
              />
            </label>

            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Lò sưởi
              <input
                {...register('fireplace')}
                placeholder='Fireplace information'
                className={inputClassName}
              />
            </label>

            {!isEditing && (
              <>
                <label className='text-xs font-bold text-[#344B47]'>
                  Ảnh đại diện
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(event) =>
                      setThumbnail(event.target.files?.[0] ?? null)
                    }
                    className={`${inputClassName} file:mr-3 file:border-0 file:bg-transparent file:text-[10px] file:font-bold`}
                  />
                </label>
                <label className='text-xs font-bold text-[#344B47]'>
                  Ảnh chi tiết (tối đa 5)
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
              </>
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
                  : 'Tạo phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
