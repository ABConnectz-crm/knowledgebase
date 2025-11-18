import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNavigationTree,
  fetchDocumentBySlug,
  searchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  fetchAllDocuments,
} from '../api/client';
import type { CreateDocumentDto, UpdateDocumentDto } from '@common/dtos';

/**
 * Hook to fetch navigation tree
 */
export function useNavigationTree() {
  return useQuery({
    queryKey: ['navigation'],
    queryFn: fetchNavigationTree,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch document by slug
 */
export function useDocument(slug: string) {
  return useQuery({
    queryKey: ['document', slug],
    queryFn: () => fetchDocumentBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to search documents
 */
export function useSearchDocuments(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchDocuments(query),
    enabled: query.length >= 2,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch all documents (admin)
 */
export function useAllDocuments() {
  return useQuery({
    queryKey: ['documents', 'all'],
    queryFn: fetchAllDocuments,
  });
}

/**
 * Hook to create document (admin)
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentDto) => createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

/**
 * Hook to update document (admin)
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDocumentDto }) =>
      updateDocument(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document'] });
    },
  });
}

/**
 * Hook to delete document (admin)
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
