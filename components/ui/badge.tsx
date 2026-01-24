import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 rounded-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 rounded-md",
        outline: "text-foreground rounded-md",
        green:
          "border-transparent bg-mach1-green text-sky-100 rounded-2xl",
        featured:
          "border-transparent bg-dark-blue text-white rounded-full",
        closed:
          "border-transparent bg-neutral-400 text-white rounded-2xl",
        success:
          "border-transparent bg-green-600 text-white rounded-2xl",
        pending:
          "border-transparent bg-amber-500 text-white rounded-2xl",
        red:
          "border-transparent bg-mach1-red text-red-200 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
