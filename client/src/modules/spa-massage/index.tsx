'use client';

import { ContactCta, Footer, Header } from '@/components/layouts';
import { BannerSpa, ServiceSpa, SpaList } from './common/components';
import { useSpaListApi, useSpaServicesApi } from './common/hooks';
import { localizeExperienceContent } from '@/utils';
import { useLocale } from 'next-intl';

export function SpaModule() {
  const locale = useLocale();
  const { data } = useSpaListApi();
  const servicesQuery = useSpaServicesApi();
  const spa = (data?.data ?? []).map(
    (item: {
      _id: string;
      title: string;
      description: string;
      thumbnail: string;
      images?: string[];
      translations?: {
        vi?: { title: string; description: string };
        en?: { title: string; description: string };
      };
    }) => {
      const localizedItem = localizeExperienceContent(item, locale);
      return {
        id: localizedItem._id,
        title: localizedItem.title,
        description: localizedItem.description,
        thumbnail: localizedItem.thumbnail,
        images: localizedItem.images ?? [],
      };
    }
  );
  const services = (servicesQuery.data?.data ?? []).map(
    (service: {
      _id: string;
      title: string;
      description: string;
      icon: string;
      translations?: {
        vi?: { title: string; description: string };
        en?: { title: string; description: string };
      };
    }) => {
      const localizedService = localizeExperienceContent(service, locale);
      return {
        id: localizedService._id,
        title: localizedService.title,
        description: localizedService.description,
        icon: localizedService.icon,
      };
    }
  );
  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />
      <BannerSpa />
      <SpaList spa={spa}>
        <ServiceSpa services={services} />
        <ContactCta className='!my-0 !w-full !max-w-7xl !rounded-none' />
      </SpaList>
      <Footer />
    </div>
  );
}
