'use client';

import { useState, useEffect } from 'react';
import { useI18n, Entry } from '@/lib/i18n';
import { SimpleHeader } from '@/components/SimpleHeader';
import { DetailModal } from '@/components/DetailModal';
import { FloatingNav } from '@/components/FloatingNav';
import styles from './page.module.css';

export default function HomePage() {
  const { t } = useI18n();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isIconSpinning, setIsIconSpinning] = useState(false);
  const [showRealName, setShowRealName] = useState(false);

  useEffect(() => {
    // Set initial state immediately on mount
    setIsScrolled(window.scrollY > 0);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const entries = t.entries;

  return (
    <>
      <SimpleHeader showWhenTop={!isScrolled && !selectedEntry} />
      <main
        className={`${styles.main} ${selectedEntry ? styles.shifted : ''}`}
        onClick={() => {
          if (selectedEntry) {
            setSelectedEntry(null);
            setSelectedIndex(null);
          }
        }}
      >
        <div className={styles.hero}>
          <h1 className={styles.title}>
            {t.heroTitle}
            <span
              className={styles.accent}
              data-text={t.heroAccent}
              data-hover={t.heroAccentHover}
            ></span>
          </h1>
          <p className={styles.subtitle}>{t.heroSubtitle}</p>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLeft}>
              <span className={styles.sectionNumber}>00</span>
              <h2 className={styles.sectionTitle}>{t.about.title}</h2>
            </div>
          </div>

          <article className={styles.entry}>
            <div className={styles.divider} />

            {t.aboutEntry.image && (
              <div className={styles.aboutIconWrapper}>
                <img
                  src={t.aboutEntry.image}
                  alt={t.aboutEntry.title}
                  className={`${styles.aboutIcon} ${isIconSpinning ? styles.spinning : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIconSpinning(true);
                  }}
                  onAnimationEnd={() => setIsIconSpinning(false)}
                />
                <h2 className={styles.aboutName}>
                  {showRealName ? 'Asano Yoshiaki' : t.aboutEntry.title}
                  <span
                    className={styles.nameDot}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRealName(!showRealName);
                    }}
                  >
                    .
                  </span>
                </h2>
                <div className={styles.snsLinks}>
                  <a href="https://x.com/E2wdP" target="_blank" rel="noopener noreferrer" className={styles.snsLink}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedEntry?.type === 'about') {
                      setSelectedEntry(null);
                      setSelectedIndex(null);
                    } else {
                      setSelectedEntry(t.aboutEntry);
                      setSelectedIndex(-1);
                    }
                  }}
                  className={`${styles.openButton} ${selectedEntry?.type === 'about' ? styles.active : ''}`}
                >
                  {selectedEntry?.type === 'about' ? t.buttons.closeAbout : t.buttons.readAbout}
                </button>
              </div>
            )}
            <p className={styles.description}>{t.aboutEntry.description}</p>
          </article>
        </section>

        <div className={styles.entries}>
          <section id="apps" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLeft}>
                <span className={styles.sectionNumber}>01</span>
                <h2 className={styles.sectionTitle}>{t.nav.apps}</h2>
              </div>
              <div className={styles.sectionDate}>
                <span className={styles.dateLabel}>{t.sectionLabels.latestUpdate}</span>
                <time>{entries.filter(e => e.type === 'app')[0]?.date}</time>
              </div>
            </div>
            {entries.filter(e => e.type === 'app').map((entry, index) => (
              <article key={index} className={styles.entry}>
                <div className={styles.divider} />

              <div className={styles.titleRow}>
                <h2 className={styles.entryTitle}>{entry.title}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedIndex === index) {
                      setSelectedEntry(null);
                      setSelectedIndex(null);
                    } else {
                      setSelectedEntry(entry);
                      setSelectedIndex(index);
                    }
                  }}
                  className={`${styles.openButton} ${selectedIndex === index ? styles.active : ''}`}
                >
                  {selectedIndex === index
                    ? entry.type === 'app'
                      ? t.buttons.closeApp
                      : entry.type === 'note'
                      ? t.buttons.closeNote
                      : t.buttons.closeAbout
                    : entry.type === 'app'
                    ? t.buttons.viewApp
                    : entry.type === 'note'
                    ? t.buttons.readNote
                    : t.buttons.readAbout}
                </button>
              </div>

              <p className={styles.description}>{entry.description}</p>

              {entry.tech && (
                <p className={styles.meta}>{entry.tech}</p>
              )}

              {entry.readTime && (
                <p className={styles.meta}>{entry.readTime}</p>
              )}
            </article>
          ))}
          </section>

          <section id="notes" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLeft}>
                <span className={styles.sectionNumber}>02</span>
                <h2 className={styles.sectionTitle}>{t.nav.notes}</h2>
              </div>
              <div className={styles.sectionDate}>
                <span className={styles.dateLabel}>{t.sectionLabels.latestUpdate}</span>
                <time>{entries.filter(e => e.type === 'note')[0]?.date}</time>
              </div>
            </div>
            {entries.filter(e => e.type === 'note').map((entry, index) => (
              <article key={index} className={styles.entry}>
                <div className={styles.divider} />

              <div className={styles.titleRow}>
                <h2 className={styles.entryTitle}>{entry.title}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const actualIndex = entries.findIndex(e => e === entry);
                    if (selectedIndex === actualIndex) {
                      setSelectedEntry(null);
                      setSelectedIndex(null);
                    } else {
                      setSelectedEntry(entry);
                      setSelectedIndex(actualIndex);
                    }
                  }}
                  className={`${styles.openButton} ${selectedIndex === entries.findIndex(e => e === entry) ? styles.active : ''}`}
                >
                  {selectedIndex === entries.findIndex(e => e === entry)
                    ? entry.type === 'app'
                      ? t.buttons.closeApp
                      : entry.type === 'note'
                      ? t.buttons.closeNote
                      : t.buttons.closeAbout
                    : entry.type === 'app'
                    ? t.buttons.viewApp
                    : entry.type === 'note'
                    ? t.buttons.readNote
                    : t.buttons.readAbout}
                </button>
              </div>

              <p className={styles.description}>{entry.description}</p>

              {entry.tech && (
                <p className={styles.meta}>{entry.tech}</p>
              )}

              {entry.readTime && (
                <p className={styles.meta}>{entry.readTime}</p>
              )}
            </article>
          ))}
          </section>
        </div>
      </main>
      <DetailModal
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => {
          setSelectedEntry(null);
          setSelectedIndex(null);
        }}
      />
      <FloatingNav />
    </>
  );
}
