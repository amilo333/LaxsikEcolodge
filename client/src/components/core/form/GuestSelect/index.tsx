'use client';

import { useState } from 'react';
import { Popover, Button } from '@heroui/react';
import clsx from 'clsx';
import Image from 'next/image';

export type TGuestSelection = {
  room: number;
  person: number;
};

type TGuestSelectProps = {
  label?: string;
  className?: string;
  value?: TGuestSelection;
  onChange?: (guest: TGuestSelection) => void;
};

type TGuestRowProps = {
  label: string;
  value: number;
  min: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function GuestSelect({
  label = 'Guest',
  className,
  value,
  onChange,
}: TGuestSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [internalGuest, setInternalGuest] = useState<TGuestSelection>({
    room: 1,
    person: 2,
  });

  const guest = value ?? internalGuest;

  const handleChange = (type: keyof TGuestSelection, nextValue: number) => {
    const nextGuest = {
      ...guest,
      [type]: nextValue,
    };

    setInternalGuest(nextGuest);
    onChange?.(nextGuest);
  };

  const summary = `${guest.person} Person - ${guest.room} Room`;

  return (
    <div className={clsx('flex w-full flex-col gap-0.5', className)}>
      {/* Label */}
      <div className='font-Montserrat text-[14px] font-semibold'>{label}</div>

      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        {/* Trigger */}
        <Popover.Trigger className='w-full'>
          <button
            type='button'
            className={clsx(
              'flex h-[48px] w-full items-center justify-between gap-2 rounded-[14px] bg-white px-5 shadow-md',
              'transition-colors duration-150',
              isOpen ? 'border border-[#0D4949]' : 'border border-transparent'
            )}>
            <span className='font-Montserrat text-[14px]'>{summary}</span>

            <Image
              src='/images/icon/ic_chevron_down.png'
              alt='arrow'
              width={18}
              height={10}
              className='h-[10px] w-[18px]'
            />
          </button>
        </Popover.Trigger>

        {/* Popup */}
        <Popover.Content
          placement='bottom'
          offset={0}
          className={clsx(
            'w-[var(--trigger-width)]',
            'rounded-[14px] bg-white shadow-lg',

            // Animation mở
            'data-[entering]:animate-in',
            'data-[entering]:slide-in-from-top-3',
            'data-[entering]:fade-in-0',

            // Animation đóng
            'data-[exiting]:animate-out',
            'data-[exiting]:slide-out-to-top-3',
            'data-[exiting]:fade-out-0',

            'duration-200 ease-out'
          )}>
          <Popover.Dialog>
            <div className='w-full'>
              {/* Room */}
              <GuestRow
                label='Room'
                value={guest.room}
                min={1}
                onDecrease={() => handleChange('room', guest.room - 1)}
                onIncrease={() => handleChange('room', guest.room + 1)}
              />

              {/* Person */}
              <GuestRow
                label='Person'
                value={guest.person}
                min={1}
                onDecrease={() => handleChange('person', guest.person - 1)}
                onIncrease={() => handleChange('person', guest.person + 1)}
              />

              {/* Divider + Done */}
              <div className='mt-4 flow-root border-t border-gray-200 pt-5'>
                <Button
                  type='button'
                  onPress={() => setIsOpen(false)}
                  className='float-right ml-auto h-[48px] w-[148px] rounded-full bg-[#0D4949] text-[18px] font-semibold text-white'>
                  DONE
                </Button>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

function GuestRow({
  label,
  value,
  min,
  onDecrease,
  onIncrease,
}: TGuestRowProps) {
  const isMin = value <= min;

  return (
    <div className='flex h-[56px] items-center justify-between'>
      {/* Label */}
      <span className='font-Montserrat text-[16px]'>{label}</span>

      {/* Counter */}
      <div className='flex items-center gap-6'>
        {/* Minus */}
        <button
          type='button'
          onClick={onDecrease}
          disabled={isMin}
          className={clsx(
            'flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-200',
            'transition-opacity duration-150',
            isMin ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
          )}>
          <span className='text-[28px] leading-none font-light text-[#0D4949]'>
            −
          </span>
        </button>

        {/* Value */}
        <span className='w-[24px] text-center text-[18px] font-semibold'>
          {value}
        </span>

        {/* Plus */}
        <button
          type='button'
          onClick={onIncrease}
          className='flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-200 transition-opacity duration-150'>
          <span className='text-[28px] leading-none font-light text-[#0D4949]'>
            +
          </span>
        </button>
      </div>
    </div>
  );
}
