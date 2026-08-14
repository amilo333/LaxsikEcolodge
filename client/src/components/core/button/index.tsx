'use client';
import { Button as HeroButton } from '@heroui/react';
import { TButtonProps } from './type';
import clsx from 'clsx';

export function Button(props: TButtonProps) {
  const { className = '', children, onClick, ...rest } = props;

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div>
      <HeroButton
        {...rest}
        className={clsx(
          className,
          'h-12 w-full rounded-full bg-[#0D4949] text-[20px] font-semibold text-white'
        )}
        onPress={handleClick}>
        {children}
      </HeroButton>
    </div>
  );
}
