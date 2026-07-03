import { Input } from '@heroui/react';
import clsx from 'clsx';
import Label from '../../label';
import { TTextfieldProps } from './type';

export default function Textfield(props: TTextfieldProps) {
  const { label, error, field, required, ...rest } = props;

  return (
    <div
      className={clsx('c_textfield-container', 'flex w-full flex-col gap-1')}>
      <Label required={required}>{label}</Label>
      <Input
        {...field}
        {...rest}
        className={clsx(
          'bg-input-background border-input-border hover:border-input-border-hover focus:border-input-border-focus h-[48px] rounded-none border-none shadow focus:ring-0'
        )}
      />
      {error && <small className='text-error'>{error}</small>}
    </div>
  );
}
