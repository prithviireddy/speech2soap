import React from 'react';

/**
 * Card — High-end surface container inspired by modern Bento Grid & Spotlight cards.
 *
 * variant="default"   — Clean modern card (white surface, refined border, soft shadow)
 * variant="bento"     — Bento grid card with hover lift and gradient border accent
 * variant="elevated"  — Interactive card with ambient depth shadow and hover expansion
 * variant="glass"     — Frosted glassmorphism card (backdrop blur)
 * variant="highlight" — Left accent pill border for active/featured items
 * variant="ghost"     — Unstyled wrapper with padding
 */
export const Card = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-bg-secondary rounded-2xl p-6 shadow-xs border border-border-default hover:border-border-strong/80 transition-all duration-200',
    bento:
      'bento-card p-6',
    elevated:
      'bg-bg-secondary rounded-2xl p-6 shadow-sm border border-border-default hover:shadow-md hover:-translate-y-0.5 hover:border-border-strong transition-all duration-200',
    glass:
      'glass-panel rounded-2xl p-6 shadow-sm',
    highlight:
      'bg-gradient-to-r from-brand-primary-light/60 to-bg-secondary rounded-2xl p-6 border-l-4 border-l-brand-primary border border-border-subtle shadow-xs',
    ghost:
      'rounded-2xl p-6',
  };

  return (
    <div
      className={`${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
