import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { getNotes } from '@/lib/content';
import styles from './Notes.module.css';

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });
  const notes = await getNotes(locale);

  return (
    <>
      <Header />
      <main>
        <Container className={styles.container}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
          <div className={styles.stack}>
            {notes.map((note) => (
              <Card key={note.slug} item={note} type="note" locale={locale} />
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
