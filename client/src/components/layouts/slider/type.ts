export type TSlideCard = {
  id?: string | number;
  imageSrc: string;
  title: string;
  description: string;
  className?: string;
};

export type TSliderProps = {
  renderSlide?: () => React.ReactNode;
  slides?: TSlideCard[];
};
