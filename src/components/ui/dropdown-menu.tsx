'use client'

import * as React from "react"
import { useState, useRef, useEffect } from 'react'
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
  align?: 'left' | 'right'
}

export function DropdownMenu({ children, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        right: window.innerWidth - rect.right,
      })
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-lg transition cursor-pointer",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        aria-label="More options"
        aria-expanded={isOpen}
      >
        <span className="text-gray-600 dark:text-gray-400 text-xl leading-none">
          ···
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "fixed w-48 z-50 flex flex-col overflow-hidden",
            "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
            "border border-gray-200 dark:border-gray-700"
          )}
          style={{
            top: `${position.top}px`,
            ...(align === 'right' 
              ? { right: `${position.right}px` }
              : { left: `${position.left}px` }
            )
          }}
          onClick={() => setIsOpen(false)}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  onClick?: () => void
  children: React.ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}

export function DropdownMenuItem({ 
  onClick, 
  children, 
  variant = 'default', 
  className 
}: DropdownMenuItemProps) {
  const variants = {
    default: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
    destructive: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 text-sm transition cursor-pointer",
        "focus-visible:outline-none focus-visible:bg-accent",
        variants[variant],
        className
      )}
      role="menuitem"
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px bg-gray-200 dark:bg-gray-700", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export { DropdownMenuSeparator }
