import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Crimson_Pro, IBM_Plex_Mono, Zen_Maru_Gothic } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

const crimsonPro = Crimson_Pro({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: '--font-ja',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Nantoka',
  description: 'Apps & Development Notes',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body className={`${crimsonPro.variable} ${ibmPlexMono.variable} ${zenMaruGothic.variable}`}>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
