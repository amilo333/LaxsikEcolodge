import { FieldPath, FieldValues } from 'react-hook-form';
import { TFieldState } from '../field/type';

export type TDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TFieldState<TFieldValues, TName> & {
  label: string;
  required?: boolean;
  error?: string;
};
