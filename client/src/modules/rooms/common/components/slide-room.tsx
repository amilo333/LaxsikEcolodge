'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';

import { TRoom } from '../types';
import { ROOMS } from '../constants';
import { Button } from '@/components/core';

type SlideRoomProps = {
  rooms?: TRoom[];
  title?: string;
  onExploreRoom?: (room: TRoom) => void;
};

export function SlideRoom({
  rooms = ROOMS,
  title = 'OTHER ROOMS',
  onExploreRoom,
}: SlideRoomProps) {
  const router = useRouter();

  const displayRooms = rooms && rooms.length > 0 ? rooms : ROOMS;
  const initialIndex = Math.floor(displayRooms.length / 2);

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

  const handleExplore = (room: TRoom) => {
    if (onExploreRoom) {
      onExploreRoom(room);
    } else {
      router.push(`/rooms/${room.id}`);
    }
  };

  return (
    <div className='relative w-full overflow-hidden border-none bg-[#F6F4EE] py-16 select-none'>
      {/* Background Subtle Pattern */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' fill='none' stroke='%3C0D4949' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className='relative flex w-full flex-col items-center gap-10'>
        {/* Title */}
        {title && (
          <h2 className='font-lora text-8 text-center font-bold text-[#0D4949] uppercase md:text-3xl'>
            {title}
          </h2>
        )}

        {/* Embla Carousel Viewport */}
        <div
          className='w-full cursor-grab overflow-hidden py-6 active:cursor-grabbing'
          ref={emblaRef}>
          <div className='flex touch-pan-y items-center justify-center gap-4 px-4 md:gap-6'>
            {displayRooms.map((room: TRoom, index: number) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={room.id || index}
                  className='flex flex-none items-center justify-center transition-all duration-500'
                  style={{
                    flex: isActive
                      ? '0 0 min(480px, 26vw)'
                      : '0 0 min(340px, 17vw)',
                  }}>
                  <div
                    className={`flex flex-col justify-between overflow-hidden bg-white transition-all duration-500 ${
                      isActive
                        ? 'z-10 h-[656px] w-[min(480px,26vw)] shadow-2xl ring-1 ring-black/5'
                        : 'z-0 h-[578px] w-[min(340px,17vw)] opacity-95 shadow-md'
                    }`}>
                    {/* Room Image */}
                    <div
                      className={`relative w-full overflow-hidden bg-gray-100 transition-all duration-500 ${
                        isActive ? 'h-[380px]' : 'h-[460px]'
                      }`}>
                      <Image
                        src={
                          room.thumbnail ||
                          room.images?.[0] ||
                          '/images/rooms/room.png'
                        }
                        alt={room.title}
                        fill
                        className='object-cover transition-transform duration-700 hover:scale-105'
                      />
                    </div>

                    {/* Room Content */}
                    <div
                      className={`flex flex-grow flex-col items-center justify-between bg-white p-4 text-center transition-all duration-500 md:p-6 ${
                        isActive ? 'h-[276px]' : 'h-[118px] justify-center'
                      }`}>
                      <h3 className='font-Montserrat text-[24px] font-bold text-[#1A1A1A] uppercase md:text-base lg:text-lg'>
                        {room.title}
                      </h3>

                      {isActive && (
                        <div className='animate-fadeIn mt-2 flex w-full flex-col items-center gap-4'>
                          <p className='font-montserrat line-clamp-3 max-w-sm px-2 text-[17px] leading-relaxed text-[#555555]'>
                            {room.description}
                          </p>
                          <Button
                            type='button'
                            onClick={() => handleExplore(room)}
                            className='text-4 mt-1 min-w-[416px] cursor-pointer bg-[#0D4949] px-8 py-3 font-semibold text-white uppercase shadow-md transition-colors duration-200 hover:bg-[#073333] md:px-12'>
                            EXPLORE
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
