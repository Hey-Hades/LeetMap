import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/classNames';

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10",
        className
      )}
      {...props}
    />
  )
);

Container.displayName = "Container";

export default Container;