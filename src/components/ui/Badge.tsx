'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'badge',
    success: 'badge border-[var(--color-success)] text-[var(--color-success)] bg-[var(--color-success)]/10',
    warning: 'badge border-[var(--color-warning)] text-[var(--color-warning)] bg-[var(--color-warning)]/10',
    error: 'badge border-[var(--color-error)] text-[var(--color-error)] bg-[var(--color-error)]/10',
    info: 'badge border-[var(--color-info)] text-[var(--color-info)] bg-[var(--color-info)]/10',
  };

  return (
    <span className={cn(variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
