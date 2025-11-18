'use client';

import { useForm, Controller } from 'react-hook-form';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { CreateDocumentDto, UpdateDocumentDto } from '@common/dtos';
import type { IDocument } from '@common/types';

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
  ),
});

interface DocumentEditorProps {
  document?: IDocument;
  onSubmit: (data: CreateDocumentDto | UpdateDocumentDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DocumentEditor({
  document,
  onSubmit,
  onCancel,
  isLoading = false,
}: DocumentEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateDocumentDto>({
    defaultValues: document
      ? {
          title: document.title,
          slug: document.slug,
          content: document.content,
          order: document.order,
          isPublished: document.isPublished,
          parentDocumentId: document.parentDocumentId,
        }
      : {
          title: '',
          slug: '',
          content: '',
          order: 0,
          isPublished: false,
          parentDocumentId: null,
        },
  });

  // SimpleMDE configuration
  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder: 'Write your documentation in Markdown...',
      status: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'code',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ],
    }),
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Document title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Slug *
        </label>
        <input
          id="slug"
          type="text"
          {...register('slug', {
            required: 'Slug is required',
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Slug must be lowercase with hyphens (e.g., my-document)',
            },
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="document-slug"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.slug.message}
          </p>
        )}
      </div>

      {/* Content (Markdown Editor) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content *
        </label>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'Content is required' }}
          render={({ field }) => (
            <SimpleMDE
              value={field.value}
              onChange={field.onChange}
              options={editorOptions}
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* Order & Published */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Order
          </label>
          <input
            id="order"
            type="number"
            {...register('order', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('isPublished')}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Published
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : document ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
