import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
  size?: "default" | "sm" | "lg"
  loading?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "default", loading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl",
      accent: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl",
    }

    const sizes = {
      default: "h-10 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-lg",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
