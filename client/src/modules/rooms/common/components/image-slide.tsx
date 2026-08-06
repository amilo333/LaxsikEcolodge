'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

type ImageSliderProps = {
  images: string[];
  title?: string;
};

export function ImageSlider({ images, title }: ImageSliderProps) {
  return (
    <div className='mx-auto w-full overflow-hidden'>
      {title && (
        <h2 className='font-lora mb-10 text-center text-[32px] font-semibold text-[#0D4949] uppercase'>
          {title}
        </h2>
      )}

      <Swiper
        centeredSlides
        loop
        slidesPerView={3}
        spaceBetween={30}
        className='overflow-visible!'>
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className='flex! w-full items-center! justify-center!'>
            {({ isActive }) => (
              <div
                className={`relative overflow-hidden transition-all duration-500 ${
                  isActive ? 'h-[600px] w-[900px]' : 'mt-12 h-[480px] w-[720px]'
                }`}>
                <Image src={image} alt='' fill className='object-cover' />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
