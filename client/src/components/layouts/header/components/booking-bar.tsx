'use client';
import {
  Button,
  DatePicker,
  Field,
  Select,
  Textfield,
} from '@/components/core';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { TBookingBarFindForm } from '../types';

export function BookingBar() {
  const { control, handleSubmit } = useForm<TBookingBarFindForm>({
    defaultValues: {
      checkinDate: '',
      checkoutDate: '',
      promoCode: '',
      guest: '',
    },
  });

  const handleFindNow = (data: TBookingBarFindForm) => {
    console.log(data);
  };

  return (
    <div className='absolute top-[160%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 bg-white px-[56px] py-[24px] shadow-lg'>
      <div className='flex items-center gap-[10px]'>
        <div className='flex w-[80%] gap-[10px]'>
          <Field control={control} name='checkinDate' label='Checkin Date'>
            <DatePicker label='Checkin Date' />
          </Field>

          <Field control={control} name='checkoutDate' label='Checkout Date'>
            <DatePicker label='Checkout Date' />
          </Field>

          <Field control={control} name='guest' label='Guest'>
            <Select
              label='Guest'
              options={[
                { id: '1 room', label: '1 room' },
                { id: '2 rooms', label: '2 rooms' },
                { id: '3 rooms', label: '3 rooms' },
                { id: '4 rooms', label: '4 rooms' },
              ]}
            />
          </Field>

          <Field control={control} label='Promo Code' name='promoCode'>
            <Textfield label='Promo Code' placeholder='Enter code' />
          </Field>
        </div>

        <Button
          className='h-[52px] w-[185px]!'
          onClick={handleSubmit(handleFindNow)}>
          FIND NOW
        </Button>

        <div className='absolute top-[-6px] right-[142px] flex flex-col items-center'>
          <Image
            src='/images/chevron_down.png'
            alt='down'
            width={12}
            height={6}
            className='h-[6px] w-[12px] rotate-180 brightness-0 contrast-[300%] invert'
          />

          <Button
            variant='danger'
            className='h-[24px] w-[90px] bg-white text-sm! text-black!'>
            HIDE
          </Button>
        </div>
      </div>
    </div>
  );
}
