import { fetchDocumentBySlug } from '@/lib/api/client';
import { StyledMarkdown } from '@/components/ui/StyledMarkdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface DocPageProps {
  params: {
    slug: string;
  };
}

export default async function DocPage({ params }: DocPageProps) {
  let document;

  try {
    document = await fetchDocumentBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  // Format date safely (handles both Date objects and ISO strings)
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="animate-fade-in">
      {/* Breadcrumbs */}
      {document.parent && (
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link
                href={`/docs/${document.parent.slug}`}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {document.parent.title}
              </Link>
            </li>
            <li>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li className="text-gray-900 dark:text-white">{document.title}</li>
          </ol>
        </nav>
      )}

      {/* Document Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {document.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time>
            Updated {formatDate(document.updatedAt)}
          </time>
        </div>
      </header>

      {/* Document Content */}
      <StyledMarkdown content={document.content} />

      {/* Related Documents */}
      {document.relatedDocuments && document.relatedDocuments.length > 0 && (
        <aside className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {document.relatedDocuments.map((related) => (
              <Link
                key={related.id}
                href={`/docs/${related.slug}`}
                className="group p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200"
              >
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {related.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Click to read more →
                </p>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Child Documents */}
      {document.children && document.children.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            In This Section
          </h2>
          <div className="space-y-2">
            {document.children.map((child) => (
              <Link
                key={child.id}
                href={`/docs/${child.slug}`}
                className="group flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {child.title}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
