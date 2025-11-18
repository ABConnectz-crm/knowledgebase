'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/lib/state/useUiStore';
import type { INavigationNode } from '@common/types';

interface DocSidebarProps {
  navigation: INavigationNode[];
}

function NavItem({ node, depth = 0 }: { node: INavigationNode; depth?: number }) {
  const pathname = usePathname();
  const isActive = pathname === `/docs/${node.slug}`;

  return (
    <div>
      <Link
        href={`/docs/${node.slug}`}
        className={`
          block py-2 px-3 rounded-lg text-sm transition-all duration-200
          ${depth > 0 ? 'ml-' + (depth * 4) : ''}
          ${
            isActive
              ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        style={{ marginLeft: depth > 0 ? `${depth * 1}rem` : '0' }}
      >
        {node.title}
      </Link>
      {node.children && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map((child) => (
            <NavItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocSidebar({ navigation }: DocSidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 z-40 lg:sticky lg:top-0 overflow-y-auto"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Docs
            </h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((node) => (
              <NavItem key={node.id} node={node} />
            ))}
          </nav>

          {/* Footer info */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <p>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono">
              {typeof navigator !== 'undefined' &&
              navigator.platform.toLowerCase().includes('mac')
                ? '⌘K'
                : 'Ctrl+K'}
            </kbd> for search</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
