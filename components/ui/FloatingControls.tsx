'use client';

import { useParams } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePathname, useRouter } from '@/i18n/navigation';
import styles from './FloatingControls.module.css';

export function FloatingControls() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const toggleLang = () => {
    const newLocale = locale === 'ja' ? 'en' : 'ja';
    router.replace(pathname, { locale: newLocale });
  };

  const themeIconToDisplay = resolvedTheme === 'light' ? '☀' : '☾';
  const themeLabelToDisplay = theme === 'system' ? 'AUTO' : (resolvedTheme === 'light' ? 'LIGHT' : 'DARK');
  const langLabel = locale === 'ja' ? 'JA' : 'EN'; // Current language

  return (
    <div className={styles.container}>
      <div className={styles.legendTitle}>Settings</div>
      
      <button onClick={toggleLang} className={styles.button}>
        <span>LANG</span>
        <span className={styles.label}>{langLabel}</span>
      </button>

      <button onClick={toggleTheme} className={styles.button}>
        <span>THEME</span>
        <span>{themeIconToDisplay}</span>
      </button>
    </div>
  );
}
