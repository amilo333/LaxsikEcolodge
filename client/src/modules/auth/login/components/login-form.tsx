'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Textfield } from '@/components/core';
import { loginSchema } from '../schema';
import { TLoginForm } from '../types';
import Link from 'next/link';
import { LOGIN_FORM_DEFAULT_VALUES } from '../constants';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/useLogin';

export function LoginForm() {
  const router = useRouter();

  const { mutate, isPending } = useLogin();

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
      onSuccess: () => {
        router.push('/home');
      },
    });
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='mb-4 flex flex-col gap-8'>
        <Field control={control} name='email' label='Email'>
          <Textfield
            label='Email'
            className='gap-3'
            error={errors.email?.message}
          />
        </Field>

        <Field control={control} name='password' label='Password'>
          <Textfield
            label='Password'
            type='password'
            className='gap-3'
            error={errors.password?.message}
          />
        </Field>
      </div>

      <Button
        type='submit'
        className='w-full bg-[#0D4949] py-3 text-white'
        onClick={handleSubmit(onSubmit)}>
        Log in
      </Button>

      <div className='text-muted-foreground text-center text-sm text-[17px]'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/register' className='text-primary hover:underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
