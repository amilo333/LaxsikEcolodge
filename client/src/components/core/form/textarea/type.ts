import { TextAreaRootProps } from '@heroui/react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { TFieldState } from '../field/type';

export type TTextAreaProps<
  TFieldValues /*đại điện cho dữ liệu form*/ extends FieldValues = FieldValues, //generic type 1
  TName /*lấy các key hợp lệ*/ extends FieldPath<TFieldValues> =
    FieldPath<TFieldValues>, //generic type 2
> = TFieldState<TFieldValues, TName> &
  TextAreaRootProps & {
    //Nó chứa tất cả props của component TextArea.
    // Label for the text field
    label: string;
    // Type of the text field
    type?: 'text' | 'password';
    // Error message
    error?: string;
  };
