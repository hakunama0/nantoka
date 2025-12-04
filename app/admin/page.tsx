'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

interface ContentEntry {
  id: number;
  entry_id: string;
  type: 'app' | 'note' | 'about';
  locale: 'ja' | 'en';
  title: string;
  description: string;
  date: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [filterLocale, setFilterLocale] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [filterLocale, filterStatus]);

  const fetchEntries = async () => {
    try {
      let url = '/api/admin/entries?';
      if (filterLocale) url += `locale=${filterLocale}&`;
      if (filterStatus) url += `status=${filterStatus}&`;

      const response = await fetch(url);
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('API returned non-array data:', data);
        setEntries([]);
      } else {
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/admin/entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEntries();
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>コンテンツ管理</h1>
        <Link href="/admin/editor" className={styles.createButton}>
          新規作成
        </Link>
      </header>

      <div className={styles.filters}>
        <select
          value={filterLocale}
          onChange={(e) => setFilterLocale(e.target.value)}
          className={styles.select}
        >
          <option value="">全言語</option>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.select}
        >
          <option value="">全ステータス</option>
          <option value="draft">下書き</option>
          <option value="published">公開中</option>
        </select>
      </div>

      <div className={styles.list}>
        {entries.length === 0 ? (
          <p className={styles.empty}>コンテンツがありません</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles[entry.status]}`}>
                    {entry.status === 'draft' ? '下書き' : '公開中'}
                  </span>
                  <span className={styles.badge}>{entry.locale}</span>
                  <span className={styles.badge}>{entry.type}</span>
                </div>
                <time className={styles.date}>{entry.date}</time>
              </div>

              <h2 className={styles.cardTitle}>{entry.title}</h2>
              <p className={styles.cardDescription}>{entry.description}</p>

              <div className={styles.cardActions}>
                <Link
                  href={`/admin/editor?id=${entry.id}`}
                  className={styles.editButton}
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
