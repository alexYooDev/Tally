'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            href='/'
            className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition'
          >
            Tally.
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <a
              href='#features'
              className={`text-sm font-medium transition ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  : 'text-white hover:text-indigo-200'
              }`}
            >
              Features
            </a>
            <a
              href='#get-started'
              className={`text-sm font-medium transition ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  : 'text-white hover:text-indigo-200'
              }`}
            >
              How It Works
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className='hidden md:flex items-center gap-4'>
            <Link
              href='/login'
              className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  : 'text-white hover:text-indigo-200'
              }`}
            >
              Log in
            </Link>
            <Link
              href='/signup'
              className='text-sm font-medium px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition ${
              isScrolled
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-white'
            }`}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
            <div className='flex flex-col gap-4'>
              <a
                href='#features'
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition'
              >
                Features
              </a>
              <a
                href='#get-started'
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition'
              >
                How It Works
              </a>
              <Link
                href='/login'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition'
              >
                Log in
              </Link>
              <Link
                href='/signup'
                className='text-sm font-medium px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-center'
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
