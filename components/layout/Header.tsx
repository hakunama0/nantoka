'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('nav');
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
  const langText = locale === 'ja' ? 'JA' : 'EN'; // 現在の言語を表示

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" locale={locale} className={styles.logo}>
          Nantoka
        </Link>

        <nav className={styles.nav}>
          <Link href="/apps" locale={locale} className={styles.navLink}>
            {t('apps')}
          </Link>
          <Link href="/notes" locale={locale} className={styles.navLink}>
            {t('notes')}
          </Link>
        </nav>

        <div className={styles.controls}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
            title={`Current: ${theme}`}
          >
            {themeIconToDisplay}
          </button>
          <button
            onClick={toggleLang}
            className={styles.langToggle}
            aria-label="Toggle language"
          >
            {langText}
          </button>
        </div>
      </div>
    </header>
  );
}
