'use client';

import { TextArea } from '@heroui/react';
import clsx from 'clsx';
import { Label } from '../../label';
import { TTextAreaProps } from './type';

export default function Textarea(props: TTextAreaProps) {
  const { label, error, field, required, className, inputClassName, ...rest } =
    props;

  return (
    <div
      className={clsx(
        'c_textfield-container flex w-full flex-col gap-1.5',
        className
      )}>
      <Label required={required}>{label}</Label>
      <TextArea
        {...field}
        {...rest}
        className={clsx(
          'bg-light border-input-border hover:border-input-border-hover focus:border-input-border-focus h-50 rounded-none border shadow-none focus:ring-0',
          inputClassName
        )}
      />
      {error && <small className='text-error'>{error}</small>}
    </div>
  );
}
