'use client';

import { Button, Field, Textfield } from '@/components/core';
import { useForgotPasswordApi } from '@/modules/auth/common';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type TForgotPasswordForm = { email: string };

export default function ForgotPasswordModule() {
  const t = useTranslations('Auth.forgotPassword');
  const forgotPasswordSchema = useMemo(
    () => z.object({ email: z.email(t('invalidEmail')) }),
    [t]
  );
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
        {t('eyebrow')}
      </p>
      <h2 className='mt-2 text-3xl font-bold text-[#153F3D] sm:text-[38px]'>
        {submittedEmail ? t('checkInbox') : t('title')}
      </h2>

      {submittedEmail ? (
        <div className='mt-5'>
          <p className='text-sm leading-6 text-[#61706C]'>
            {t.rich('sentDescription', {
              email: submittedEmail,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <div className='mt-7 flex flex-col gap-3'>
            <Button
              type='button'
              onClick={() => setSubmittedEmail(null)}
              className='h-[52px]! w-full! rounded-full! text-base!'>
              {t('tryAnother')}
            </Button>
            <Link
              href='/auth/login'
              className='text-center text-sm font-bold text-[#0D4949] underline-offset-4 hover:underline'>
              {t('backToSignIn')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className='mt-3 mb-7 text-sm leading-6 text-[#61706C]'>
            {t('description')}
          </p>
          <div className='flex flex-col gap-6'>
            <Field control={control} name='email' label={t('email')}>
              <Textfield
                label={t('email')}
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
              {isPending ? t('sending') : t('sendLink')}
            </Button>
            <Link
              href='/auth/login'
              className='text-center text-sm font-bold text-[#0D4949] underline-offset-4 hover:underline'>
              {t('backToSignIn')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
