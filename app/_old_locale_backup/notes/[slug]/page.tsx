import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import { getTranslations } from 'next-intl/server'; // Add this line
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { getNoteBySlug, getNotes } from '@/lib/content';
import styles from './NoteDetail.module.css';

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const notes = await getNotes(locale);
  return notes.map((note) => ({ slug: note.slug }));
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const note = await getNoteBySlug(locale, slug);

  if (!note) {
    notFound();
  }

  const contentHtml = await markdownToHtml(note.content || '');
  const t = await getTranslations({ locale, namespace: 'notes' }); // Add this line
  return (
    <>
      <Header />
      <main>
        <Container className={styles.container}>
          <div className="mb-8">
            <Button href="/notes" locale={locale}>← Back to Notes</Button>
          </div>

          <header className={styles.header}>
            <h1 className={styles.title}>{note.title}</h1>
            <div className={styles.meta}>
              <span>{note.date}</span>
            </div>
            <div className={styles.tags}>
              {note.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <article
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </Container>
      </main>
    </>
  );
}
