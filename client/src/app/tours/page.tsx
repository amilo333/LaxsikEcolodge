import { ToursModule } from '@/modules/tours';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.tours');
  return { title: t('title'), description: t('description') };
}

export default function ToursPage() {
  return <ToursModule />;
}
