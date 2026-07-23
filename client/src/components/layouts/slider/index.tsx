'use client';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { TSliderProps } from './type';
import { SlideCard } from './components';
import { useState } from 'react';

export function Slider(props: TSliderProps) {
  const {
    slides,
    slidesPerView = 3,
    spaceBetween = 50,
    renderSlide,
    onSlideChange,
    onSwiper,
    ...rest
  } = props;

  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.realIndex ?? swiper.activeIndex;
    setActiveSlide(nextIndex);
    onSlideChange?.(swiper);
  };

  const handleSwiper = (swiper: SwiperClass) => {
    const nextIndex = swiper.realIndex ?? swiper.activeIndex;
    setActiveSlide(nextIndex);
    onSwiper?.(swiper);
  };

  const renderSlides = () => {
    if (renderSlide) {
      return renderSlide();
    }

    if (!slides?.length) {
      return null;
    }

    return slides.map((slide, index) => (
      <SwiperSlide key={index} className='py-4'>
        <SlideCard
          img={slide.imageSrc}
          title={slide.title}
          description={slide.description}
          isActive={activeSlide === index}
        />
      </SwiperSlide>
    ));
  };

  return (
    <Swiper
      {...rest}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      centeredSlides={true}
      // autoHeight={true}
      loop={true}
      onSlideChange={handleSlideChange}
      onSwiper={handleSwiper}>
      {renderSlides()}
    </Swiper>
  );
}
