import type { SelectProps as HeroSelectProps } from '@heroui/react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TFieldState } from '../field/type';

export type TSelectOption = {
  id: string;
  label: string;
};

export type TSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TFieldState<TFieldValues, TName> &
  Omit<
    HeroSelectProps<TSelectOption>,
    'value' | 'defaultValue' | 'onValueChange'
  > & {
    label: string;
    options: TSelectOption[];
  };
