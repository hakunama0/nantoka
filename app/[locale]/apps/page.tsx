import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { getApps } from '@/lib/content';
import styles from './Apps.module.css';

export default async function AppsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'apps' });
  const apps = await getApps(locale);

  return (
    <>
      <Header />
      <main>
        <Container className={styles.container}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
          <div className={styles.grid}>
            {apps.map((app) => (
              <Card key={app.id} item={app} type="app" marked locale={locale} />
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
