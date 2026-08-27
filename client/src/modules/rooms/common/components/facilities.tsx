import { FACILITES } from '../constants/facilites';
import Image from 'next/image';

export function Facilities() {
  return (
    <section className='flex min-h-[250px] flex-col items-center justify-center gap-5 bg-[#0D4949] px-4 py-8 text-white sm:gap-7 sm:px-6 sm:py-10'>
      <div className='text-center'>
        <p className='text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase'>
          Everything you need
        </p>
        <h2 className='font-lora mt-2 text-2xl font-semibold sm:text-[32px]'>
          FACILITIES
        </h2>
      </div>

      <div className='flex w-full max-w-[1180px] flex-wrap justify-center gap-3 sm:gap-4 lg:grid lg:grid-cols-7'>
        {FACILITES.map((facility) => {
          return (
            <div
              key={facility.id}
              className='flex min-h-[78px] w-[calc(50%-6px)] min-w-0 flex-col items-center justify-center gap-2 px-2 py-2 sm:w-[calc(25%-12px)] lg:w-auto'>
              <Image
                height={40}
                width={40}
                alt={facility.name}
                src={facility.image}
                className='h-9 w-9 object-contain opacity-90 sm:h-10 sm:w-10'
              />
              <div className='text-center text-[10px] font-semibold tracking-[0.04em] uppercase sm:text-[11px]'>
                {facility.name}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
