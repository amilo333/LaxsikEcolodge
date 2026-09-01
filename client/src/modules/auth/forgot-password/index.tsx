'use client';

import { Button, Field, Textfield } from '@/components/core';
import { useForgotPasswordApi } from '@/modules/auth/common';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

type TForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordModule() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { mutate, isPending } = useForgotPasswordApi();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: TForgotPasswordForm) => {
    mutate(data, {
      onSuccess: () => setSubmittedEmail(data.email),
    });
  };

  return (
    <div className='w-full max-w-[520px] rounded-[32px] border border-white/60 bg-white/94 p-6 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:p-9 lg:p-10'>
      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        Account recovery
      </p>
      <h2 className='mt-2 text-3xl font-bold text-[#153F3D] sm:text-[38px]'>
        {submittedEmail ? 'Check your inbox' : 'Forgot your password?'}
      </h2>

      {submittedEmail ? (
        <div className='mt-5'>
          <p className='text-sm leading-6 text-[#61706C]'>
            If an account exists for <strong>{submittedEmail}</strong>, we sent
            a link that is valid for 15 minutes. Please also check your spam
            folder.
          </p>
          <div className='mt-7 flex flex-col gap-3'>
            <Button
              type='button'
              onClick={() => setSubmittedEmail(null)}
              className='h-[52px]! w-full! rounded-full! text-base!'>
              Try another email
            </Button>
            <Link
              href='/auth/login'
              className='text-center text-sm font-bold text-[#0D4949] underline-offset-4 hover:underline'>
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className='mt-3 mb-7 text-sm leading-6 text-[#61706C]'>
            Enter your account email and we&apos;ll send you a secure link to
            choose a new password.
          </p>
          <div className='flex flex-col gap-6'>
            <Field control={control} name='email' label='Email'>
              <Textfield
                label='Email'
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
                inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
                error={errors.email?.message}
              />
            </Field>
            <Button
              type='submit'
              isDisabled={isPending}
              onClick={handleSubmit(onSubmit)}
              className='h-[52px]! w-full! rounded-full! text-base!'>
              {isPending ? 'Sending…' : 'Send reset link'}
            </Button>
            <Link
              href='/auth/login'
              className='text-center text-sm font-bold text-[#0D4949] underline-offset-4 hover:underline'>
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
