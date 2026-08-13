'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type SlideImageProps = {
  images?: string[];
  title?: string;
  className?: string;
};

const DEFAULT_IMAGES = [
  '/images/dinning/dining-1.jpg',
  '/images/dinning/dining-2.jpg',
  '/images/dinning/dining-3.jpg',
  '/images/dinning/dining-4.jpg',
  '/images/dinning/dinning-even-big.png',
  '/images/dinning/dinning-odd-big.png',
];

export function SlideImage({
  images = DEFAULT_IMAGES,
  title = "MUONG HOA'S GALLERY",
  className = '',
}: SlideImageProps) {
  const initialIndex = Math.floor(images.length / 2);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    startIndex: initialIndex,
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('init', onSelect).on('reInit', onSelect).on('select', onSelect);

    return () => {
      emblaApi
        .off('init', onSelect)
        .off('reInit', onSelect)
        .off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      className={`relative w-full overflow-hidden bg-white py-12 select-none md:py-20 ${className}`}>
      <div className='relative z-10 flex w-full flex-col items-center gap-8 md:gap-12'>
        {/* Title */}
        {title && (
          <h2 className='font-lora text-center text-2xl font-bold tracking-wider text-[#0D4949] uppercase md:text-3xl lg:text-[32px]'>
            {title}
          </h2>
        )}

        {/* Embla Carousel Viewport */}
        <div
          className='w-full cursor-grab overflow-hidden py-4 active:cursor-grabbing'
          ref={emblaRef}>
          <div className='flex touch-pan-y items-center justify-center gap-4 md:gap-6'>
            {images.map((img, index) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={index}
                  className='flex flex-none items-center justify-center transition-all duration-500'
                  style={{
                    flex: isActive
                      ? '0 0 min(800px, 60vw)'
                      : '0 0 min(600px, 42vw)',
                  }}>
                  <div
                    className={`relative overflow-hidden bg-white transition-all duration-500 ${
                      isActive
                        ? 'z-10 h-[280px] w-full shadow-2xl ring-1 ring-black/5 sm:h-[380px] md:h-[480px] lg:h-[540px]'
                        : 'z-0 h-[230px] w-full opacity-80 shadow-md sm:h-[310px] md:h-[400px] lg:h-[450px]'
                    }`}>
                    <Image
                      src={img}
                      alt={`${title} - image ${index + 1}`}
                      fill
                      className='object-cover transition-transform duration-700 hover:scale-105'
                      sizes='(max-width: 768px) 80vw, 800px'
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
