'use client';
import { ContactCta, Footer, Header } from '@/components/layouts';
import {
  BannerDining,
  DiningList,
  ServiceDining,
  SlideImage,
} from './common/component';
import { useDiningListApi, useDiningServicesApi } from './common/hooks';
import { localizeExperienceContent } from '@/utils';
import { useLocale } from 'next-intl';

export function DiningModule() {
  const locale = useLocale();
  const { data } = useDiningListApi();
  const servicesQuery = useDiningServicesApi();
  const dining = (data?.data ?? []).map(
    (item: {
      _id: string;
      title: string;
      description: string;
      thumbnail: string;
      images: string[];
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
        images: localizedItem.images,
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
      <BannerDining />
      <SlideImage />
      <ServiceDining services={services} />
      <ContactCta />
      <DiningList dining={dining} />
      <Footer />
    </div>
  );
}
