import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Modern variants
        gradient: "bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors duration-200",
        glass: "bg-white/90 text-gray-900 hover:bg-white border border-gray-200 shadow-md transition-all duration-200",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-md transition-colors duration-200",
        warning: "bg-orange-500 text-white hover:bg-orange-600 shadow-md transition-colors duration-200",
        soft: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 transition-colors duration-200",
        maternal: "bg-purple-500 text-white hover:bg-purple-600 shadow-md transition-colors duration-200",
        health: "bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-colors duration-200",
        emergency: "bg-red-500 text-white hover:bg-red-600 shadow-md transition-colors duration-200"
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]",
        sm: "h-9 rounded-md px-3 min-h-[36px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
        
        // Accessibility sizes for low-literacy users
        accessible: "h-12 px-6 py-3 text-base min-h-[48px]",
        large: "h-14 px-8 py-4 text-lg min-h-[56px]",
        emergency: "h-16 w-16 rounded-full text-xl font-bold min-h-[64px] min-w-[64px]",
        floating: "h-14 w-14 rounded-full min-h-[56px] min-w-[56px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
