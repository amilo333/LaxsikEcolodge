import { ListBox, Select as SelectHero } from '@heroui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { Label } from '../../label';
import { TSelectProps } from './type';

export default function Select(props: TSelectProps) {
  const { field, label, options, ...rest } = props;

  return (
    <SelectHero
      {...field}
      {...rest}
      className='w-full'
      placeholder='Select one'>
      <Label>{label}</Label>
      <SelectHero.Trigger
        className={clsx(
          'flex h-[48px] items-center justify-between rounded-none'
        )}>
        <SelectHero.Value />
        <Image
          src='/images/icon/ic_chevron_down.png'
          alt='arrow'
          height={10}
          width={18}
          className='h-[10px] w-[18px]'
        />
      </SelectHero.Trigger>
      <SelectHero.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </SelectHero.Popover>
    </SelectHero>
  );
}
