import Link from 'next/link';
import { Briefcase, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Briefcase,
    title: 'Set up services',
    description: 'Add the services or products you offer with their prices',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/signup',
  },
  {
    number: 2,
    icon: DollarSign,
    title: 'Log income',
    description: 'Record revenue from your services and clients',
    gradient: 'from-green-500 to-emerald-500',
    href: '/signup',
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Track spending',
    description: 'Record business expenses and supplies',
    gradient: 'from-orange-500 to-red-500',
    href: '/signup',
  },
  {
    number: 4,
    icon: TrendingUp,
    title: 'View cash flow',
    description: 'See your complete financial timeline and insights',
    gradient: 'from-purple-500 to-pink-500',
    href: '/signup',
  },
];

export function GetStartedSection() {
  return (
    <section id='get-started' className='py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4'>
            🚀 Quick Start Guide
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Get started in 4 simple steps
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            From setup to insights in minutes. No complicated setup, no learning curve.
          </p>
        </div>

        {/* Steps Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.number}
                href={step.href}
                className='group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20'
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10`} 
                     style={{ padding: '2px' }}>
                  <div className='absolute inset-[2px] bg-white dark:bg-gray-800 rounded-2xl' />
                </div>

                {/* Step Number Badge */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className='w-7 h-7 text-white' />
                </div>

                {/* Content */}
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300'>
                  {step.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'>
                  {step.description}
                </p>

                {/* Arrow Indicator */}
                <div className='flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <span>Get Started</span>
                  <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Connection Lines - Desktop Only */}
        <div className='hidden lg:block relative -mt-32 mb-20 pointer-events-none'>
          <svg className='w-full h-24 opacity-20' viewBox='0 0 1000 100'>
            <path
              d='M 125 50 Q 187.5 20, 250 50'
              stroke='url(#gradient1)'
              strokeWidth='2'
              fill='none'
              strokeDasharray='5,5'
            />
            <path
              d='M 375 50 Q 437.5 20, 500 50'
              stroke='url(#gradient2)'
              strokeWidth='2'
              fill='none'
              strokeDasharray='5,5'
            />
            <path
              d='M 625 50 Q 687.5 20, 750 50'
              stroke='url(#gradient3)'
              strokeWidth='2'
              fill='none'
              strokeDasharray='5,5'
            />
            <defs>
              <linearGradient id='gradient1'>
                <stop offset='0%' stopColor='#3b82f6' />
                <stop offset='100%' stopColor='#10b981' />
              </linearGradient>
              <linearGradient id='gradient2'>
                <stop offset='0%' stopColor='#10b981' />
                <stop offset='100%' stopColor='#f59e0b' />
              </linearGradient>
              <linearGradient id='gradient3'>
                <stop offset='0%' stopColor='#f59e0b' />
                <stop offset='100%' stopColor='#a855f7' />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom CTA */}
        <div className='text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl'>
          <h3 className='text-3xl font-bold text-white mb-4'>
            Ready to simplify your finances?
          </h3>
          <p className='text-indigo-100 text-lg mb-8 max-w-2xl mx-auto'>
            Start tracking your money flow today. No credit card required.
          </p>
          <Link
            href='/signup'
            className='inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl transform hover:scale-105'
          >
            Create Account
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
