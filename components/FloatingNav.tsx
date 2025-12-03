'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useI18n } from '@/lib/i18n';
import styles from './FloatingNav.module.css';

interface FloatingNavProps {
  isVisible?: boolean;
}

export function FloatingNav({ isVisible = true }: FloatingNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    if (!isExpanded) return;

    setIsFadingOut(false);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsFadingOut(false);
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isExpanded]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
    setIsExpanded(true);
  };

  const toggleLang = () => {
    setLocale(locale === 'ja' ? 'en' : 'ja');
    setIsExpanded(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsExpanded(false);
  };

  const themeIconToDisplay = resolvedTheme === 'light' ? '☀' : '☾';
  const langText = locale === 'ja' ? 'JA' : 'EN';

  if (!isVisible) return null;

  return (
    <div className={`${styles.floating} ${isExpanded ? styles.expanded : ''}`}>
      <button
        className={styles.trigger}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle navigation"
      >
        <span className={styles.line}></span>
      </button>

      {isExpanded && (
        <div className={`${styles.menu} ${isFadingOut ? styles.fadeOut : ''}`}>
          <button
            onClick={scrollToTop}
            className={styles.menuItem}
          >
            Nantoka
          </button>
          <button
            onClick={() => scrollToSection('apps')}
            className={styles.menuItem}
          >
            {t.nav.apps}
          </button>
          <button
            onClick={() => scrollToSection('notes')}
            className={styles.menuItem}
          >
            {t.nav.notes}
          </button>
          <div className={styles.divider}></div>
          <button
            onClick={toggleTheme}
            className={styles.menuItem}
            aria-label="Toggle theme"
          >
            {themeIconToDisplay}
          </button>
          <button
            onClick={toggleLang}
            className={styles.menuItem}
            aria-label="Toggle language"
          >
            {langText}
          </button>
        </div>
      )}
    </div>
  );
}
