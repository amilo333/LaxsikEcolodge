'use client';
import { Slider } from '@/components/layouts';

const slides = [
  {
    imageSrc: '/images/rooms/room.png',
    title: 'DELUCY BALCONY',
    description:
      'The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower.',
  },
  {
    imageSrc: '/images/rooms/room.png',
    title: 'SEA VIEW ROOM',
    description:
      'Enjoy a beautiful view of the sea and unwind in a relaxing atmosphere with modern amenities.',
  },
  {
    imageSrc: '/images/rooms/room.png',
    title: 'FAMILY SUITE',
    description:
      'A comfortable suite designed for families with extra space and premium comfort.',
  },
  {
    imageSrc: '/images/rooms/room.png',
    title: 'FAMILY SUITE',
    description:
      'A comfortable suite designed for families with extra space and premium comfort.',
  },
  {
    imageSrc: '/images/rooms/room.png',
    title: 'FAMILY SUITE',
    description:
      'A comfortable suite designed for families with extra space and premium comfort.',
  },
  {
    imageSrc: '/images/rooms/room.png',
    title: 'FAMILY SUITE',
    description:
      'A comfortable suite designed for families with extra space and premium comfort.',
  },
];

export default function Test() {
  return (
    <div className='p-8'>
      <Slider slides={slides} slidesPerView={5} spaceBetween={36} />
    </div>
  );
}
