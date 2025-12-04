'use client';

import { useEffect, useState } from 'react';
import { SiReact, SiTypescript, SiTailwindcss, SiNextdotjs, SiNodedotjs, SiPython, SiJavascript, SiVuedotjs, SiAngular, SiSvelte, SiFigma, SiGit, SiDocker, SiPostgresql, SiMongodb, SiFirebase, SiSupabase, SiVercel, SiAmazon } from 'react-icons/si';
import { IconType } from 'react-icons';
import { useI18n, Entry } from '@/lib/i18n';
import styles from './DetailModal.module.css';

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
  const [isRead, setIsRead] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({
    heart: 0,
    party: 0,
    thinking: 0,
  });
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // リアクション取得
  useEffect(() => {
    if (!entry || !isOpen) {
      // モーダルが閉じたらstateをリセット
      setSelectedReaction(null);
      setReactions({
        heart: 0,
        party: 0,
        thinking: 0,
      });
      setIsSubmitting(false);
      return;
    }

    const fetchReactions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_REACTIONS_API_URL;
        if (!apiUrl) return;

        const entryId = entry.link;
        const response = await fetch(`${apiUrl}/reactions/${entryId}`);

        if (response.ok) {
          const data = await response.json();
          setReactions({
            heart: data.heart || 0,
            party: data.party || 0,
            thinking: data.thinking || 0,
          });
        }

        // localStorageから既にクリック済みのリアクションを取得
        const reacted = localStorage.getItem(`reaction_${entryId}`);
        if (reacted) {
          setSelectedReaction(reacted);
        } else {
          setSelectedReaction(null);
        }
      } catch (error) {
        console.error('Failed to fetch reactions:', error);
      }
    };

    fetchReactions();
  }, [entry, isOpen]);

  // リアクション送信
  const handleReactionClick = async (reactionType: string) => {
    if (!entry || isSubmitting) return;

    const entryId = entry.link;

    // 同じボタンをもう一度押した場合は取り消し
    if (selectedReaction === reactionType) {
      localStorage.removeItem(`reaction_${entryId}`);
      setSelectedReaction(null);
      // カウントを1減らす（楽観的更新）
      setReactions(prev => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType] - 1),
      }));
      return;
    }

    // 既に別のリアクション済みの場合は何もしない
    if (selectedReaction) return;

    // 送信中フラグを立てる
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_REACTIONS_API_URL;
      if (!apiUrl) {
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${apiUrl}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entry_id: entryId,
          reaction_type: reactionType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReactions(prev => ({
          ...prev,
          [reactionType]: data.count,
        }));

        // localStorageに保存
        localStorage.setItem(`reaction_${entryId}`, reactionType);
        setSelectedReaction(reactionType);
      }
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!entry) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
        ×
      </button>

        <div className={styles.content}>
          <div className={styles.metaBadges}>
            <span className={styles.badge}>{entry.date}</span>
            <span className={styles.badge}>{entry.type === 'app' ? 'App' : entry.type === 'note' ? 'Note' : 'About'}</span>
            {entry.readTime && (
              <span className={styles.badge}>
                約{entry.readTime.replace(/約|分| min read/g, '').trim()}分で読めます
              </span>
            )}
          </div>

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

          <div className={styles.readCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isRead}
                onChange={(e) => setIsRead(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>読んだ！</span>
            </label>
          </div>

          <div className={styles.reactionsSection}>
            <h3 className={styles.sectionTitle}>この{entry.type === 'app' ? '作品' : '記事'}への反応</h3>
            <div className={styles.reactions}>
              <button
                onClick={() => handleReactionClick('heart')}
                disabled={isSubmitting || (selectedReaction !== null && selectedReaction !== 'heart')}
                className={`${styles.reactionButton} ${selectedReaction === 'heart' ? styles.selected : ''}`}
              >
                <svg className={styles.reactionIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className={styles.reactionLabel}>参考になった</span>
                <span className={styles.reactionCount}>{reactions.heart}</span>
              </button>
              <button
                onClick={() => handleReactionClick('party')}
                disabled={isSubmitting || (selectedReaction !== null && selectedReaction !== 'party')}
                className={`${styles.reactionButton} ${selectedReaction === 'party' ? styles.selected : ''}`}
              >
                <svg className={styles.reactionIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.35 22a10 10 0 01-10-10c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-2 12l-3-3 1.41-1.41L10.35 13l4.59-4.59L16.35 10l-6 6z"/>
                  <path d="M7 6l1.5-4L10 3 8.5 7zm5-4l1.5 4L12 7l-1.5-4zm5 0l1.5 4-1.5 1L15 3z"/>
                </svg>
                <span className={styles.reactionLabel}>面白い</span>
                <span className={styles.reactionCount}>{reactions.party}</span>
              </button>
              <button
                onClick={() => handleReactionClick('thinking')}
                disabled={isSubmitting || (selectedReaction !== null && selectedReaction !== 'thinking')}
                className={`${styles.reactionButton} ${selectedReaction === 'thinking' ? styles.selected : ''}`}
              >
                <svg className={styles.reactionIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span className={styles.reactionLabel}>もっと知りたい</span>
                <span className={styles.reactionCount}>{reactions.thinking}</span>
              </button>
            </div>
          </div>

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
