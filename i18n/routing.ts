import { defineRouting } from 'next-intl/routing';

export const locales = ['ja', 'en'] as const;
export const defaultLocale = 'ja';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});