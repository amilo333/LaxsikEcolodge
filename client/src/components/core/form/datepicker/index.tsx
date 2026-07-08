'use client';
import Image from 'next/image';
import Label from '../../label';
import {
  Calendar,
  DateField,
  DatePicker as DatePickerHero,
} from '@heroui/react';
import { TDatePickerProps } from './type';

export default function DatePicker(props: TDatePickerProps) {
  const { label } = props;

  return (
    <DatePickerHero className='h-24 w-full' name='date'>
      <Label>{label}</Label>
      <DateField.Group fullWidth className='rounded-none!'>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePickerHero.Trigger>
            <Image
              src='/images/icon/ic_calendar.png'
              alt='calendar'
              width={20}
              height={20}
            />
          </DatePickerHero.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePickerHero.Popover>
        <Calendar aria-label='Event date'>
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot='previous' />
            <Calendar.NavButton slot='next' />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePickerHero.Popover>
    </DatePickerHero>
  );
}
