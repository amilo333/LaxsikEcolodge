'use client';

import { Button, Field, Textfield } from '@/components/core';
import {
  TUpdateProfilePayload,
  TUser,
  useUpdateProfileApi,
} from '@/modules/auth/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Vui lòng nhập họ và tên.'),
  email: z.email('Vui lòng nhập đúng địa chỉ email.'),
  phone: z.string().trim().min(8, 'Vui lòng nhập đúng số điện thoại.'),
});

type TProfilePanelProps = {
  user: TUser;
};

export function ProfilePanel({ user }: TProfilePanelProps) {
  const updateProfile = useUpdateProfileApi();
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm<TUpdateProfilePayload>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
    },
  });

  useEffect(() => {
    reset({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
    });
  }, [reset, user]);

  const onSubmit = (data: TUpdateProfilePayload) => {
    updateProfile.mutate(data, {
      onSuccess: (updatedUser) => {
        reset({
          full_name: updatedUser.full_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        });
      },
    });
  };

  return (
    <div className='rounded-[16px] border border-[#DCE7E3] bg-white p-5 shadow-[0_16px_45px_rgba(13,73,73,0.08)] sm:p-7'>
      <div className='border-b border-[#E5ECEA] pb-5'>
        <h2 className='text-xl font-extrabold text-[#193D3B]'>
          Thông tin cá nhân
        </h2>
        <p className='mt-2 text-sm leading-6 text-[#6E7B77]'>
          Thông tin này sẽ được dùng làm dữ liệu liên hệ mặc định khi đặt phòng.
        </p>
      </div>

      <div className='mt-6 grid gap-5 sm:grid-cols-2'>
        <div className='sm:col-span-2'>
          <Field control={control} name='full_name' label='Họ và tên'>
            <Textfield
              label='Họ và tên'
              placeholder='Nhập họ và tên'
              autoComplete='name'
              inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.full_name?.message}
            />
          </Field>
        </div>

        <Field control={control} name='email' label='Email'>
          <Textfield
            label='Email'
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.email?.message}
          />
        </Field>

        <Field control={control} name='phone' label='Số điện thoại'>
          <Textfield
            label='Số điện thoại'
            type='tel'
            placeholder='Nhập số điện thoại'
            autoComplete='tel'
            inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.phone?.message}
          />
        </Field>
      </div>

      <div className='mt-7 flex justify-end border-t border-[#E5ECEA] pt-6'>
        <Button
          type='submit'
          isDisabled={!isDirty || updateProfile.isPending}
          onClick={handleSubmit(onSubmit)}
          className='h-12! w-auto! min-w-[190px]! rounded-full! px-8! text-sm!'>
          {updateProfile.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  );
}
