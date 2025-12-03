import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { getAppById, getApps } from '@/lib/content';
import styles from './AppDetail.module.css';

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const apps = await getApps(locale);
  return apps.map((app) => ({ id: app.id }));
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const app = await getAppById(locale, id);
  const t = await getTranslations({ locale, namespace: 'apps' });

  if (!app) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <Container className={styles.container}>
          <div className="mb-8">
            <Button href="/apps" locale={locale}>← Back to Apps</Button>
          </div>

          <header className={styles.header}>
            <h1 className={styles.title}>{app.name}</h1>
            <div className={styles.meta}>
              <span>{app.date}</span>
            </div>
            <div className={styles.tags}>
              {app.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className={styles.description}>
            <p>{app.description}</p>
          </div>

          <div className={styles.links}>
            {app.links.appStore && (
              <Button href={app.links.appStore} locale={locale}>App Store</Button>
            )}
            {app.links.github && (
              <Button href={app.links.github} locale={locale}>GitHub</Button>
            )}
            {app.links.web && (
              <Button href={app.links.web} locale={locale}>Website</Button>
            )}
          </div>
        </Container>
      </main>
    </>
  );
}
