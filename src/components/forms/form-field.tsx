import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  helper?: string
  error?: string
  children: React.ReactNode
}

export function FormField({ 
  label, 
  htmlFor, 
  required = false, 
  helper, 
  error, 
  children 
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={cn(
          "block text-sm font-medium mb-2",
          "text-gray-700 dark:text-gray-300"
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
