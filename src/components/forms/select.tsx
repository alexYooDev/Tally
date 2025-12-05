import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 px-4 py-3 text-sm",
          "text-gray-900 dark:text-gray-100",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400",
          "focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
