import { Input } from '@heroui/react';
import clsx from 'clsx';
import Label from '../../label';
import { TTextfieldProps } from './type';

export default function Textfield(props: TTextfieldProps) {
  const { label, error, field, required, ...rest } = props;

  return (
    <div
      className={clsx('c_textfield-container', 'flex flex-col gap-1.5 w-full')}
    >
      <Label required={required}>{label}</Label>
      <Input
        {...field}
        {...rest}
        className={clsx(
          'bg-light border border-input-border rounded-none shadow-none focus:ring-0 hover:border-input-border-hover focus:border-input-border-focus',
        )}
      />
      {error && <small className="text-error">{error}</small>}
    </div>
  );
}
