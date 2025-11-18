'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-4 text-gray-700 dark:text-gray-300 leading-7">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc text-gray-700 dark:text-gray-300 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal text-gray-700 dark:text-gray-300 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-950/20 py-2 pr-4 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children }: any) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-sm font-mono text-primary-600 dark:text-primary-400">
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} block p-4 rounded-lg bg-gray-900 dark:bg-gray-950 text-gray-100 text-sm font-mono overflow-x-auto`}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 rounded-lg overflow-hidden">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100 dark:bg-gray-800">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr>{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" />
  ),
};

interface StyledMarkdownProps {
  content: string;
  className?: string;
}

export function StyledMarkdown({ content, className = '' }: StyledMarkdownProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
