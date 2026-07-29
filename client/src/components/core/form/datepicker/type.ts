import { FieldPath, FieldValues } from 'react-hook-form';
import { TFieldState } from '../field/type';

import type {
  DateValue,
  DatePickerProps as HeroDatePickerProps,
} from '@heroui/react';

export type TDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TFieldState<TFieldValues, TName> &
  Omit<
    HeroDatePickerProps<DateValue>,
    'value' | 'defaultValue' | 'onChange'
  > & {
    label: string;
    required?: boolean;
    error?: string;
  };
