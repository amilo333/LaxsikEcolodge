'use client';
import { ContactCta, Footer, Header } from '@/components/layouts';
import {
  BannerDining,
  DiningList,
  ServiceDining,
  SlideImage,
} from './common/component';
import { useDiningListApi } from './common/hooks';

export function DiningModule() {
  const { data } = useDiningListApi();
  return (
    <div className=''>
      <Header />
      <BannerDining />
      <SlideImage />
      <ServiceDining />
      <ContactCta />
      <DiningList dining={data?.data} />
      <Footer />
    </div>
  );
}
