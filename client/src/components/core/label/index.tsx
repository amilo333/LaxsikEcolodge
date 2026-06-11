import { clsx } from 'clsx';
import type { TLabelProps } from './type';

export default function Label(props: TLabelProps) {
  const { className = '', required = false, children } = props;

  //! [JSX Section]
  return (
    <div className={clsx('c_label-container', 'flex gap-1', className)}>
      <span className='font-semibold text-sm'>{children}</span>
      {required && <span className='text-error'>*</span>}
    </div>
  );
}
