'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/core';
import { buildRoomDetailUrl } from '@/utils';
import { useAvailableRoomsApi, useRoomListApi } from '../hooks';
import { TRoom } from '../types';
import { useSearchParams } from 'next/navigation';

type SlideRoomProps = {
  currentRoomId: string;
  title?: string;
  onExploreRoom?: (room: TRoom) => void;
};

export function SlideRoom(props: SlideRoomProps) {
  const { currentRoomId, title = 'OTHER ROOMS', onExploreRoom } = props;

  const router = useRouter();
  const searchParams = useSearchParams();

  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const isSearching = Boolean(checkInDate && checkOutDate);
  const roomListQuery = useRoomListApi(!isSearching);
  const availableRoomsQuery = useAvailableRoomsApi({
    checkInDate,
    checkOutDate,
    guests: searchParams.get('guests'),
    rooms: searchParams.get('rooms'),
  });
  const rooms: TRoom[] =
    (isSearching ? availableRoomsQuery.data?.data : roomListQuery.data?.data) ??
    [];
  const isLoading = isSearching
    ? availableRoomsQuery.isLoading
    : roomListQuery.isLoading;
  const isError = isSearching
    ? availableRoomsQuery.isError
    : roomListQuery.isError;

  const displayRooms = rooms.filter((room) => room._id !== currentRoomId);

  const initialIndex = displayRooms.length > 2 ? 2 : 0;

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

    emblaApi.on('select', onSelect).on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // =========================
  // EXPLORE ROOM
  // =========================

  const handleExplore = (room: TRoom) => {
    if (onExploreRoom) {
      onExploreRoom(room);
      return;
    }

    router.push(buildRoomDetailUrl(room._id, searchParams));
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <section className='flex w-full justify-center py-16'>
        <p className='font-montserrat text-sm text-[#0D4949]'>
          Loading rooms...
        </p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <section className='flex w-full justify-center py-16'>
        <p className='font-montserrat text-sm text-red-500'>
          Failed to load rooms.
        </p>
      </section>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (!displayRooms.length) {
    return null;
  }

  // =========================
  // UI
  // =========================

  return (
    <section className='w-full overflow-hidden py-10 md:py-14'>
      <div className='flex w-full flex-col items-center'>
        {/* =========================
            TITLE
        ========================= */}

        {title && (
          <h2 className='font-lora mb-10 text-[32px] font-bold text-[#0D4949] uppercase md:text-3xl'>
            {title}
          </h2>
        )}

        {/* =========================
            EMBLA VIEWPORT
        ========================= */}

        <div ref={emblaRef} className='w-full overflow-hidden'>
          {/* =========================
              EMBLA CONTAINER
          ========================= */}

          <div className='flex items-center gap-6'>
            {/* =========================
                ALL ROOMS FROM API
            ========================= */}

            {displayRooms.map((room, index) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={room._id}
                  className={`flex-none transition-all duration-500 ease-out ${
                    isActive ? 'w-[380px]' : 'w-[300px]'
                  } `}>
                  {/* =========================
                        ROOM CARD
                    ========================= */}

                  <div
                    className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 ease-out ${
                      isActive ? 'h-[520px]' : 'h-[470px]'
                    } `}>
                    {/* =========================
                          IMAGE
                      ========================= */}

                    <div
                      className={`relative w-full flex-none overflow-hidden bg-[#F5F5F5] ${
                        isActive ? 'h-[300px]' : 'h-[380px]'
                      } `}>
                      <Image
                        src={room.thumbnail}
                        alt={room.title}
                        fill
                        sizes='
                            (max-width: 768px) 80vw,
                            (max-width: 1280px) 380px,
                            380px
                          '
                        className='object-cover transition-transform duration-700'
                      />
                    </div>

                    {/* =========================
                          CONTENT
                      ========================= */}

                    <div
                      className={`flex flex-1 flex-col items-center bg-white text-center ${
                        isActive
                          ? 'justify-between px-6 py-5'
                          : 'justify-center px-4 py-4'
                      } `}>
                      {/* =========================
                            ROOM TITLE
                        ========================= */}

                      <h3
                        className={`font-montserrat leading-tight font-bold text-[#151515] uppercase ${
                          isActive ? 'text-[17px]' : 'text-[15px]'
                        } `}>
                        {room.title}
                      </h3>

                      {/* =========================
                            ACTIVE CONTENT
                        ========================= */}

                      {isActive && (
                        <div className='flex w-full flex-1 flex-col items-center justify-between pt-4'>
                          {/* DESCRIPTION */}

                          <p className='font-montserrat line-clamp-3 max-w-[320px] text-sm leading-relaxed'>
                            {room.description}
                          </p>

                          {/* EXPLORE */}

                          <Button
                            type='button'
                            onClick={() => handleExplore(room)}
                            className='h-[40px]! w-full! max-w-[320px]! bg-[#0D4949]! px-4! text-[16px]! font-semibold tracking-wider! text-white! transition-colors duration-200 hover:bg-[#083B3B]!'>
                            Explore Now
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
    </section>
  );
}
