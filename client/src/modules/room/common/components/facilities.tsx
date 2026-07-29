import React from 'react';
import { FACILITES } from '../constants/facilites';
import Image from 'next/image';

export function Facilities() {
  return (
    <div className='flex h-[356px] flex-col items-center justify-center gap-[44px] bg-[#0D4949] text-white'>
      <div className='font-times text-center text-[32px]'>FACILITIES</div>
      <div className='flex gap-[24px]'>
        {FACILITES.map((facility) => {
          return (
            <div
              key={facility.id}
              className='flex min-w-[165px] flex-col items-center justify-center gap-2'>
              <Image
                height={20}
                width={20}
                alt={facility.name}
                src={facility.image}
                className='h-12 w-12'
              />
              <div className='text-[18px] uppercase'>{facility.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
