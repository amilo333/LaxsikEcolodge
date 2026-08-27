import { ToursModule } from '@/modules/tours';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours & Local Experiences | Laxsik Ecolodge',
  description:
    'Discover walking routes, village stories and local traditions around Muong Hoa Valley and Sa Pa.',
};

export default function ToursPage() {
  return <ToursModule />;
}
