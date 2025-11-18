import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-30" />

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Knowledge Base
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up">
              Modern documentation platform built with Next.js, NestJS, and PostgreSQL.
              Fast, scalable, and beautiful.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link
                href="/docs/getting-started"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
              <button
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Docs
                <kbd className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description:
      'Optimized tree retrieval with aggressive caching ensures instant navigation and search.',
  },
  {
    icon: '🎨',
    title: 'Beautiful UI',
    description:
      'Glassmorphism design with dark mode, smooth animations, and modern aesthetics.',
  },
  {
    icon: '🔍',
    title: 'Powerful Search',
    description:
      'Command Palette (Cmd+K) with instant search across all documentation.',
  },
  {
    icon: '📝',
    title: 'Markdown Editor',
    description:
      'GitHub Flavored Markdown with live preview and syntax highlighting.',
  },
  {
    icon: '🔒',
    title: 'Secure Admin',
    description:
      'API key authentication with granular access control for admin routes.',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description:
      'Docker deployment, Nginx reverse proxy, and environment-based configuration.',
  },
];
