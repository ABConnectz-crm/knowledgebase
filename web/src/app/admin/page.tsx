'use client';

import { useState } from 'react';
import { DocumentEditor } from '@/components/ui/DocumentEditor';
import { useCreateDocument, useAllDocuments } from '@/lib/hooks/useDocumentQuery';
import Link from 'next/link';
import type { CreateDocumentDto } from '@common/dtos';

export default function AdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: documents = [], isLoading } = useAllDocuments();
  const createDocument = useCreateDocument();

  const handleCreate = async (data: CreateDocumentDto) => {
    try {
      await createDocument.mutateAsync(data);
      setIsCreating(false);
      alert('Document created successfully!');
    } catch (error) {
      alert('Failed to create document');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your knowledge base content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/docs/getting-started"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                View Docs
              </Link>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                + New Document
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Document Form */}
        {isCreating && (
          <div className="mb-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Create New Document
            </h2>
            <DocumentEditor
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
              isLoading={createDocument.isPending}
            />
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              All Documents
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No documents yet. Create your first one!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {doc.title}
                        </h3>
                        {doc.isPublished ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        /{doc.slug}
                      </p>
                      {doc.parent && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Parent: {doc.parent.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/docs/${doc.slug}`}
                        target="_blank"
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        View
                      </Link>
                      <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
