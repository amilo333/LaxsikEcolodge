import { Button } from '@/components/core';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRoomDetailApi } from '../hooks';

export function RoomCard() {
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data, isLoading, isError } = useRoomDetailApi(id);

  return (
    <div className='flex h-[433px] w-[1600px] items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-[24px] px-[56px] py-[44px]'>
        <div className='font-lora flex items-center gap-2 text-[32px] font-semibold uppercase'>
          {data?.title || 'Deluxe Double Room with Balcony'}
        </div>
        <div className='flex flex-col gap-[28px] text-[18px]'>
          <div className='font-montserrat text-center text-[18px]'>
            {data?.description}
          </div>
        </div>
        <hr className='h-0.1 w-full bg-[#ccc]' />
        <div className='flex flex-col items-center justify-between gap-2'>
          <div className='flex items-center gap-2 text-[18px]'>
            <div>Avg. price per night</div>
            <div className='text-[32px] font-bold'>
              {data?.price ? `$ ${data.price.toFixed(2)}` : '$ 100.00'}
            </div>
          </div>
          <Button className='h-[71px]! w-[260px]! text-[28px]!'>
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
