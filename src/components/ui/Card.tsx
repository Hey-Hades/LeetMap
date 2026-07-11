import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/classNames';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-surface rounded-xl border border-border overflow-hidden p-6", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export default Card;