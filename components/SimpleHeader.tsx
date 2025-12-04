'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useI18n } from '@/lib/i18n';
import styles from './layout/Header.module.css';

interface SimpleHeaderProps {
  showWhenTop?: boolean;
}

export function SimpleHeader({ showWhenTop = false }: SimpleHeaderProps = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const toggleLang = () => {
    setLocale(locale === 'ja' ? 'en' : 'ja');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeIconToDisplay = resolvedTheme === 'light' ? '☀' : '☾';
  const langText = locale === 'ja' ? 'JA' : 'EN';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`${styles.header} ${showWhenTop ? styles.visible : ''} ${!isMounted ? styles.noTransition : ''}`}>
      <div className={styles.headerInner}>
        <div className={styles.navContainer}>
          <button onClick={scrollToTop} className={`${styles.navItem} ${styles.nantokaNavItem}`}>
            Nantoka
          </button>
          <button onClick={() => scrollToSection('apps')} className={styles.navItem}>
            {t.nav.apps}
          </button>
          <button onClick={() => scrollToSection('notes')} className={styles.navItem}>
            {t.nav.notes}
          </button>
          <div className={styles.divider}></div>
          <button
            onClick={toggleTheme}
            className={styles.navItem}
            aria-label="Toggle theme"
            title={`Current: ${theme}`}
          >
            {themeIconToDisplay}
          </button>
          <button
            onClick={toggleLang}
            className={styles.navItem}
            aria-label="Toggle language"
          >
            {langText}
          </button>
        </div>
      </div>
    </header>
  );
}
