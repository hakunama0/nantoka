'use client';

import { useEffect, useState } from 'react';
import { SiReact, SiTypescript, SiTailwindcss, SiNextdotjs, SiNodedotjs, SiPython, SiJavascript, SiVuedotjs, SiAngular, SiSvelte, SiFigma, SiGit, SiDocker, SiPostgresql, SiMongodb, SiFirebase, SiSupabase, SiVercel, SiAmazon } from 'react-icons/si';
import { IconType } from 'react-icons';
import { useI18n } from '@/lib/i18n';
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

const techIconMap: Record<string, IconType> = {
  'react': SiReact,
  'typescript': SiTypescript,
  'tailwind': SiTailwindcss,
  'tailwindcss': SiTailwindcss,
  'next': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'next.js': SiNextdotjs,
  'node': SiNodedotjs,
  'nodejs': SiNodedotjs,
  'node.js': SiNodedotjs,
  'python': SiPython,
  'javascript': SiJavascript,
  'js': SiJavascript,
  'vue': SiVuedotjs,
  'vuejs': SiVuedotjs,
  'vue.js': SiVuedotjs,
  'angular': SiAngular,
  'svelte': SiSvelte,
  'figma': SiFigma,
  'git': SiGit,
  'docker': SiDocker,
  'postgresql': SiPostgresql,
  'postgres': SiPostgresql,
  'mongodb': SiMongodb,
  'mongo': SiMongodb,
  'firebase': SiFirebase,
  'supabase': SiSupabase,
  'vercel': SiVercel,
  'aws': SiAmazon,
};

const techColorMap: Record<string, string> = {
  'react': '#61DAFB',
  'typescript': '#3178C6',
  'tailwind': '#06B6D4',
  'tailwindcss': '#06B6D4',
  'next': '#000000',
  'nextjs': '#000000',
  'next.js': '#000000',
  'node': '#339933',
  'nodejs': '#339933',
  'node.js': '#339933',
  'python': '#3776AB',
  'javascript': '#F7DF1E',
  'js': '#F7DF1E',
  'vue': '#4FC08D',
  'vuejs': '#4FC08D',
  'vue.js': '#4FC08D',
  'angular': '#DD0031',
  'svelte': '#FF3E00',
  'figma': '#F24E1E',
  'git': '#F05032',
  'docker': '#2496ED',
  'postgresql': '#4169E1',
  'postgres': '#4169E1',
  'mongodb': '#47A248',
  'mongo': '#47A248',
  'firebase': '#FFCA28',
  'supabase': '#3ECF8E',
  'vercel': '#000000',
  'aws': '#FF9900',
};

function getTechIcon(techName: string): IconType | null {
  const normalized = techName.toLowerCase().trim();
  return techIconMap[normalized] || null;
}

function getTechColor(techName: string): string {
  const normalized = techName.toLowerCase().trim();
  return techColorMap[normalized] || '#6B7280';
}

function parseTechStack(techString: string): Array<{ name: string; Icon: IconType | null; color: string }> {
  return techString
    .split('/')
    .map(tech => tech.trim())
    .map(name => ({
      name,
      Icon: getTechIcon(name),
      color: getTechColor(name),
    }));
}

export function DetailModal({ entry, isOpen, onClose }: DetailModalProps) {
  const { t } = useI18n();
  const [isIconSpinning, setIsIconSpinning] = useState(false);
  const [showRealName, setShowRealName] = useState(false);

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

          {entry.type === 'about' ? (
            <>
              {entry.image && (
                <div className={`${styles.imageWrapper} ${styles.profileImage}`}>
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className={`${styles.image} ${styles.profileImage} ${isIconSpinning ? styles.spinning : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsIconSpinning(true);
                    }}
                    onAnimationEnd={() => setIsIconSpinning(false)}
                  />
                  <h1 className={styles.profileName}>
                    {showRealName ? 'Asano Yoshiaki' : entry.title}
                    <span
                      className={styles.nameDot}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRealName(!showRealName);
                      }}
                    >
                      .
                    </span>
                  </h1>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className={styles.title}>{entry.title}</h1>
              {entry.image && (
                <div className={styles.imageWrapper}>
                  <img src={entry.image} alt={entry.title} className={styles.image} />
                </div>
              )}
            </>
          )}

          <div className={styles.description}>
            {entry.detailContent || entry.description}
          </div>

          {entry.tech && (
            <div className={styles.techSection}>
              <h3 className={styles.sectionTitle}>{t.sectionLabels.usedTech}</h3>
              <div className={styles.techList}>
                {parseTechStack(entry.tech).map((tech, index) => (
                  <div
                    key={index}
                    className={styles.techItem}
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.Icon && <tech.Icon className={styles.techIcon} />}
                    <span className={styles.techName}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entry.readTime && (
            <p className={styles.readTime}>{entry.readTime}</p>
          )}

          {(entry.githubUrl || entry.demoUrl) && (
            <div className={styles.actionsWrapper}>
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
          )}
        </div>
    </div>
  );
}
