'use client';

import { LOCALE_COOKIE, type AppLocale } from '@/configs/i18n';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const LOCALES: Array<{ code: AppLocale; shortLabel: string }> = [
  { code: 'en', shortLabel: 'EN' },
  { code: 'vi', shortLabel: 'VI' },
];

const persistLocale = (locale: AppLocale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('Common.language');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    persistLocale(nextLocale);
    startTransition(() => router.refresh());
  };

  return (
    <div
      aria-label={t('label')}
      className='fixed bottom-5 left-5 z-[100] flex items-center gap-1 rounded-full border border-white/60 bg-white/95 p-1 shadow-[0_12px_35px_rgba(15,23,42,0.18)] backdrop-blur-md'
      role='group'>
      {LOCALES.map(({ code, shortLabel }) => {
        const isActive = locale === code;

        return (
          <button
            key={code}
            aria-pressed={isActive}
            className={`min-w-10 rounded-full px-3 py-2 text-xs font-bold tracking-[0.12em] transition-all disabled:cursor-wait disabled:opacity-60 ${
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'hover:bg-primary/10 hover:text-primary text-slate-600'
            }`}
            disabled={isPending}
            onClick={() => selectLocale(code)}
            title={t(code)}
            type='button'>
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}
