import { ContactModule } from '@/modules/contact';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.contact');
  return { title: t('title'), description: t('description') };
}

export default function ContactPage() {
  return <ContactModule />;
}
