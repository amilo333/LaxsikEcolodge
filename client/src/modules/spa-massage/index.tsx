'use client';

import { ContactCta, Footer, Header } from '@/components/layouts';
import { BannerSpa, ServiceSpa, SpaList } from './common/components';
import { useSpaListApi } from './common/hooks';

export function SpaModule() {
  const { data } = useSpaListApi();
  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
      <Header />
      <BannerSpa />
      <SpaList spa={data?.data}>
        <ServiceSpa />
        <ContactCta className='!my-0 !w-full !max-w-7xl !rounded-none' />
      </SpaList>
      <Footer />
    </div>
  );
}
