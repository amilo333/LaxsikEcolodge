import { ContactModule } from '@/modules/contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Laxsik Ecolodge',
  description:
    'Find Laxsik Ecolodge in Lao Chai, Sa Pa, or contact our team by phone and email.',
};

export default function ContactPage() {
  return <ContactModule />;
}
