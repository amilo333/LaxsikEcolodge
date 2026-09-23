import { Footer, Header } from '@/components/layouts';
import { ContactCta } from '@/components/layouts/contact-cta';
import { getUpscaledCloudinaryImageUrl, localizeRoomContent } from '@/utils';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { DetailFacilities, ImageSlider, RoomCard } from '../common';
import { SlideRoom } from '../common/components/slide-room';
import { useRoomDetailApi } from '../common/hooks';
import { useLocale, useTranslations } from 'next-intl';

export function DetailRoomModule() {
  const t = useTranslations('Rooms.detail');
  const locale = useLocale();
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data, isLoading, isError } = useRoomDetailApi(id);

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (isError) {
    return <div>{t('loadError')}</div>;
  }

  if (!data) {
    return <div>{t('notFound')}</div>;
  }

  const localizedRoom = localizeRoomContent(data, locale);

  const heroImage = getUpscaledCloudinaryImageUrl(
    data.images.find(Boolean) ?? data.thumbnail
  );

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />
      <div className='relative z-0'>
        <Image
          height={800}
          width={1920}
          src={heroImage}
          alt={localizedRoom.title}
          preload
          sizes='100vw'
          quality={90}
          className='h-200 w-full object-cover object-center'
        />

        <div className='absolute top-162.5 left-1/2 w-4/5 -translate-x-1/2'>
          <RoomCard room={localizedRoom} />
        </div>
      </div>
      <div className='mt-110'>
        <ImageSlider images={data.images} title={t('gallery')} />
      </div>
      <DetailFacilities room={localizedRoom} />
      <ContactCta />
      <SlideRoom currentRoomId={data._id} />
      <Footer />
    </div>
  );
}
