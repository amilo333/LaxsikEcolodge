'use client';

import { ContactCta, Footer, Header } from '@/components/layouts';
import { BannerSpa, ServiceSpa, SpaList } from './common/components';
import { useSpaListApi, useSpaServicesApi } from './common/hooks';

export function SpaModule() {
  const { data } = useSpaListApi();
  const servicesQuery = useSpaServicesApi();
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
      <BannerSpa />
      <SpaList spa={data?.data}>
        <ServiceSpa services={services} />
        <ContactCta className='!my-0 !w-full !max-w-7xl !rounded-none' />
      </SpaList>
      <Footer />
    </div>
  );
}
