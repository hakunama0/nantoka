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
  const [isHovering, setIsHovering] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [showAllNav, setShowAllNav] = useState(false);
  const [currentSection, setCurrentSection] = useState<'apps' | 'notes'>('apps');
  const [isMounted, setIsMounted] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      setHasHovered(false);
      // Delay resetting showAllNav to allow fade-out animation to complete
      const resetTimer = setTimeout(() => {
        setShowAllNav(false);
      }, 300);
      return () => clearTimeout(resetTimer);
    }

    // Show all nav items after 0.8s (always, regardless of hover)
    const navTimer = setTimeout(() => {
      setShowAllNav(true);
    }, 800);

    return () => {
      clearTimeout(navTimer);
    };
  }, [isExpanded]);

  // ホバー開始時のタイマー
  useEffect(() => {
    if (isHovering && !isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 500);
      setHoverTimer(timer);
      return () => {
        clearTimeout(timer);
        setHoverTimer(null);
      };
    } else if (!isHovering && hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  }, [isHovering, isExpanded]);

  // ホバー解除時の自動クローズ
  useEffect(() => {
    if (!isExpanded || isHovering) return;

    const closeTimer = setTimeout(() => {
      if (!isHovering) {
        setIsExpanded(false);
      }
    }, 400);

    return () => {
      clearTimeout(closeTimer);
    };
  }, [isExpanded, isHovering]);


  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);

      // Only close if actually scrolling (not initial check)
      if (isExpanded && scrollDiff > 5) {
        // Clear previous timer
        if (scrollTimer) clearTimeout(scrollTimer);

        // Wait 0.8s after scrolling stops
        scrollTimer = setTimeout(() => {
          if (isExpanded && !isHovering) {
            setIsExpanded(false);
          }
        }, 800);
      }

      lastScrollY = currentScrollY;

      // Determine current section based on scroll position
      const clientHeight = window.innerHeight;
      const viewportMiddle = currentScrollY + clientHeight / 2;
      const entries = document.querySelectorAll('article');

      let foundSection: 'apps' | 'notes' = 'apps';
      entries.forEach((entry) => {
        const rect = entry.getBoundingClientRect();
        const entryTop = rect.top + currentScrollY;
        const entryBottom = entryTop + rect.height;

        if (viewportMiddle >= entryTop && viewportMiddle <= entryBottom) {
          // Check if it's an app or note based on content
          const linkText = entry.querySelector('button')?.textContent || '';
          if (linkText.includes('記事を読む')) {
            foundSection = 'notes';
          } else if (linkText.includes('作品を見る')) {
            foundSection = 'apps';
          }
        }
      });

      setCurrentSection(foundSection);
    };

    handleScroll(); // Initial section check

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [isExpanded, isHovering]);

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
    <div
      className={`${styles.floating} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => {
        setIsHovering(true);
        setHasHovered(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        className={styles.trigger}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle navigation"
      >
        <span className={styles.line}></span>
      </button>

      <div className={`${styles.menu} ${!isExpanded ? styles.hidden : ''} ${!isMounted ? styles.noTransition : ''}`}>
          <button
            onClick={scrollToTop}
            className={`${styles.menuItem} ${styles.nantokaMenuItem}`}
          >
            Nantoka
          </button>
          {(showAllNav || currentSection === 'apps') && (
            <button
              onClick={() => scrollToSection('apps')}
              className={`${styles.menuItem} ${currentSection === 'apps' ? styles.focused : ''} ${showAllNav && currentSection !== 'apps' ? styles.fadeInItem : ''}`}
            >
              {t.nav.apps}
            </button>
          )}
          {(showAllNav || currentSection === 'notes') && (
            <button
              onClick={() => scrollToSection('notes')}
              className={`${styles.menuItem} ${currentSection === 'notes' ? styles.focused : ''} ${showAllNav && currentSection !== 'notes' ? styles.fadeInItem : ''}`}
            >
              {t.nav.notes}
            </button>
          )}
          <div className={styles.divider}></div>
          <button
            onClick={toggleTheme}
            className={`${styles.menuItem} ${styles.themeButton}`}
            aria-label="Toggle theme"
          >
            <span className={styles.themeIcon}>{themeIconToDisplay}</span>
          </button>
          <button
            onClick={toggleLang}
            className={styles.menuItem}
            aria-label="Toggle language"
          >
            {langText}
          </button>
        </div>
    </div>
  );
}
