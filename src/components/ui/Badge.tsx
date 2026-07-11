import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/classNames';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border",
          {
            'bg-surface-2 text-text-dim border-border': variant === 'default',
            'bg-[#6cb491]/10 text-[#6cb491] border-[#6cb491]/20': variant === 'success', // Easy
            'bg-gold/10 text-gold border-gold/20': variant === 'warning',               // Medium
            'bg-[#bf6d64]/10 text-[#bf6d64] border-[#bf6d64]/20': variant === 'danger', // Hard
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
export default Badge;