import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    const baseStyles = cn(
      "flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600",
      "bg-white dark:bg-gray-800 px-4 py-3 text-sm",
      "text-gray-900 dark:text-gray-100",
      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400",
      "focus-visible:border-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition"
    )

    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </span>
          <input
            type={type}
            className={cn(baseStyles, "pl-10", className)}
            ref={ref}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(baseStyles, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
