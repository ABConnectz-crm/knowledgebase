'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUiStore } from '@/lib/state/useUiStore';
import { useSearchDocuments } from '@/lib/hooks/useDocumentQuery';

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const [search, setSearch] = useState('');
  const { data: results = [], isLoading } = useSearchDocuments(search);

  // Global keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = useCallback(
    (slug: string) => {
      setCommandPaletteOpen(false);
      setSearch('');
      router.push(`/docs/${slug}`);
    },
    [router, setCommandPaletteOpen],
  );

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Command Palette Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              <Command
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
                shouldFilter={false}
              >
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
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
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search documentation..."
                    className="flex-1 py-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  {isLoading && (
                    <div className="py-8 text-center text-sm text-gray-500">
                      Searching...
                    </div>
                  )}

                  {!isLoading && search.length >= 2 && results.length === 0 && (
                    <Command.Empty className="py-8 text-center text-sm text-gray-500">
                      No results found for "{search}"
                    </Command.Empty>
                  )}

                  {!isLoading && search.length < 2 && (
                    <div className="py-8 text-center text-sm text-gray-500">
                      Type to search documentation...
                    </div>
                  )}

                  {results.map((result) => (
                    <Command.Item
                      key={result.id}
                      value={result.slug}
                      onSelect={() => handleSelect(result.slug)}
                      className="flex flex-col px-4 py-3 cursor-pointer rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {result.title}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      {result.excerpt && (
                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {result.excerpt}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.List>

                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
                        ↑↓
                      </kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
                        ↵
                      </kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
                      {typeof navigator !== 'undefined' &&
                      navigator.platform.toLowerCase().includes('mac')
                        ? '⌘'
                        : 'Ctrl'}
                      K
                    </kbd>
                    to toggle
                  </span>
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
