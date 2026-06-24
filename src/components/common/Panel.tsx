import React from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title?: string;
  badge?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'tactile' | 'audio' | 'info';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}

export function Panel({
  title,
  badge,
  icon,
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...ariaProps
}: PanelProps) {
  return (
    <div
      className={[styles.panel, styles[`variant-${variant}`], styles[`pad-${padding}`], className].filter(Boolean).join(' ')}
      {...ariaProps}
    >
      {(title || badge) && (
        <div className={styles.header}>
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
          {title && <span className={styles.title}>{title}</span>}
          {badge && <span className={styles.badge}>{badge}</span>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
