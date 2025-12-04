// ================================================
// Category Select with Delete - Reusable Component
// ================================================
'use client';

import { useState, useRef, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
}

interface CategorySelectWithDeleteProps {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
    onDelete: (categoryId: string) => Promise<void>;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    name?: string;
    id?: string;
}

export function CategorySelectWithDelete({
    categories,
    value,
    onChange,
    onDelete,
    placeholder = 'e.g., Category name',
    disabled = false,
    className = '',
    name,
    id,
}: CategorySelectWithDeleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter categories based on input
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(filter.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle category deletion
    async function handleDelete(e: React.MouseEvent, categoryId: string, categoryName: string) {
        e.stopPropagation();

        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This will remove it from all associated records.`)) {
            await onDelete(categoryId);
            // If the deleted category was selected, clear the input
            if (value === categoryName) {
                onChange('');
            }
        }
    }

    // Handle category selection
    function handleSelect(categoryName: string) {
        onChange(categoryName);
        setFilter('');
        setIsOpen(false);
    }

    // Handle input change
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = e.target.value;
        onChange(inputValue);
        setFilter(inputValue);
        setIsOpen(true);
    }

    // Handle clear button
    function handleClear() {
        onChange('');
        setFilter('');
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={className}
                />
                {value && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        aria-label="Clear category"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && filteredCategories.length > 0 && !disabled && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
                            onClick={() => handleSelect(category.name)}
                        >
                            <span className="text-gray-900 dark:text-gray-100 flex-1">
                                {category.name}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => handleDelete(e, category.id, category.name)}
                                className="ml-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Delete ${category.name}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
