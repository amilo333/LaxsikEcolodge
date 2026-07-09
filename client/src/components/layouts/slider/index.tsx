'use client';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Card } from '@/components/core';
import { TSliderProps } from './type';

export function Slider(props: TSliderProps) {
  const { renderSlide, slides } = props;

  const renderSlides = () => {
    if (renderSlide) {
      return renderSlide();
    }

    if (!slides?.length) {
      return null;
    }

    return slides.map((slide, index) => (
      <SwiperSlide key={slide.id ?? `${slide.title}-${index}`}>
        <Card
          className={slide.className ?? 'h-164 w-120'}
          imageSrc={slide.imageSrc}
          title={slide.title}
          description={slide.description}
        />
      </SwiperSlide>
    ));
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={4}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}>
      {/* {renderSlide && renderSlide()} */}
      {renderSlides()}
      {/* <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide>
      <SwiperSlide>
        <Card
          className='h-[656px] w-[480px]'
          imageSrc='./images/rooms/room.png'
          title='DELUCY BACONY'
          description='The spacious double room features air conditioning, a private entrance, a terrace with garden views as well as a private bathroom boasting a shower. The unit has 1 bed.'
        />
      </SwiperSlide> */}
    </Swiper>
  );
}
