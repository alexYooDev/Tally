import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent",
      secondary: "bg-secondary text-secondary-foreground border-transparent",
      destructive: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-transparent",
      outline: "text-foreground border-input",
      success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-transparent",
      warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-transparent",
      info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-transparent",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

// Backward compatibility: payment method badge helper
export function getPaymentMethodBadgeVariant(method: string): BadgeProps["variant"] {
  const methodMap: Record<string, BadgeProps["variant"]> = {
    cash: "success",
    card: "info",
    bank_transfer: "info",
    paypal: "info",
    other: "default",
  }
  return methodMap[method] || "default"
}

export { Badge }
