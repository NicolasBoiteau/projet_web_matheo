import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils/cn"
import { Loader2 } from "lucide-react"

const variants = {
  primary:
    "bg-gold text-black shadow-sm hover:bg-gold-dark hover:shadow-md hover:shadow-gold/20 focus-visible:ring-gold",
  secondary:
    "bg-fir text-white shadow-sm hover:bg-fir-light hover:shadow-md focus-visible:ring-fir",
  outline:
    "border border-gold text-gold hover:bg-gold hover:text-black focus-visible:ring-gold",
  ghost:
    "text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-white/30",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",
}

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
  xl: "h-14 px-10 text-base",
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  asChild?: boolean
  loading?: boolean
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  )
}