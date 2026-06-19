'use client';
import { Button as HeroButton } from '@heroui/react';
import { TButtonProps } from './type';

export default function Button(props: TButtonProps) {
  const { children } = props;
  return (
    <div>
      <HeroButton className='h-12 w-full rounded-none bg-[#0D4949] text-[20px] font-semibold text-white'>
        {children}
      </HeroButton>
    </div>
  );
}
