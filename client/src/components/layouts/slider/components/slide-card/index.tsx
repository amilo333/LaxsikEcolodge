import React from 'react';
import { TSlideCardProps } from './type';
import Image from 'next/image';
import { Button } from '@/components/core';

export function SlideCard(props: TSlideCardProps) {
  const { img, title, description, onClick, isActive } = props;

  return (
    <div className='h-inherit flex flex-col shadow-[0_4px_28px_rgba(0,0,0,0.15)]'>
      {img && (
        <div className='relative h-70 w-full overflow-hidden'>
          <Image
            src={img}
            alt={title || 'Slide Image'}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover'
          />
        </div>
      )}
      <div className='flex flex-col gap-6 px-8 py-6'>
        <div className='flex flex-col gap-4'>
          {title && <p className='text-center text-2xl font-bold'>{title}</p>}
          {description && isActive && (
            <p className='text-center'>{description}</p>
          )}
        </div>
        {isActive && <Button onClick={onClick}>Learn More</Button>}
      </div>
    </div>
  );
}
