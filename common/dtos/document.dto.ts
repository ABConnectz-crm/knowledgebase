// Data Transfer Objects for API communication

export interface CreateDocumentDto {
  title: string;
  slug: string;
  content: string;
  order?: number;
  isPublished?: boolean;
  parentDocumentId?: number | null;
  relatedDocumentIds?: number[];
}

export interface UpdateDocumentDto {
  title?: string;
  slug?: string;
  content?: string;
  order?: number;
  isPublished?: boolean;
  parentDocumentId?: number | null;
  relatedDocumentIds?: number[];
}

export interface SearchResultDto {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
