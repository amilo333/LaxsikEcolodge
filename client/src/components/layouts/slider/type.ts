import { SwiperClass, SwiperProps } from 'swiper/react';

export type TSliderProps = SwiperProps & {
  slides?: TSlideCard[];
  slideClassName?: string;
  slidesPerView?: number;
  renderSlide?: () => React.ReactNode;
  onSlideChange?: (swiper: SwiperClass) => void;
  onSwiper?: (swiper: SwiperClass) => void;
};

export type TSlideCard = {
  id?: string | number;
  imageSrc: string;
  title: string;
  description: string;
  className?: string;
};
