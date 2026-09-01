'use client';

import { Button, Field, Textfield } from '@/components/core';
import { useResetPasswordApi } from '@/modules/auth/common';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordModule() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isComplete, setIsComplete] = useState(false);
  const { mutate, isPending } = useResetPasswordApi();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (data: TResetPasswordForm) => {
    if (!token) return;

    mutate(
      { token, password: data.password },
      { onSuccess: () => setIsComplete(true) }
    );
  };

  return (
    <div className='w-full max-w-[520px] rounded-[32px] border border-white/60 bg-white/94 p-6 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:p-9 lg:p-10'>
      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        Account recovery
      </p>
      <h2 className='mt-2 text-3xl font-bold text-[#153F3D] sm:text-[38px]'>
        {isComplete ? 'Password updated' : 'Choose a new password'}
      </h2>

      {!token ? (
        <div className='mt-5'>
          <p className='text-sm leading-6 text-[#61706C]'>
            This reset link is incomplete. Please request a new password reset
            email.
          </p>
          <Link
            href='/auth/forgot-password'
            className='mt-6 inline-block text-sm font-bold text-[#0D4949] underline-offset-4 hover:underline'>
            Request a new link
          </Link>
        </div>
      ) : isComplete ? (
        <div className='mt-5'>
          <p className='text-sm leading-6 text-[#61706C]'>
            Your password has been changed successfully. You can now sign in
            with your new password.
          </p>
          <Link
            href='/auth/login'
            className='mt-7 block rounded-full bg-[#0D4949] px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-[#0A3B3B]'>
            Continue to sign in
          </Link>
        </div>
      ) : (
        <>
          <p className='mt-3 mb-7 text-sm leading-6 text-[#61706C]'>
            Use at least 8 characters. For better security, choose a password
            you do not use elsewhere.
          </p>
          <div className='flex flex-col gap-5'>
            <Field control={control} name='password' label='New password'>
              <Textfield
                label='New password'
                type='password'
                placeholder='At least 8 characters'
                autoComplete='new-password'
                inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
                error={errors.password?.message}
              />
            </Field>
            <Field
              control={control}
              name='confirmPassword'
              label='Confirm new password'>
              <Textfield
                label='Confirm new password'
                type='password'
                placeholder='Repeat your new password'
                autoComplete='new-password'
                inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
                error={errors.confirmPassword?.message}
              />
            </Field>
            <Button
              type='submit'
              isDisabled={isPending}
              onClick={handleSubmit(onSubmit)}
              className='h-[52px]! w-full! rounded-full! text-base!'>
              {isPending ? 'Updating…' : 'Update password'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
