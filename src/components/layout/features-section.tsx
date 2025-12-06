import { TrendingUp, Clock, FolderKanban, LineChart, Smartphone, Shield } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Everything',
    description: 'Complete financial timeline in one intuitive dashboard',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Quick logging for services, income, and expenses in seconds',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: FolderKanban,
    title: 'Stay Organized',
    description: 'Categorize transactions and see where your money flows',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: LineChart,
    title: 'Make Decisions',
    description: 'Real-time insights help you grow your business faster',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Smartphone,
    title: 'Go Mobile',
    description: 'Access your finances anywhere with responsive design',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Stay Secure',
    description: 'Bank-level encryption with Supabase authentication',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

export function FeaturesSection() {
  return (
    <section id='features' className='py-24 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            Everything you need to manage your finances
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Built specifically for independent entrepreneurs and small business owners who need simplicity without sacrificing power.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className='group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-transparent'
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className='w-7 h-7 text-white' />
                </div>

                {/* Content */}
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className='absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <svg className='w-6 h-6 text-indigo-600 dark:text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center'>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Join us and start simplifying your finances
          </p>
          <a
            href='#get-started'
            className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105'
          >
            Start Your Journey
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
