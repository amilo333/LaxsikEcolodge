import Image from 'next/image';
import { DetailFacilities, ImageSlider, RoomCard, TRoom } from '../common';
import { ContactCta } from '@/components/layouts/contact-cta';
import { SlideRoom } from '../common/components/slide-room';
import { Footer } from '@/components/layouts';

type DetailRoomModuleProps = {
  room: TRoom;
};

export function DetailRoomModule({ room }: DetailRoomModuleProps) {
  return (
    <div>
      <div className='relative'>
        <Image
          height={400}
          width={1600}
          src='/images/rooms/room_img.png'
          alt='room-detail'
          className='h-200 w-full object-cover'
        />

        <div className='absolute top-162.5 left-1/2 -translate-x-1/2'>
          <RoomCard />
        </div>
      </div>
      <div className='mt-110'>
        <ImageSlider images={room.images} title='Room’s Gallery' />
      </div>
      <DetailFacilities room={room} />
      <ContactCta />
      <SlideRoom />
      <Footer />
    </div>
  );
}
