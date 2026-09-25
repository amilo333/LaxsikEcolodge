'use client';
import { Button, DatePicker, Field } from '@/components/core';
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
    <div className='absolute inset-x-0 top-full z-30 border-t border-[#DCE7E3] bg-white px-4 py-4 text-[#151515] shadow-[0_20px_45px_rgba(4,45,43,0.18)] sm:px-6 lg:px-12'>
      <div className='mx-auto max-w-[1500px]'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(240px,0.8fr)_148px] xl:items-end'>
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

          <Button
            className='h-12! w-full! text-base! md:col-span-2 xl:col-span-1'
            onClick={handleSubmit(handleFindNow)}>
            {t('findNow')}
          </Button>
        </div>
        {dateError && (
          <p className='mt-2 text-sm text-red-700' role='alert'>
            {dateError}
          </p>
        )}
      </div>
      <button
        type='button'
        onClick={onClickHide}
        aria-label={t('collapse')}
        className='absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF4F2] text-lg text-[#0D4949] transition hover:bg-[#DCE9E5] sm:top-3 sm:right-3'>
        ×
      </button>
    </div>
  );
}
