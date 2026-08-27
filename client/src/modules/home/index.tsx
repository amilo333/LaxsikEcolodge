import { Footer } from '@/components/layouts';
import {
  ExperiencesSection,
  HeroSection,
  IntroductionSection,
  RetreatHighlights,
  RoomsShowcase,
  SocialGallery,
} from './components';

export default function HomePage() {
  return (
    <main className='overflow-hidden bg-[#F5F7F5] text-[#183F3C]'>
      <HeroSection />
      <IntroductionSection />
      <RoomsShowcase />
      <RetreatHighlights />
      <ExperiencesSection />
      <SocialGallery />
      <Footer />
    </main>
  );
}
