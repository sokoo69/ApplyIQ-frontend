import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'accent' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
        {
          'border-transparent bg-[var(--color-primary)] text-white': variant === 'default',
          'border-transparent bg-[var(--color-secondary)] text-white': variant === 'secondary',
          'border-transparent bg-[var(--color-accent)] text-white': variant === 'accent',
          'border-gray-200 text-gray-900': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
