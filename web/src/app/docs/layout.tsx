import { fetchNavigationTree } from '@/lib/api/client';
import { DocSidebar } from '@/components/layouts/DocSidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationTree = await fetchNavigationTree();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Knowledge Base
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
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
                Search
                <kbd className="ml-1 px-1.5 py-0.5 text-xs rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  ⌘K
                </kbd>
              </button>
              <ThemeToggle />
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex max-w-screen-2xl mx-auto">
        {/* Sidebar */}
        <DocSidebar navigation={navigationTree.nodes} />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
