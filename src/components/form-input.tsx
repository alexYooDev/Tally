import React from 'react';

interface FormFieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    helper?: string;
    error?: string;
    children: React.ReactNode;
}

export function FormField({ label, htmlFor, required = false, helper, error, children }: FormFieldProps) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                {label} {required && '*'}
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
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: string;
}

export function Input({ icon, className = '', ...props }: InputProps) {
    const baseStyles = 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500';

    if (icon) {
        return (
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    {icon}
                </span>
                <input
                    className={`${baseStyles} pl-7 ${className}`}
                    {...props}
                />
            </div>
        );
    }

    return (
        <input
            className={`${baseStyles} ${className}`}
            {...props}
        />
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = '', children, ...props }: SelectProps) {
    return (
        <select
            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
    return (
        <textarea
            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${className}`}
            {...props}
        />
    );
}
