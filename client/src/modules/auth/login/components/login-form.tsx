'use client';

import { Button, Field, Textfield } from '@/components/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSafeInternalRedirect } from '@/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLoginApi } from '../../common';
import { LOGIN_FORM_DEFAULT_VALUES } from '../constants';
import { loginSchema } from '../schema';
import { TLoginForm } from '../types';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectTo = getSafeInternalRedirect(redirectParam);
  const registerHref =
    redirectParam && redirectTo === redirectParam
      ? `/auth/register?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/register';

  const { mutate, isPending } = useLoginApi();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  });

  const onSubmit = (data: TLoginForm) => {
    mutate(data, {
      onSuccess: (response) => {
        const hasRequestedRedirect = Boolean(
          redirectParam && redirectTo === redirectParam
        );
        const destination = hasRequestedRedirect
          ? redirectTo
          : response.data.data.role === 'admin'
            ? '/admin'
            : redirectTo;

        router.replace(destination);
      },
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-5'>
        <Field control={control} name='email' label='Email'>
          <Textfield
            label='Email'
            placeholder='you@example.com'
            autoComplete='email'
            className='gap-2'
            inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.email?.message}
          />
        </Field>

        <Field control={control} name='password' label='Password'>
          <Textfield
            label='Password'
            type='password'
            placeholder='Enter your password'
            autoComplete='current-password'
            className='gap-2'
            inputClassName='h-[52px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.password?.message}
          />
        </Field>
      </div>

      <Button
        type='submit'
        isDisabled={isPending}
        className='h-[52px]! w-full! rounded-full! bg-[#0D4949]! text-base! font-bold! text-white! shadow-[0_12px_28px_rgba(13,73,73,0.24)] transition hover:bg-[#0A3B3B]!'
        onClick={handleSubmit(onSubmit)}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>

      <div className='flex items-center gap-3 text-[10px] font-bold text-[#87938F] uppercase'>
        <span className='h-px flex-1 bg-[#E3E9E7]' />
        New to Laxsik?
        <span className='h-px flex-1 bg-[#E3E9E7]' />
      </div>

      <div className='text-center text-sm text-[#687570]'>
        Don&apos;t have an account?{' '}
        <Link
          href={registerHref}
          className='font-bold text-[#0D4949] underline-offset-4 hover:underline'>
          Create account
        </Link>
      </div>
    </div>
  );
}
