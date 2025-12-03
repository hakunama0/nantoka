import { Link } from '@/i18n/navigation';
import { App, Note } from '@/lib/types';
import styles from './Card.module.css';

interface CardProps {

  item: App | Note;

  type: 'app' | 'note';

  marked?: boolean;

  locale: string; // Add locale prop

}



export function Card({ item, type, marked = false, locale }: CardProps) {

  const isApp = type === 'app';

  // Note: App and Note have different identifier properties (id vs slug)

  const href = isApp ? `/apps/${(item as App).id}` : `/notes/${item.slug}`;

  const title = isApp ? (item as App).name : (item as Note).title;

  const description = isApp ? (item as App).description : (item as Note).excerpt;
  const tags = 'tags' in item && item.tags ? item.tags : [];
  const date = 'date' in item ? item.date : null;

  return (
    <Link href={href} locale={locale} className={`${styles.card} ${marked ? styles.cardMarked : ''}`}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <div className={styles.tags}>
            {tags.map((tag: string) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          {date && <p className={styles.date}>{date}</p>}
        </div>
      </div>
    </Link>
  );
}
