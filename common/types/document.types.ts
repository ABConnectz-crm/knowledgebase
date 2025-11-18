// Shared TypeScript types for Document entities across frontend and backend

export interface IDocument {
  id: number;
  title: string;
  slug: string;
  content: string;
  order: number;
  isPublished: boolean;
  parentDocumentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentWithChildren extends IDocument {
  children: IDocumentWithChildren[];
}

export interface IDocumentWithRelations extends IDocument {
  parent?: IDocument | null;
  children: IDocument[];
  relatedDocuments: IDocument[];
}

export interface INavigationNode {
  id: number;
  title: string;
  slug: string;
  order: number;
  parentDocumentId: number | null;
  children: INavigationNode[];
}

export interface IDocumentTree {
  nodes: INavigationNode[];
}
