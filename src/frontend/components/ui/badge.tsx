import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@frontend/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-heading font-semibold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-dim text-primary border border-primary/20',
        live: 'bg-live text-white animate-pulse-live',
        offline: 'bg-bg-card text-text-muted border border-border-card',
        possible: 'bg-warning/20 text-warning border border-warning/20',
        surprise: 'bg-accent/20 text-accent border border-accent/20',
        success: 'bg-success/20 text-success border border-success/20',
        secondary: 'bg-bg-card text-text-secondary border border-border-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
