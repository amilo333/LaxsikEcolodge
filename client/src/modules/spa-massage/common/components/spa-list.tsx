import Image from 'next/image';
import React from 'react';
type TSpaItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
};
type SpaListProps = {
  spa?: TSpaItem[];
  className?: string;
  children?: React.ReactNode;
};

export function SpaList({ spa = [], className = '', children }: SpaListProps) {
  return (
    <section className={`w-full py-12 select-none md:py-20 ${className}`}>
      <div className='mx-auto flex w-[90%] max-w-7xl flex-col gap-16 px-4 sm:px-6 md:gap-24 lg:px-8'>
        {spa.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <React.Fragment key={item.id || index}>
              <div
                className={`flex items-center justify-between gap-8 lg:gap-14 ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                {/* TEXT - 55% */}
                <div className='flex w-full flex-col items-start lg:w-[55%]'>
                  {item.title && (
                    <h2 className='font-lora text-[32px] font-semibold text-[#0D4949] uppercase'>
                      {item.title}
                    </h2>
                  )}

                  <div className='my-4 h-[2px] w-16 bg-[#0D4949]' />

                  <p className='font-montserrat max-w-2xl text-[20px] leading-[1.8] md:text-base'>
                    {item.description}
                  </p>
                </div>

                {/* IMAGE - 42% */}
                <div className='relative h-[260px] w-full overflow-hidden sm:h-[320px] lg:h-[360px] lg:w-[42%]'>
                  <Image
                    src={item.thumbnail}
                    alt={item.title || 'Spa service'}
                    fill
                    className='object-cover'
                    sizes='(max-width: 1024px) 90vw, 42vw'
                  />
                </div>
              </div>

              {/* Insert middle sections after first item if children provided */}
              {index === 0 && children && (
                <div className='flex flex-col gap-16 md:gap-24'>{children}</div>
              )}
            </React.Fragment>
          );
        })}
        {/* If spa array has fewer than 1 item but children exists */}
        {spa.length === 0 && children && (
          <div className='flex flex-col gap-16 md:gap-24'>{children}</div>
        )}
      </div>
    </section>
  );
}
