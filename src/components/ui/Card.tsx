import { cn } from "@/lib/utils/cn"
import type { ComponentProps } from "react"

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6 pb-0", className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
}