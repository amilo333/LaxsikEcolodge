import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';

export default function Home() {
  const t = useTranslations('Home');

  return redirect('/rooms');
}
