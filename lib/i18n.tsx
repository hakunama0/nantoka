'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'ja' | 'en';

const translations = {
  ja: {
    nav: {
      home: 'ホーム',
      apps: 'Apps',
      notes: 'Notes',
    },
    home: {
      title: 'アプリと記録',
      subtitle: 'Apps & Development Notes',
      description: '作ったアプリと、開発中に考えたことの記録。設計から実装まで、丁寧に作ることを心がけています。',
    },
    apps: {
      title: 'Apps',
      description: 'これまでに作ったアプリの一覧です。',
    },
    notes: {
      title: 'Notes',
      description: '開発中に考えたこと、学んだことの記録。',
    },
  },
  en: {
    nav: {
      home: 'Home',
      apps: 'Apps',
      notes: 'Notes',
    },
    home: {
      title: 'Apps & Notes',
      subtitle: 'Portfolio & Development Journal',
      description: "A collection of apps I've built and notes on the development process. I strive for thoughtful design and implementation.",
    },
    apps: {
      title: 'Apps',
      description: "A collection of applications I've built.",
    },
    notes: {
      title: 'Notes',
      description: 'Thoughts and learnings from development.',
    },
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.ja;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ja');

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
