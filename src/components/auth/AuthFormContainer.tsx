import type { ReactNode } from 'react';
import styles from './AuthFormContainer.module.css';

interface AuthFormContainerProps {
  title: string;
  subtitle?: string;
  error?: string | null;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthFormContainer({ title, subtitle, error, footer, children }: AuthFormContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>ET</div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {children}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
