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
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#151515]">
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
