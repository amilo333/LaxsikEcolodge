'use client';

import { Button as HeroButton } from '@heroui/react';
import clsx from 'clsx';
import { TButtonProps } from './type';

export default function Button(props: TButtonProps) {
  const { children, className } = props;

  return (
    <HeroButton
      className={clsx(
        'h-12 w-full rounded-none bg-[#0D4949] text-[20px] font-semibold text-white',
        className
      )}>
      {children}
    </HeroButton>
  );
}
