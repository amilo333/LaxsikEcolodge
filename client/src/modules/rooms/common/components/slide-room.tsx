'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/core';
import { buildRoomDetailUrl, localizeRoomContent } from '@/utils';
import { useAvailableRoomsApi, useRoomListApi } from '../hooks';
import { TRoom } from '../types';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

type SlideRoomProps = {
  currentRoomId: string;
  title?: string;
  onExploreRoom?: (room: TRoom) => void;
};

export function SlideRoom(props: SlideRoomProps) {
  const { currentRoomId, title, onExploreRoom } = props;
  const t = useTranslations('Rooms.slider');
  const locale = useLocale();
  const displayTitle = title === undefined ? t('otherRooms') : title;

  const router = useRouter();
  const searchParams = useSearchParams();

  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const isSearching = Boolean(checkInDate && checkOutDate);
  const roomListQuery = useRoomListApi({ page: 1, limit: 100 }, !isSearching);
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

  const displayRooms = rooms
    .filter((room) => room._id !== currentRoomId)
    .map((room) => localizeRoomContent(room, locale));

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
        <p className='font-montserrat text-sm text-[#0D4949]'>{t('loading')}</p>
      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <section className='flex w-full justify-center py-16'>
        <p className='font-montserrat text-sm text-red-500'>{t('loadError')}</p>
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

        {displayTitle && (
          <h2 className='font-lora mb-8 px-4 text-center text-2xl font-bold text-[#0D4949] uppercase sm:text-[32px] md:mb-10 md:text-3xl'>
            {displayTitle}
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
                    isActive ? 'w-[min(86vw,380px)]' : 'w-[min(72vw,300px)]'
                  } `}>
                  {/* =========================
                        ROOM CARD
                    ========================= */}

                  <div
                    className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 ease-out ${
                      isActive
                        ? 'h-[470px] sm:h-[520px]'
                        : 'h-[420px] sm:h-[470px]'
                    } `}>
                    {/* =========================
                          IMAGE
                      ========================= */}

                    <div
                      className={`relative w-full flex-none overflow-hidden bg-[#F5F5F5] ${
                        isActive
                          ? 'h-[250px] sm:h-[300px]'
                          : 'h-[330px] sm:h-[380px]'
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
                        quality={90}
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
                            className='h-[40px]! w-full! max-w-[320px]! bg-[#0D4949]! px-4! text-[16px]! font-semibold text-white! transition-colors duration-200 hover:bg-[#083B3B]!'>
                            {t('explore')}
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
