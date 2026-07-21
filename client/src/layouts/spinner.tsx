import { Spinner } from '@heroui/react';

export function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Spinner size='lg' />
    </div>
  );
}
