'use client';
import { ContactCta, Footer, Header } from '@/components/layouts';
import {
  BannerDining,
  DiningList,
  ServiceDining,
  SlideImage,
} from './common/component';
import { useDiningListApi, useDiningServicesApi } from './common/hooks';

export function DiningModule() {
  const { data } = useDiningListApi();
  const servicesQuery = useDiningServicesApi();
  const services = (servicesQuery.data?.data ?? []).map(
    (service: {
      _id: string;
      title: string;
      description: string;
      icon: string;
    }) => ({
      id: service._id,
      title: service.title,
      description: service.description,
      icon: service.icon,
    })
  );
  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />
      <BannerDining />
      <SlideImage />
      <ServiceDining services={services} />
      <ContactCta />
      <DiningList dining={data?.data} />
      <Footer />
    </div>
  );
}
