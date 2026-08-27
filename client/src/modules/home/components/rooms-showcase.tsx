import { SlideRoom } from '@/modules/rooms/common/components';
import { Suspense } from 'react';
import { SectionHeading } from './section-heading';

export function RoomsShowcase() {
  return (
    <section className='bg-white py-16 lg:py-24'>
      <div className='px-4 sm:px-6'>
        <SectionHeading
          eyebrow='Stay close to nature'
          title='Rooms & Suites'
          description='Room information, images and prices below are loaded directly from the current room system.'
        />
      </div>

      <div className='mt-8 w-full'>
        <Suspense
          fallback={
            <div className='flex min-h-[520px] items-center justify-center text-sm text-[#60746F]'>
              Loading rooms...
            </div>
          }>
          <SlideRoom currentRoomId='' title='' />
        </Suspense>
      </div>
    </section>
  );
}
