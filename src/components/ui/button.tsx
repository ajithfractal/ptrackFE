import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'outline'
}

function Button({ className, variant = 'default', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' &&
          'bg-primary text-primary-foreground hover:opacity-90',
        variant === 'outline' &&
          'border border-border bg-card text-foreground hover:bg-muted',
        className
      )}
      {...props}
    />
  )
}

export { Button }
