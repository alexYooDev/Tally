'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/hero-background.png'
          alt='Financial dashboard background'
          fill
          className='object-cover'
          priority
        />
        {/* Gradient Overlay for readability */}
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-indigo-800/90' />
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium mb-8'>
          <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
          Built for Independent Entrepreneurs
        </div>

        {/* Main Heading */}
        <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6'>
          Money Flow Made
          <span className='block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
            EASY
          </span>
        </h1>

        {/* Subheading */}
        <p className='text-xl sm:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto'>
          Your one-stop accounting app for small businesses.
          <br />
          Track income, manage expenses, and understand your cash flow
          <br />
          — All in ONE beautiful dashboard!
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link
            href='/signup'
            className='group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105'
          >
            Get Started
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </Link>
          <a
            href='#features'
            className='group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20'
          >
            <Play className='w-5 h-5' />
            See How It Works
          </a>
        </div>

        {/* Trust Indicators */}
        <div className='mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-indigo-200'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center'>
              <svg className='w-5 h-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <span className='text-sm font-medium'>High Security</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center'>
              <svg className='w-5 h-5 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
              </svg>
            </div>
            <span className='text-sm font-medium'>Mobile Ready</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center'>
              <svg className='w-5 h-5 text-purple-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <span className='text-sm font-medium'>Lightning Fast</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <svg className='w-6 h-6 text-white/60' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
        </svg>
      </div>
    </section>
  );
}
