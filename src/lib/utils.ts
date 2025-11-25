// ================================================
// TALLY - Utility Functions
// ================================================
// Common helper functions used throughout the app

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

// ================================================
// UI UTILITIES
// ================================================

/**
 * Merges Tailwind CSS classes with proper conflict resolution
 * Used for conditional styling and component variants
 * 
 * @example
 * ```tsx
 * <div className={cn("text-blue-500", error && "text-red-500")}>
 * ```
 */

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
};

// ================================================
// CURRENCY UTILITIES
// ================================================

/**
 * Formats a number as AUD currency
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(0) // "$0.00"
 * ```
 */

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Parses a currency string to a number
 * Handles strings with currency symbols and commas
 * 
 * @param value - Currency string to parse
 * @returns Parsed number value
 * 
 * @example
 * ```ts
 * parseCurrency("$1,234.56") // 1234.56
 * parseCurrency("1234.56") // 1234.56
 * ```
 */

export function parseCurrency(value: string): number {
    /* Remove currency symbols, spaces, and commas */
    const cleaned = value.replace(/[$, \s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

// ================================================
// DATE UTILITIES
// ================================================

/**
 * Formats a date string or Date object
 * 
 * @param date - Date to format (string or Date object)
 * @param formatString - Format pattern (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 * 
 * @example
 * ```ts
 * formatDate('2024-01-15') // "15/01/2024"
 * formatDate(new Date(), 'MMM dd, yyyy') // "Jan 15, 2024"
 * ```
 */

export function formatDate(
    date: string | Date,
    formatString: string = 'dd/MM/yyyy'
): string {
    try {
        const dateObj = typeof date == 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) {
            console.log('Invalid date:', date);
            return 'Invalid date';
        }
        return format(dateObj, formatString);
    } catch(error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

/**
 * Gets ISO date string for today
 * 
 * @returns Today's date in YYYY-MM-DD format
 * 
 * @example
 * ```ts
 * getTodayISO() // "2024-01-15"
 * ```
 */

export function getTodayISO(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Gets start and end dates for a time period
 * 
 * @param period - Time period type
 * @returns Object with start_date and end_date
 * 
 * @example
 * ```ts
 * getDateRange('month') // { start_date: "2024-01-01", end_date: "2024-01-31" }
 * ```
 */

export function getDateRange(period: 'day' | 'week' | 'month' | 'year'): {
    start_date: string;
    end_date: string;
} {
    const now = new Date();
    const end_date = format(now, 'yyyy-MM-dd');
    let start_date: string;
    
    switch (period) {
        case 'day': 
            start_date = end_date;
            break;
        case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            start_date = format(weekAgo, 'yyyy-MM-dd');
            break;
        case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            start_date = format(monthAgo, 'yyyy-MM-dd');
            break;
        case 'year':
            const yearAgo = new Date(now);
            yearAgo.setFullYear(now.getFullYear() - 1);
            start_date = format(yearAgo, 'yyyy-MM-dd');
            break;
        default:
            start_date = end_date;
    }

    return {start_date, end_date};
}

// ================================================
// CALCULATION UTILITIES
// ================================================

/**
 * Calculates total after applying discount
 * 
 * @param price - Original price
 * @param discount - Discount amount (not percentage)
 * @returns Total after discount
 * 
 * @example
 * ```ts
 * calculateTotal(100, 10) // 90
 * calculateTotal(100, 0) // 100
 * ```
 */

export function calculateTotal(price: number, discount: number = 0): number {
    return Math.max(0, price - discount);
}

/**
 * Calculates percentage
 * 
 * @param value - Part value
 * @param total - Total value
 * @returns Percentage (0-100)
 * 
 * @example
 * ```ts
 * calculatePercentage(25, 100) // 25
 * calculatePercentage(1, 3) // 33.33
 * ```
 */

export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
 * Rounds a number to specified decimal places
 * 
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * 
 * @example
 * ```ts
 * roundTo(1.2345, 2) // 1.23
 * roundTo(1.5, 0) // 2
 * ```
 */

export function roundTo(value: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

// ================================================
// VALIDATION UTILITIES
// ================================================

/**
 * Checks if a string is a valid email
 * 
 * @param email - Email string to validate
 * @returns True if valid email format
 * 
 * @example
 * ```ts
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid") // false
 * ```
 */

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Checks if a value is a positive number
 * 
 * @param value - Value to check
 * @returns True if positive number
 * 
 * @example
 * ```ts
 * isPositiveNumber(10) // true
 * isPositiveNumber(-5) // false
 * isPositiveNumber(0) // false
 * ```
 */

export function isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0 && !isNaN(value);
}

// ================================================
// STRING UTILITIES
// ================================================


/**
 * Truncates text to specified length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```ts
 * truncate("Long text here", 10) // "Long text..."
 * truncate("Short", 10) // "Short"
 * ```
 */

export function truncate(text:string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes first letter of each word
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * ```ts
 * capitalize("hello world") // "Hello World"
 * ```
 */

export function capitalize(text: string): string {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ================================================
// ARRAY UTILITIES
// ================================================

/**
 * Groups array items by a key
 * 
 * @param array - Array to group
 * @param keyGetter - Function to get grouping key
 * @returns Map of grouped items
 * 
 * @example
 * ```ts
 * const items = [{type: 'A', val: 1}, {type: 'A', val: 2}, {type: 'B', val: 3}]
 * groupBy(items, item => item.type)
 * // Map { 'A' => [{type: 'A', val: 1}, {type: 'A', val: 2}], 'B' => [{type: 'B', val: 3}] }
 * ```
 */

export function groupBy<T, K>(
    array: T[],
    keyGetter: (item: T) => K
): Map<K, T[]> {
    const map = new Map<K, T[]>();
    array.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);

        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

/**
 * Removes duplicate items from array
 * 
 * @param array - Array with potential duplicates
 * @param key - Optional key function for complex objects
 * @returns Array with unique items
 * 
 * @example
 * ```ts
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 1}, {id: 2}], item => item.id) // [{id: 1}, {id: 2}]
 * ```
 */

export function unique<T>(array: T[], key?: (item: T) => any): T[] {
    if (!key) {
        return Array.from(new Set(array));
    }

    const seen = new Set();
    return array.filter(item => {
        const k = key(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}

// ================================================
// ERROR HANDLING
// ================================================


/**
 * Safely parses JSON with fallback
 * 
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 * 
 * @example
 * ```ts
 * safeJsonParse('{"key": "value"}', {}) // {key: "value"}
 * safeJsonParse('invalid', {}) // {}
 * ```
 */

export function safeJsonParse<T>(jsonString: string, fallback: T): T {
    try {
        return JSON.parse(jsonString);
    } catch {
        return fallback;
    }
}

/**
 * Extracts error message from various error types
 * 
 * @param error - Error object (any type)
 * @returns User-friendly error message
 * 
 * @example
 * ```ts
 * getErrorMessage(new Error("Failed")) // "Failed"
 * getErrorMessage({message: "Custom"}) // "Custom"
 * getErrorMessage("String error") // "String error"
 * ```
 */

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    } 
    return 'An unknown error occurred';
}


