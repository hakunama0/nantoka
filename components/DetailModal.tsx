'use client';

import { useEffect } from 'react';
import styles from './DetailModal.module.css';

interface Entry {
  date: string;
  title: string;
  description: string;
  tech?: string;
  readTime?: string;
  link: string;
  type: 'app' | 'note';
  detailContent?: string;
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
}

interface DetailModalProps {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailModal({ entry, isOpen, onClose }: DetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!entry) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
        ×
      </button>

        <div className={styles.content}>
          <time className={styles.date}>{entry.date}</time>

          <h1 className={styles.title}>{entry.title}</h1>

          {entry.image && (
            <div className={styles.imageWrapper}>
              <img src={entry.image} alt={entry.title} className={styles.image} />
            </div>
          )}

          <div className={styles.description}>
            {entry.detailContent || entry.description}
          </div>

          {entry.tech && (
            <div className={styles.techSection}>
              <h3 className={styles.sectionTitle}>使用技術</h3>
              <p className={styles.tech}>{entry.tech}</p>
            </div>
          )}

          {entry.readTime && (
            <p className={styles.readTime}>{entry.readTime}</p>
          )}

          <div className={styles.actions}>
            {entry.githubUrl && (
              <a href={entry.githubUrl} className={styles.actionLink} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>
            )}
            {entry.demoUrl && (
              <a href={entry.demoUrl} className={styles.actionLink} target="_blank" rel="noopener noreferrer">
                デモを見る →
              </a>
            )}
          </div>
        </div>
    </div>
  );
}
