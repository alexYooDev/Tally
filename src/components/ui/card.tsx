import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-50 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Backward compatibility: convenience components
interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  description?: string
  valueColor?: string
  responsive?: boolean
}

export function StatCard({
  label,
  value,
  icon,
  description,
  valueColor = "text-gray-900 dark:text-gray-100",
  responsive = false,
}: StatCardProps) {
  return (
    <Card className="p-3 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className={cn(
          "font-medium text-gray-600 dark:text-gray-400",
          responsive ? "text-xs md:text-sm" : "text-sm"
        )}>
          {label}
        </p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={cn(
        "font-bold",
        responsive ? "text-lg md:text-3xl" : "text-3xl",
        valueColor
      )}>
        {value}
      </p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {description}
        </p>
      )}
    </Card>
  )
}

interface SummaryCardProps {
  title: string
  value: string | number
  shortTitle?: string
  valueColor?: string
  icon?: string
  description?: string
  gradient?: string
  titleColor?: string
  descriptionColor?: string
}

export function SummaryCard({
  title,
  value,
  shortTitle,
  valueColor = "text-gray-900 dark:text-gray-100",
  icon,
  description,
  gradient,
  titleColor = "text-gray-600 dark:text-gray-400",
  descriptionColor = "text-gray-500 dark:text-gray-400",
}: SummaryCardProps) {
  const cardClassName = gradient
    ? cn(gradient, "shadow-sm p-3 md:p-6 rounded-xl border")
    : "p-3 md:p-6"

  const content = (
    <>
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <p className={cn("text-xs md:text-sm font-medium", titleColor)}>
          {shortTitle && (
            <>
              <span className="md:hidden">{shortTitle}</span>
              <span className="hidden md:inline">{title}</span>
            </>
          )}
          {!shortTitle && title}
        </p>
        {icon && <div className="hidden sm:block text-xl md:text-2xl">{icon}</div>}
      </div>
      <p className={cn("text-base sm:text-lg md:text-3xl font-bold mb-1", valueColor)}>
        {value}
      </p>
      {description && (
        <p className={cn("text-[10px] sm:text-xs", descriptionColor)}>
          {description}
        </p>
      )}
    </>
  )

  return gradient ? (
    <div className={cardClassName}>{content}</div>
  ) : (
    <Card className={cardClassName}>{content}</Card>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
