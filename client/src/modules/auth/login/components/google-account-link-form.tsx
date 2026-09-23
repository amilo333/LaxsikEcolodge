'use client';

import { Button, Field, Textfield } from '@/components/core';
import { TUser, useGoogleAccountLinkApi } from '@/modules/auth/common';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type TAccountLinkForm = { password: string };

type TGoogleAccountLinkFormProps = {
  credential: string;
  onCancel: () => void;
  onSuccess: (user: TUser) => void;
};

export function GoogleAccountLinkForm({
  credential,
  onCancel,
  onSuccess,
}: TGoogleAccountLinkFormProps) {
  const t = useTranslations('Auth.google');
  const accountLinkSchema = useMemo(
    () =>
      z.object({
        password: z.string().min(1, t('passwordRequired')),
      }),
    [t]
  );
  const { mutate, isPending } = useGoogleAccountLinkApi();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TAccountLinkForm>({
    resolver: zodResolver(accountLinkSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = ({ password }: TAccountLinkForm) => {
    mutate(
      { credential, password },
      { onSuccess: (response) => onSuccess(response.data.data) }
    );
  };

  return (
    <div className='rounded-[18px] border border-[#D8E5E1] bg-[#F7F9F8] p-3.5'>
      <p className='text-sm font-bold text-[#153F3D]'>{t('linkTitle')}</p>
      <p className='mt-1 text-[11px] leading-[18px] text-[#687570]'>
        {t('linkDescription')}
      </p>

      <div className='mt-3 flex flex-col gap-3'>
        <Field control={control} name='password' label={t('currentPassword')}>
          <Textfield
            label={t('currentPassword')}
            type='password'
            placeholder={t('currentPasswordPlaceholder')}
            autoComplete='current-password'
            inputClassName='h-[44px]! rounded-[13px]! bg-white! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.password?.message}
          />
        </Field>

        <Button
          type='submit'
          isDisabled={isPending}
          onClick={handleSubmit(onSubmit)}
          className='h-[44px]! w-full! rounded-full! text-xs!'>
          {isPending ? t('linking') : t('linkAndSignIn')}
        </Button>

        <div className='flex flex-wrap items-center justify-between gap-2 text-[11px]'>
          <button
            type='button'
            onClick={onCancel}
            className='font-semibold text-[#687570] hover:text-[#153F3D]'>
            {t('useAnother')}
          </button>
          <Link
            href='/auth/forgot-password'
            className='font-semibold text-[#0D4949] underline-offset-4 hover:underline'>
            {t('forgotPassword')}
          </Link>
        </div>
      </div>
    </div>
  );
}
