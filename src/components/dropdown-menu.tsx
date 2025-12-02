'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    children: React.ReactNode;
    align?: 'left' | 'right';
}

export function DropdownMenu({ children, align = 'right' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8, // 8px gap (mt-2)
                left: rect.left,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer"
                aria-label="More options"
            >
                <span className="text-gray-600 dark:text-gray-400 text-xl leading-none">
                    ···
                </span>
            </button>

            {isOpen && (
                <div
                    className="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
                    style={{
                        top: `${position.top}px`,
                        ...(align === 'right' 
                            ? { right: `${position.right}px` }
                            : { left: `${position.left}px` }
                        )
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

interface DropdownMenuItemProps {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'default' | 'danger';
    className?: string;
}

export function DropdownMenuItem({ onClick, children, variant = 'default', className = '' }: DropdownMenuItemProps) {
    const variantClasses = {
        default: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
    };

    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 text-sm transition cursor-pointer ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
