'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 border-t border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand */}
          <div className='col-span-1 md:col-span-2'>
            <Link href='/' className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block mb-4'>
              Tally.
            </Link>
            <p className='text-gray-400 mb-4 max-w-md'>
              Your one-stop accounting app for small businesses. Track income, manage expenses, and understand your cash flow—all in one beautiful dashboard.
            </p>
            {/* Social Links */}
            <div className='flex items-center gap-4'>
              <a
                href='https://github.com/alexYooDev/tally-app'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition'
                aria-label='GitHub'
              >
                <Github className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition'
                aria-label='Twitter'
              >
                <Twitter className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition'
                aria-label='LinkedIn'
              >
                <Linkedin className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Product</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#features' className='hover:text-white transition'>
                  Features
                </a>
              </li>
              <li>
                <a href='#get-started' className='hover:text-white transition'>
                  How It Works
                </a>
              </li>
              <li>
                <Link href='/login' className='hover:text-white transition'>
                  Login
                </Link>
              </li>
              <li>
                <Link href='/signup' className='hover:text-white transition'>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition'>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href='https://github.com/alexYooDev/Tally/issues'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white transition'
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-gray-500 text-sm'>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Tally. All rights reserved. Built with ❤️ by{' '}
            <a
              href='https://github.com/alexYooDev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-indigo-400 hover:text-indigo-300 transition'
            >
              AlexYooDev
            </a>
          </p>
          <p className='text-gray-500 text-sm'>
            Powered by Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
