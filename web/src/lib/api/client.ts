import type { IDocumentTree, IDocumentWithRelations } from '@common/types';
import type { SearchResultDto, CreateDocumentDto, UpdateDocumentDto } from '@common/dtos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

/**
 * Fetch navigation tree
 */
export async function fetchNavigationTree(): Promise<IDocumentTree> {
  const res = await fetch(`${API_URL}/docs/nav`);
  if (!res.ok) throw new Error('Failed to fetch navigation tree');
  const data = await res.json();
  return data.data;
}

/**
 * Fetch document by slug
 */
export async function fetchDocumentBySlug(slug: string): Promise<IDocumentWithRelations> {
  const res = await fetch(`${API_URL}/docs/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch document: ${slug}`);
  const data = await res.json();
  return data.data;
}

/**
 * Search documents
 */
export async function searchDocuments(query: string): Promise<SearchResultDto[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search documents');
  const data = await res.json();
  return data.data;
}

/**
 * Create document (admin)
 */
export async function createDocument(data: CreateDocumentDto) {
  const res = await fetch(`${API_URL}/admin/docs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

/**
 * Update document (admin)
 */
export async function updateDocument(id: number, data: UpdateDocumentDto) {
  const res = await fetch(`${API_URL}/admin/docs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

/**
 * Delete document (admin)
 */
export async function deleteDocument(id: number) {
  const res = await fetch(`${API_URL}/admin/docs/${id}`, {
    method: 'DELETE',
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

/**
 * Fetch all documents (admin)
 */
export async function fetchAllDocuments() {
  const res = await fetch(`${API_URL}/admin/docs`, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch all documents');
  const data = await res.json();
  return data.data;
}
