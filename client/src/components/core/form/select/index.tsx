import { ListBox, Select as SelectHero } from '@heroui/react';
import Image from 'next/image';
import Label from '../../label';
import { TSelectProps } from './type';
export default function Select(props: TSelectProps) {
  const { label } = props;

  return (
    <SelectHero className='w-[256px]' placeholder='Select one'>
      <Label>{label}</Label>
      <SelectHero.Trigger className='flex items-center justify-between rounded-none'>
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
          <ListBox.Item id='florida' textValue='Florida'>
            Florida
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='delaware' textValue='Delaware'>
            Delaware
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='california' textValue='California'>
            California
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='texas' textValue='Texas'>
            Texas
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='new-york' textValue='New York'>
            New York
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='washington' textValue='Washington'>
            Washington
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </SelectHero.Popover>
    </SelectHero>
  );
}
