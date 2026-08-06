import { Button } from '@/components/core';
import Image from 'next/image';

export function RoomCard() {
  return (
    <div className='flex h-[433px] w-[1600px] items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-[24px] px-[56px] py-[44px]'>
        <div className='font-lora flex items-center gap-2 text-[32px] font-semibold uppercase'>
          Deluxe Double Room with Balcony{' '}
        </div>
        <div className='flex flex-col gap-[28px] text-[18px]'>
          <div className='font-montserrat text-center text-[18px]'>
            Acenturies ago in Sa Pa appeared a mysterious tribe; they built
            their houses on the high mountains where the terrain is dangerous
            and turned those places into arable land of their tribe. Day after
            day, they became the largest tribe in Sapa. Al the scenes of that
            beautiful painting helped us to conceptualize Lasik Ecolodge
            following the original of an early 20th-century H&apos;Mong village
            right in the heart of Muong Hoa Valley.
          </div>
        </div>
        <hr className='h-0.1 w-full bg-[#ccc]' />
        <div className='flex flex-col items-center justify-between gap-2'>
          <div className='flex items-center gap-2 text-[18px]'>
            <div>Avg. price per night</div>
            <div className='text-[32px] font-bold'>$ 100.00</div>
          </div>
          <Button className='h-[71px]! w-[260px]! text-[28px]!'>
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
