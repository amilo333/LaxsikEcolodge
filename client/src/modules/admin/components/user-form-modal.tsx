'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  TAdminUser,
  TUpdateAdminUserPayload,
  useUpdateAdminUserApi,
} from '../common';

const userSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Họ tên cần ít nhất 2 ký tự.')
    .max(100, 'Họ tên không được quá 100 ký tự.'),
  email: z
    .string()
    .trim()
    .email('Email không đúng định dạng.')
    .max(254, 'Email không được quá 254 ký tự.'),
  phone: z.string().trim().max(30, 'Số điện thoại không được quá 30 ký tự.'),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'inactive']),
});

type TUserForm = z.infer<typeof userSchema>;

type TUserFormModalProps = {
  user: TAdminUser;
  isCurrentUser: boolean;
  onClose: () => void;
};

const inputClassName =
  'mt-1.5 h-11 w-full rounded-xl border border-[#DCE6E3] bg-[#F8FAF9] px-4 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10 disabled:cursor-not-allowed disabled:bg-[#EEF2F0] disabled:text-[#7B8884]';

export function UserFormModal({
  user,
  isCurrentUser,
  onClose,
}: TUserFormModalProps) {
  const updateUser = useUpdateAdminUserApi();
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<TUserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role === 'admin' ? 'admin' : 'user',
      status: user.status ? 'active' : 'inactive',
    },
  });

  const onSubmit = async (values: TUserForm) => {
    const data: TUpdateAdminUserPayload = {
      full_name: values.full_name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
    };

    if (!isCurrentUser) {
      data.role = values.role;
      data.status = values.status === 'active';
    }

    try {
      await updateUser.mutateAsync({ userId: user._id, data });
      onClose();
    } catch {
      // Mutation hooks display the API error.
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='user-form-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/65 p-4 backdrop-blur-sm'>
      <div className='max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[16px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#E4ECE9] bg-white/95 px-5 py-4 backdrop-blur sm:px-6'>
          <div>
            <h2
              id='user-form-title'
              className='text-lg font-extrabold text-[#153F3D]'>
              Chỉnh sửa người dùng
            </h2>
            <p className='mt-1 text-[11px] text-[#75827E]'>
              Cập nhật thông tin tài khoản, quyền và trạng thái hoạt động.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={updateUser.isPending}
            aria-label='Đóng biểu mẫu chỉnh sửa người dùng'
            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1] text-lg text-[#38514D] hover:bg-[#E2EBE8] disabled:opacity-50'>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-5 sm:p-6'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-xs font-bold text-[#344B47] sm:col-span-2'>
              Họ và tên
              <input
                {...register('full_name')}
                autoComplete='name'
                className={inputClassName}
              />
              {errors.full_name && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.full_name.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Email
              <input
                type='email'
                {...register('email')}
                autoComplete='email'
                className={inputClassName}
              />
              {errors.email && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Số điện thoại
              <input
                type='tel'
                {...register('phone')}
                autoComplete='tel'
                placeholder='Có thể để trống'
                className={inputClassName}
              />
              {errors.phone && (
                <span className='mt-1 block text-[10px] text-[#B33939]'>
                  {errors.phone.message}
                </span>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Vai trò
              {isCurrentUser ? (
                <>
                  <input type='hidden' {...register('role')} />
                  <select
                    value={user.role}
                    disabled
                    aria-label='Vai trò hiện tại'
                    className={inputClassName}>
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                  </select>
                </>
              ) : (
                <select {...register('role')} className={inputClassName}>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
              )}
            </label>

            <label className='text-xs font-bold text-[#344B47]'>
              Trạng thái
              {isCurrentUser ? (
                <>
                  <input type='hidden' {...register('status')} />
                  <select
                    value={user.status ? 'active' : 'inactive'}
                    disabled
                    aria-label='Trạng thái hiện tại'
                    className={inputClassName}>
                    <option value='active'>Hoạt động</option>
                    <option value='inactive'>Đã khóa</option>
                  </select>
                </>
              ) : (
                <select {...register('status')} className={inputClassName}>
                  <option value='active'>Hoạt động</option>
                  <option value='inactive'>Đã khóa</option>
                </select>
              )}
            </label>
          </div>

          {isCurrentUser && (
            <p className='mt-4 rounded-xl bg-[#EEF5F2] px-4 py-3 text-[11px] leading-5 text-[#45635D]'>
              Đây là tài khoản bạn đang sử dụng. Bạn có thể sửa thông tin liên
              hệ, nhưng không thể tự hạ quyền hoặc tự khóa tài khoản.
            </p>
          )}

          <div className='mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#E4ECE9] pt-5 sm:flex-row'>
            <button
              type='button'
              onClick={onClose}
              disabled={updateUser.isPending}
              className='h-11 rounded-full border border-[#C9D8D4] px-6 text-xs font-bold text-[#46605B] disabled:opacity-50'>
              Hủy
            </button>
            <button
              type='submit'
              disabled={updateUser.isPending || !isDirty}
              className='h-11 rounded-full bg-[#0D4949] px-7 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(13,73,73,0.2)] disabled:cursor-not-allowed disabled:opacity-50'>
              {updateUser.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
