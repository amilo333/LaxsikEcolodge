import { Footer, Header } from '@/components/layouts';
import { ContactCta } from '@/components/layouts/contact-cta';
import { getUpscaledCloudinaryImageUrl } from '@/utils';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { DetailFacilities, ImageSlider, RoomCard } from '../common';
import { SlideRoom } from '../common/components/slide-room';
import { useRoomDetailApi } from '../common/hooks';

export function DetailRoomModule() {
  const params = useParams<{ id: string }>();

  const id = params.id;

  const { data, isLoading, isError } = useRoomDetailApi(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load room</div>;
  }

  if (!data) {
    return <div>Room not found</div>;
  }

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
          alt={data.title}
          preload
          sizes='100vw'
          quality={90}
          className='h-200 w-full object-cover object-center'
        />

        <div className='absolute top-162.5 left-1/2 w-4/5 -translate-x-1/2'>
          <RoomCard room={data} />
        </div>
      </div>
      <div className='mt-110'>
        <ImageSlider images={data.images} title='Room’s Gallery' />
      </div>
      <DetailFacilities room={data} />
      <ContactCta />
      <SlideRoom currentRoomId={data._id} />
      <Footer />
    </div>
  );
}
