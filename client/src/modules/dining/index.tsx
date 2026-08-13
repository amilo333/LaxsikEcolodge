import { ContactCta, Footer, Header } from '@/components/layouts';
import {
  BannerDining,
  DiningList,
  ServiceDining,
  SlideImage,
} from './common/component';
export function DiningModule() {
  return (
    <div className='bg-white'>
      <Header />
      <BannerDining />
      <SlideImage />
      <ServiceDining />
      <ContactCta />
      <DiningList />
      <Footer />
    </div>
  );
}
