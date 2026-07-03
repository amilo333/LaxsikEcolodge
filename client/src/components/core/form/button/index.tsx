'use client';
import { Button as HeroButton } from '@heroui/react';
import { TButtonProps } from './type';
import clsx from 'clsx';

export default function Button(props: TButtonProps) {
  const { className = '', children } = props;
  return (
    <div>
      <HeroButton
        className={clsx(
          'h-12 w-full rounded-none bg-[#0D4949] text-[20px] font-semibold text-white',
          className
        )}>
        {children}
      </HeroButton>
    </div>
  );
}
