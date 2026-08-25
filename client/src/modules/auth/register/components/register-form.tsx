'use client';
import { Button, Field, Textfield } from '@/components/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSafeInternalRedirect } from '@/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { REGISTER_FORM_DEFAULT_VALUES } from '../constant';
import { registerSchema } from '../schema';
import { TRegisterForm } from '../types';
import { useRegisterApi } from '../../common/hooks';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectTo = getSafeInternalRedirect(redirectParam);
  const loginHref =
    redirectParam && redirectTo === redirectParam
      ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/login';

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_FORM_DEFAULT_VALUES,
  });

  const { mutate, isPending } = useRegisterApi();

  const onSubmit = (data: TRegisterForm) => {
    mutate(data, {
      onSuccess: () => {
        router.replace(redirectTo);
      },
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <Field control={control} name='full_name' label='Full Name'>
            <Textfield
              label='Full Name'
              placeholder='Your full name'
              autoComplete='name'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.full_name?.message}
            />
          </Field>
        </div>

        <div>
          <Field control={control} name='email' label='Email'>
            <Textfield
              label='Email'
              placeholder='you@example.com'
              autoComplete='email'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.email?.message}
            />
          </Field>
        </div>

        <div className='sm:col-span-2'>
          <Field control={control} name='phone' label='Phone'>
            <Textfield
              label='Phone'
              placeholder='Your phone number'
              autoComplete='tel'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.phone?.message}
            />
          </Field>
        </div>

        <div>
          <Field control={control} name='password' label='Password'>
            <Textfield
              label='Password'
              type='password'
              placeholder='At least 6 characters'
              autoComplete='new-password'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.password?.message}
            />
          </Field>
        </div>

        <div>
          <Field
            control={control}
            name='confirmPassword'
            label='Confirm Password'>
            <Textfield
              label='Confirm Password'
              type='password'
              placeholder='Repeat password'
              autoComplete='new-password'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] transition focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.confirmPassword?.message}
            />
          </Field>
        </div>
      </div>

      <Button
        type='submit'
        isDisabled={isPending}
        className='h-[52px]! w-full! rounded-full! bg-[#0D4949]! text-base! font-bold! text-white! shadow-[0_12px_28px_rgba(13,73,73,0.24)] transition hover:bg-[#0A3B3B]!'
        onClick={handleSubmit(onSubmit)}>
        {isPending ? 'Creating account…' : 'Create account'}
      </Button>

      <div className='text-center text-sm text-[#687570]'>
        Have an account?{' '}
        <Link
          href={loginHref}
          className='font-bold text-[#0D4949] underline-offset-4 hover:underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
