import * as React from "react"
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
      destructive: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400",
      success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" | "warning" | "success" }
>(({ className, variant = "default", ...props }, ref) => {
  const icons = {
    default: Info,
    destructive: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle2,
  }

  const Icon = icons[variant]

  return (
    <div ref={ref} className={cn("shrink-0", className)} {...props}>
      <Icon className="h-5 w-5" />
    </div>
  )
})
AlertIcon.displayName = "AlertIcon"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Backward compatibility: convenience components
export function ErrorAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="destructive" className={className}>
      <div className="flex items-start gap-3">
        <AlertIcon variant="destructive" />
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}

export function SuccessAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="success" className={className}>
      <div className="flex items-start gap-3">
        <AlertIcon variant="success" />
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}

export function InfoAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="default" className={className}>
      <div className="flex items-start gap-3">
        <AlertIcon variant="default" />
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}

export function WarningAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="warning" className={className}>
      <div className="flex items-start gap-3">
        <AlertIcon variant="warning" />
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}

export { Alert, AlertIcon, AlertTitle, AlertDescription }
