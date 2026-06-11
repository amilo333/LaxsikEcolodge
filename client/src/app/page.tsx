import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="bg-primary">
      <h1>{t('title')}</h1>
    </main>
  );
}
