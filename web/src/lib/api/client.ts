import type { IDocumentTree, IDocumentWithRelations } from '@common/types';
import type { SearchResultDto, CreateDocumentDto, UpdateDocumentDto } from '@common/dtos';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

/**
 * Helper to handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Fetch navigation tree
 */
export async function fetchNavigationTree(): Promise<IDocumentTree> {
  try {
    const res = await fetch(`${API_URL}/docs/nav`, {
      cache: 'no-store', // Always get fresh data for SSR
    });
    return await handleResponse<IDocumentTree>(res);
  } catch (error) {
    console.error('Failed to fetch navigation tree:', error);
    throw error;
  }
}

/**
 * Fetch document by slug
 */
export async function fetchDocumentBySlug(slug: string): Promise<IDocumentWithRelations> {
  try {
    const res = await fetch(`${API_URL}/docs/${slug}`, {
      cache: 'no-store', // Always get fresh data for SSR
    });
    return await handleResponse<IDocumentWithRelations>(res);
  } catch (error) {
    console.error(`Failed to fetch document ${slug}:`, error);
    throw error;
  }
}

/**
 * Search documents
 */
export async function searchDocuments(query: string): Promise<SearchResultDto[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    return await handleResponse<SearchResultDto[]>(res);
  } catch (error) {
    console.error('Search failed:', error);
    return []; // Return empty array on search error instead of throwing
  }
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
  return await handleResponse(res);
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
  return await handleResponse(res);
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
  return await handleResponse(res);
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
  return await handleResponse(res);
}
