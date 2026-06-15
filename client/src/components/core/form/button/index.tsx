'use client';
import { Button } from '@heroui/react';
import { TButtonProps } from './type';

export default function ButtonF(props: TButtonProps) {
  const { text } = props;
  return (
    <div>
      <Button className='h-12 w-full rounded-none bg-[#0D4949] text-[20px] font-semibold text-white'>
        {text}
      </Button>
    </div>
  );
}
