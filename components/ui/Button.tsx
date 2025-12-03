import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  locale?: string; // Add locale prop
}

export function Button({ children, href, onClick, className = '', locale }: ButtonProps) {
  const classes = `${styles.button} ${className}`;

  if (href) {
    // 外部リンクの場合は通常のaタグ、内部リンクならnext-intlのLink
    if (href.startsWith('http')) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} locale={locale}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
