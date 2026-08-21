import React from 'react';

/**
 * Badge — Modern status pill with subtle border ring and optional glowing pulse dot.
 *
 * pulse=true adds a glowing pulsing dot before the label (for active processing/transcribing states).
 */
export const Badge = ({
  variant = 'primary',
  size = 'md',
  pulse = false,
  children,
  className = '',
}) => {
  const variants = {
    primary:
      'bg-brand-primary-light text-brand-primary border border-brand-primary/20',
    secondary:
      'bg-bg-surface-subtle text-text-secondary border border-border-default',
    success:
      'bg-success-light text-success border border-success/25',
    warning:
      'bg-warning-light text-warning border border-warning/25',
    danger:
      'bg-danger-light text-danger border border-danger/25',
    info:
      'bg-info-light text-info border border-info/25',
    medical:
      'bg-medical-light text-medical border border-medical/25',
    outline:
      'bg-bg-secondary border border-border-default text-text-secondary',
  };

  const dotColors = {
    primary: 'bg-brand-primary',
    secondary: 'bg-text-muted',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    medical: 'bg-medical',
    outline: 'bg-text-muted',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1.5 font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide shadow-2xs ${
        variants[variant] ?? variants.primary
      } ${sizes[size] ?? sizes.md} ${className}`}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColors[variant] ?? 'bg-current'
          } animate-pulse-glow shrink-0`}
        />
      )}
      {children}
    </span>
  );
};
