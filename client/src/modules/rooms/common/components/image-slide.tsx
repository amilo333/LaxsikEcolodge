'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type ImageSliderProps = {
  images: string[];
  title?: string;
};

export function ImageSlider({ images, title }: ImageSliderProps) {
  const initialIndex = Math.floor(images.length / 2);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
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

    emblaApi.on('select', onSelect).on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) {
    return null;
  }

  return (
    <section className='w-full overflow-hidden py-6 md:py-10'>
      {title && (
        <h2 className='font-lora mb-6 text-center text-[32px] font-semibold text-[#0D4949] uppercase md:mb-8'>
          {title}
        </h2>
      )}

      <div ref={emblaRef} className='w-full overflow-hidden'>
        <div className='flex items-center'>
          {images.map((image, index) => {
            const isActive = selectedIndex === index;

            return (
              <div
                key={`${image}-${index}`}
                className='flex min-w-0 flex-[0_0_auto] items-center justify-center px-3 md:px-4'>
                <div
                  className={`relative overflow-hidden transition-all duration-500 ease-out ${
                    isActive
                      ? 'z-20 h-[min(467px,60vw)] w-[min(700px,90vw)]'
                      : 'z-10 mt-[40px] h-[min(373px,48vw)] w-[min(560px,72vw)]'
                  }`}>
                  <Image
                    src={image}
                    alt={`Room gallery ${index + 1}`}
                    fill
                    sizes='(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 700px'
                    quality={90}
                    className='object-cover'
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
