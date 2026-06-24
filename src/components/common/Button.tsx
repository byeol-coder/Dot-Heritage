import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tactile' | 'audio' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  children?: React.ReactNode;
  className?: string;
}

import React from 'react';

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...ariaProps
}: ButtonProps) {
  const classes = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...ariaProps}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {icon && iconPosition === 'left' && (
        <span className={styles.icon} aria-hidden="true">{icon}</span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className={styles.icon} aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}
