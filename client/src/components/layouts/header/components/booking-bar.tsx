'use client';
import { Button, DatePicker, Field } from '@/components/core';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { TBookingBarFindForm, TBookingBarProps } from '../types';
import { today, getLocalTimeZone } from '@internationalized/date';
import GuestSelect, {
  TGuestSelection,
} from '@/components/core/form/GuestSelect';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTERS } from '@/routers';
import { useTranslations } from 'next-intl';

export function BookingBar(props: TBookingBarProps) {
  const { onClickHide } = props;
  const t = useTranslations('BookingBar');
  const router = useRouter();
  const [guest, setGuest] = useState<TGuestSelection>({ room: 1, person: 2 });
  const [dateError, setDateError] = useState<string>();
  const currentDate = today(getLocalTimeZone());

  const { control, handleSubmit } = useForm<TBookingBarFindForm>({
    defaultValues: {
      checkinDate: currentDate,
      checkoutDate: currentDate.add({ days: 1 }),
    },
  });
  const checkinDate = useWatch({ control, name: 'checkinDate' });

  const handleFindNow = (data: TBookingBarFindForm) => {
    const { checkinDate, checkoutDate } = data;

    if (!checkinDate || !checkoutDate) {
      setDateError(t('errors.requiredDates'));
      return;
    }

    if (checkinDate.compare(currentDate) < 0) {
      setDateError(t('errors.pastCheckIn'));
      return;
    }

    if (checkoutDate.compare(checkinDate) <= 0) {
      setDateError(t('errors.invalidCheckOut'));
      return;
    }

    setDateError(undefined);

    const params = new URLSearchParams({
      checkInDate: checkinDate.toString(),
      checkOutDate: checkoutDate.toString(),
      guests: String(guest.person),
      rooms: String(guest.room),
    });

    router.push(`${ROUTERS.ROOM.LIST}?${params.toString()}`);
    onClickHide();
  };

  return (
    <div className='absolute top-[146%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 bg-white px-[48px] pt-5 shadow-lg'>
      <div className='flex items-center gap-[10px]'>
        <div className='flex w-[80%] gap-[10px]'>
          <Field control={control} name='checkinDate' label={t('checkIn')}>
            <DatePicker label={t('checkIn')} minValue={currentDate} />
          </Field>

          <Field control={control} name='checkoutDate' label={t('checkOut')}>
            <DatePicker
              label={t('checkOut')}
              minValue={
                checkinDate
                  ? checkinDate.add({ days: 1 })
                  : currentDate.add({ days: 1 })
              }
            />
          </Field>

          <GuestSelect value={guest} onChange={setGuest} />
        </div>

        <Button
          className='h-[48px] w-[148px]! text-lg!'
          onClick={handleSubmit(handleFindNow)}>
          {t('findNow')}
        </Button>

        <div className='absolute top-[-6px] right-[142px] flex flex-col items-center'>
          <Image
            src='/images/chevron_down.png'
            alt={t('collapse')}
            width={12}
            height={6}
            className='h-[6px] w-[12px] rotate-180 brightness-0 contrast-[300%] invert'
          />

          <Button
            variant='danger'
            className='h-[24px] w-[90px] bg-white text-[14px]! text-black!'
            onClick={onClickHide}>
            {t('hide')}
          </Button>
        </div>
      </div>
      {dateError && (
        <p className='mt-2 text-sm text-red-700' role='alert'>
          {dateError}
        </p>
      )}
    </div>
  );
}
