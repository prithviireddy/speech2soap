import React from 'react';

/**
 * Button — Aceternity/React Bits inspired interactive button.
 *
 * Features:
 * - Subtle gradient sheen and glow hover shadows
 * - Micro-scale feedback on active press (`active:scale-[0.98]`)
 * - Disabled opacity and smooth cursor states
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-primary to-brand-primary-hover text-white shadow-sm hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98] border border-brand-primary/20',
    secondary:
      'bg-white border border-border-strong text-text-primary hover:bg-bg-base hover:border-brand-primary hover:text-brand-primary active:scale-[0.98] shadow-xs',
    accent:
      'bg-gradient-to-r from-brand-accent to-emerald-600 text-white shadow-sm hover:shadow-glow-accent hover:-translate-y-0.5 active:scale-[0.98]',
    danger:
      'bg-danger text-white hover:bg-red-700 active:scale-[0.98] shadow-xs hover:shadow-sm',
    outline:
      'border border-border-default bg-transparent text-text-secondary hover:bg-bg-base hover:text-text-primary active:scale-[0.98]',
    ghost:
      'text-text-secondary hover:text-brand-primary hover:bg-brand-primary-light/50 active:scale-[0.98]',
    glass:
      'glass-panel text-text-primary hover:text-brand-primary hover:border-brand-primary/30 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 w-full',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${
        sizes[size] ?? sizes.md
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
