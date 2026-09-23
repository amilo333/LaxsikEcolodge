'use client';

import { Button, Field, Textfield } from '@/components/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSafeInternalRedirect } from '@/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TUser, useLoginApi } from '../../common';
import { GoogleSignInButton } from './google-sign-in-button';
import { LOGIN_FORM_DEFAULT_VALUES } from '../constants';
import { TLoginForm } from '../types';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { createLoginSchema } from '../schema';

export function LoginForm() {
  const t = useTranslations('Auth.login.form');
  const validationT = useTranslations('Auth.validation');
  const localizedSchema = useMemo(
    () => createLoginSchema(validationT),
    [validationT]
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectTo = getSafeInternalRedirect(redirectParam);
  const registerHref =
    redirectParam && redirectTo === redirectParam
      ? `/auth/register?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/register';
  const forgotPasswordHref = '/auth/forgot-password';

  const { mutate, isPending } = useLoginApi();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TLoginForm>({
    resolver: zodResolver(localizedSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  });

  const handleLoginSuccess = (user: TUser) => {
    const hasRequestedRedirect = Boolean(
      redirectParam && redirectTo === redirectParam
    );
    const destination = hasRequestedRedirect
      ? redirectTo
      : user.role === 'admin'
        ? '/admin'
        : redirectTo;

    router.replace(destination);
  };

  const onSubmit = (data: TLoginForm) => {
    mutate(data, {
      onSuccess: (response) => handleLoginSuccess(response.data.data),
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3.5'>
        <Field control={control} name='email' label={t('email')}>
          <Textfield
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            autoComplete='email'
            className='gap-1.5'
            inputClassName='h-[48px]! rounded-[14px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.email?.message}
          />
        </Field>

        <Field control={control} name='password' label={t('password')}>
          <Textfield
            label={t('password')}
            type='password'
            placeholder={t('passwordPlaceholder')}
            autoComplete='current-password'
            className='gap-1.5'
            inputClassName='h-[48px]! rounded-[14px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.password?.message}
          />
        </Field>

        <div className='-mt-1.5 text-right'>
          <Link
            href={forgotPasswordHref}
            className='text-xs font-semibold text-[#0D4949] underline-offset-4 hover:underline sm:text-[13px]'>
            {t('forgotPassword')}
          </Link>
        </div>
      </div>

      <Button
        type='submit'
        isDisabled={isPending}
        className='h-[48px]! w-full! rounded-full! bg-[#0D4949]! text-sm! font-bold! text-white! shadow-[0_10px_24px_rgba(13,73,73,0.2)] transition hover:bg-[#0A3B3B]!'
        onClick={handleSubmit(onSubmit)}>
        {isPending ? t('signingIn') : t('signIn')}
      </Button>

      <div className='flex items-center gap-3 text-[9px] font-bold text-[#87938F] uppercase'>
        <span className='h-px flex-1 bg-[#E3E9E7]' />
        {t('continueWith')}
        <span className='h-px flex-1 bg-[#E3E9E7]' />
      </div>

      <GoogleSignInButton onSuccess={handleLoginSuccess} />

      <div className='flex items-center gap-3 text-[9px] font-bold text-[#87938F] uppercase'>
        <span className='h-px flex-1 bg-[#E3E9E7]' />
        {t('newToLaxsik')}
        <span className='h-px flex-1 bg-[#E3E9E7]' />
      </div>

      <div className='text-center text-xs text-[#687570] sm:text-[13px]'>
        {t('noAccount')}{' '}
        <Link
          href={registerHref}
          className='font-bold text-[#0D4949] underline-offset-4 hover:underline'>
          {t('createAccount')}
        </Link>
      </div>
    </div>
  );
}
