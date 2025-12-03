'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { SimpleHeader } from '@/components/SimpleHeader';
import { DetailModal } from '@/components/DetailModal';
import { FloatingNav } from '@/components/FloatingNav';
import styles from './page.module.css';

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

export default function HomePage() {
  const { t } = useI18n();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // TODO: 後でデータソースから取得
  const entries: Entry[] = [
    {
      date: '2024.12.04',
      title: 'デザインシステムビルダー',
      description: '「統一感のあるUIを素早く作りたい」という課題から始まった。色の選択、余白の調整、タイポグラフィ。全てをシステム化することで、デザインの本質に集中できるようになった。',
      detailContent: `デザインシステムの構築は、単なる見た目の統一ではない。それは思考の整理であり、意思決定の体系化だ。

このプロジェクトは、毎回同じようなUIの選択で悩むことへの疲労から生まれた。ボタンの角丸は何pxが適切か。余白は16pxか24pxか。色は何色必要か。

答えは、ルールを作ることだった。

8の倍数で余白を定義し、色は意味を持つ最小限の数に絞り、タイポグラフィは階層を明確にする。これらの制約が、逆説的に創造性を解放した。

実装にはReactとTailwind CSSを採用。コンポーネントの再利用性を最大化し、デザイントークンで一貫性を保証する。結果として、デザインの判断に費やす時間は劇的に減少し、本質的な問題解決に集中できるようになった。`,
      tech: 'React / TypeScript / Tailwind CSS',
      image: '/placeholder-design-system.jpg',
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/example/design-system',
      link: '#',
      type: 'app',
    },
    {
      date: '2024.12.03',
      title: 'ゼロから作るデザインシステム',
      description: 'デザインシステムを構築する過程で学んだこと。コンポーネントの粒度、命名規則、ドキュメント化。理論だけでなく、実装の過程で直面した課題とその解決策。',
      detailContent: `デザインシステムを一から構築する経験は、開発者として大きな学びだった。

最初の課題は「粒度」だ。コンポーネントをどこまで細かく分割すべきか。Buttonは一つか、PrimaryButton、SecondaryButtonと分けるべきか。答えは「バリエーションではなく、責任で分ける」だった。

次に直面したのは命名規則。技術的な名前（例：BlueButton）ではなく、意味を持つ名前（例：PrimaryButton）を採用した。これにより、色が変わってもコンポーネント名の変更は不要になる。

そして最も重要だったのがドキュメント化。コンポーネントの使い方だけでなく、「なぜそのデザイン判断をしたのか」を記録した。これが、チーム全体での一貫性を保つ鍵となった。

理論は美しいが、実践は泥臭い。レガシーコードとの共存、段階的な移行、チームメンバーへの教育。全てが課題だった。しかし、一つずつ解決していくことで、確実に品質は向上していった。`,
      readTime: '12分で読む',
      link: '#',
      type: 'note',
    },
  ];

  return (
    <>
      <SimpleHeader hideWhenDetailOpen={isScrolled || !!selectedEntry} />
      <main
        className={`${styles.main} ${selectedEntry ? styles.shifted : ''}`}
        onClick={() => selectedEntry && setSelectedEntry(null)}
      >
        <div className={styles.hero}>
          <h1 className={styles.title}>なんとか</h1>
          <p className={styles.subtitle}>思考と制作の記録</p>
        </div>

        <div className={styles.entries}>
          {entries.map((entry, index) => (
            <article key={index} className={styles.entry}>
              <time className={styles.date}>{entry.date}</time>
              <div className={styles.divider} />

              <h2 className={styles.entryTitle}>{entry.title}</h2>

              <p className={styles.description}>{entry.description}</p>

              {entry.tech && (
                <p className={styles.meta}>{entry.tech}</p>
              )}

              {entry.readTime && (
                <p className={styles.meta}>{entry.readTime}</p>
              )}

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
                className={styles.link}
              >
                {selectedIndex === index
                  ? '閉じる ×'
                  : entry.type === 'app'
                  ? '作品を見る →'
                  : '記事を読む →'}
              </button>
            </article>
          ))}
        </div>
      </main>
      <DetailModal
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
      <FloatingNav />
    </>
  );
}
