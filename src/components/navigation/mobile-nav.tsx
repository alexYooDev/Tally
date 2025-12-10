// ================================================
// Mobile Navigation Component
// ================================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
    userEmail: string;
    logoutAction: () => Promise<void>;
}

export function MobileNav({ userEmail, logoutAction }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/services', label: 'Services' },
        { href: '/dashboard/income', label: 'Income' },
        { href: '/dashboard/spending', label: 'Spending' },
        { href: '/dashboard/insights', label: '✨ AI Insights' },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Hamburger Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                aria-label='Toggle menu'
            >
                <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    {isOpen ? (
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    ) : (
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16M4 18h16'
                        />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className='fixed inset-0 bg-opacity-30 z-40 md:hidden'
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className='fixed top-16 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-50 md:hidden'>
                        <div className='flex flex-col'>
                            {/* User Info */}
                            <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Signed in as
                                </p>
                                <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                                    {userEmail}
                                </p>
                            </div>

                            {/* Navigation Links */}
                            <nav className='flex flex-col py-2'>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 text-sm font-medium transition ${
                                            isActive(link.href)
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <div className='px-4 py-3 border-t border-gray-200 dark:border-gray-700'>
                                <form action={logoutAction}>
                                    <button
                                        type='submit'
                                        className='w-full text-left text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition'
                                    >
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
