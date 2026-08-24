import * as React from 'react';
import { cn } from '@/lib/utils';

/** Lightweight avatar (no Radix dependency), shadcn API shape. */
function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative flex size-9 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, alt = '', ...props }: React.ComponentProps<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={cn('aspect-square size-full object-cover', className)} alt={alt} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-gradient-to-br from-brand-lift to-brand-deep text-xs font-bold text-white',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
