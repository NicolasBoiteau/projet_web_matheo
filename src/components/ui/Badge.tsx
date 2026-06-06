import { cn } from "@/lib/utils/cn"
import type { ComponentProps } from "react"

const badgeVariants = {
  default: "bg-gold/10 text-gold border-gold/20",
  secondary: "bg-fir/10 text-fir border-fir/20",
  outline: "border-white/20 text-white",
  sale: "bg-red-500/10 text-red-400 border-red-500/20",
}

type BadgeProps = ComponentProps<"span"> & {
  variant?: keyof typeof badgeVariants
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}