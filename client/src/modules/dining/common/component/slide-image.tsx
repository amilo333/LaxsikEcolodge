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
    loop: false,
    align: 'center',
    containScroll: false,
    startIndex: initialIndex,
  });

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) return null;

  return (
    <section
      className={`relative w-full overflow-hidden select-none ${className}`}>
      <div className='relative z-10 my-30 flex w-full flex-col items-center gap-8 md:gap-12'>
        {/* TITLE */}
        {title && (
          <h2 className='font-lora text-center text-[32px] font-semibold text-[#0D4949] uppercase'>
            {title}
          </h2>
        )}

        {/* VIEWPORT */}
        <div ref={emblaRef} className='w-full overflow-hidden py-4'>
          {/* CONTAINER */}
          <div className='flex items-center gap-4 md:gap-6'>
            {images.map((img, index) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={`${img}-${index}`}
                  className={`flex flex-[0_0_auto] items-center justify-center transition-all duration-500 ease-out ${
                    isActive
                      ? 'w-[80vw] max-w-[800px]'
                      : 'w-[60vw] max-w-[600px]'
                  } `}>
                  <div
                    className={`relative w-full overflow-hidden bg-white transition-all duration-500 ease-out ${
                      isActive
                        ? 'z-20 h-[280px] shadow-2xl sm:h-[380px] md:h-[480px] lg:h-[540px]'
                        : 'z-10 mt-[40px] h-[230px] opacity-80 shadow-md sm:h-[310px] md:h-[400px] lg:h-[450px]'
                    } `}>
                    <Image
                      src={img}
                      alt={`${title} - image ${index + 1}`}
                      fill
                      sizes='
                        (max-width: 640px) 80vw,
                        (max-width: 1024px) 60vw,
                        800px
                      '
                      className='object-cover transition-transform duration-700 hover:scale-105'
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
