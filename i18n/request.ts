import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './routing'; // Import your locales from routing.ts

export default getRequestConfig(async ({ locale }) => {
  let finalLocale = locale;

  // Validate that the incoming `locale` is among our supported locales
  if (!locales.includes(locale as any)) {
    finalLocale = defaultLocale;
  }

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
