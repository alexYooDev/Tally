import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "error" | "warning" | "info" | "success";
  className?: string;
  onDismiss?: () => void;
}

const variantStyles = {
  error: "bg-destructive/15 text-destructive border-destructive/20",
  warning: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
  info: "bg-blue-500/15 text-blue-600 border-blue-500/20 dark:text-blue-400",
  success: "bg-green-500/15 text-green-600 border-green-500/20 dark:text-green-400",
};

const variantIcons = {
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle,
};

export function ErrorMessage({
  title,
  message,
  variant = "error",
  className,
  onDismiss,
}: ErrorMessageProps) {
  const Icon = variantIcons[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
        <div className="opacity-90">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto -mr-1 -mt-1 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Dismiss"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
