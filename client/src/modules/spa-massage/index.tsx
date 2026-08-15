'use client';

import { ContactCta, Footer, Header } from '@/components/layouts';
import { BannerSpa, ServiceSpa, SpaList } from './common/components';
import { useSpaListApi } from './common/hooks';

export function SpaModule() {
  const { data } = useSpaListApi();
  return (
    <div>
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
