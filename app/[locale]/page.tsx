import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeaturedApps, getLatestNotes } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FloatingControls } from '@/components/ui/FloatingControls';
import styles from './Home.module.css';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const featuredApps = await getFeaturedApps(locale);
  const latestNotes = await getLatestNotes(locale);

  return (
    <>
      <Container className={styles.container}>
        <section className={`${styles.hero} animate-fade-in-up`}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
          <p className={styles.description}>{t('description')}</p>
        </section>

        <section className={`${styles.section} animate-fade-in-up-delay-1`}>
          <h2 className={styles.sectionTitle}>Featured Apps</h2>
          <div className={styles.grid}>
            {featuredApps.map((app) => (
              <Card key={app.id} item={app} type="app" locale={locale} />
            ))}
          </div>
                  <div className={styles.viewAll}>
                    <Button href="/apps" locale={locale}>{t('viewAllApps')}</Button>
                  </div>        </section>

        <section className={`${styles.section} animate-fade-in-up-delay-2`}>
          <h2 className={styles.sectionTitle}>{t('latestNotes')}</h2>
          <div className={styles.stack}>
            {latestNotes.map((note) => (
              <Card key={note.slug} item={note} type="note" locale={locale} />
            ))}
          </div>
        </section>
      </Container>
      <FloatingControls />
    </>
  );
}
