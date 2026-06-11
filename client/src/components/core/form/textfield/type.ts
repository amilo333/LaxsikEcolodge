import { InputRootProps } from '@heroui/react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TFieldState } from '../field/type';

export type TTextfieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TFieldState<TFieldValues, TName> &
  InputRootProps & {
    // Label for the text field
    label: string;
    // Type of the text field
    type?: 'text' | 'password';
    // Error message
    error?: string;
  };
