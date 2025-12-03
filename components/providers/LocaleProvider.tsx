'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

type Locale = 'ja' | 'en';

interface Messages {
  [key: string]: any;
}

interface LocaleContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialMessages: Messages;
}

export function LocaleProvider({ children, initialLocale, initialMessages }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages);
  const pathname = usePathname();

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    // 翻訳データを動的に読み込む
    try {
      const response = await fetch(`/messages/${newLocale}.json`);
      const newMessages = await response.json();

      setLocaleState(newLocale);
      setMessages(newMessages);

      // URLを更新（ページ遷移なし）
      const currentPath = pathname;
      const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
      window.history.pushState(null, '', newPath);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, messages, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
