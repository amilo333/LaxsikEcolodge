'use client';
import { Button, Field, Textfield } from '@/components/core';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { REGISTER_FORM_DEFAULT_VALUES } from '../constant';
import { registerSchema } from '../schema';
import { TRegisterForm } from '../types';
import { useRegister } from '@/hooks/auth/useRegister';
import { useRouter } from 'next/navigation';
export function RegisterForm() {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_FORM_DEFAULT_VALUES,
  });

  const { mutate, isPending } = useRegister();

  const onSubmit = (data: TRegisterForm) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/auth/login');
      },
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='mb-4 flex flex-col gap-5'>
        <Field control={control} name='full_name' label='Full Name'>
          <Textfield label='Full Name' error={errors.full_name?.message} />
        </Field>

        <Field control={control} name='email' label='Email'>
          <Textfield label='Email' error={errors.email?.message} />
        </Field>

        <Field control={control} name='phone' label='Phone'>
          <Textfield label='Phone' error={errors.phone?.message} />
        </Field>

        <Field control={control} name='password' label='Password'>
          <Textfield
            label='Password'
            type='password'
            error={errors.password?.message}
          />
        </Field>

        <Field
          control={control}
          name='confirmPassword'
          label='Confirm Password'>
          <Textfield
            label='Confirm Password'
            type='password'
            error={errors.confirmPassword?.message}
          />
        </Field>
      </div>

      <Button
        type='submit'
        className='w-full bg-[#0D4949] py-3 text-white'
        onClick={handleSubmit(onSubmit)}>
        Register
      </Button>

      <div className='text-muted-foreground text-center text-sm text-[17px]'>
        Have an account?{' '}
        <Link href='/auth/login' className='text-primary hover:underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
