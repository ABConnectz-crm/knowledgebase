import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { INavigationNode, IDocumentTree } from '@common/types';
import { CreateDocumentDto, UpdateDocumentDto, SearchResultDto } from '@common/dtos';

@Injectable()
export class DocumentService {
  private readonly NAVIGATION_CACHE_KEY = 'navigation:tree';
  private readonly CACHE_TTL = 3600000; // 1 hour in milliseconds

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Optimized navigation tree retrieval with aggressive caching
   *
   * Strategy:
   * 1. Check cache first
   * 2. If miss, fetch flat list of documents (single query)
   * 3. Reconstruct tree in memory (O(n) complexity)
   * 4. Cache the result
   */
  async getNavigationTree(): Promise<IDocumentTree> {
    // Check cache first
    const cached = await this.cacheManager.get<IDocumentTree>(this.NAVIGATION_CACHE_KEY);
    if (cached) {
      console.log('📦 Serving navigation tree from cache');
      return cached;
    }

    console.log('🔄 Building navigation tree from database');

    // Fetch only necessary fields for navigation (optimized query)
    const documents = await this.prisma.document.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        order: true,
        parentDocumentId: true,
      },
      orderBy: { order: 'asc' },
    });

    // Build tree structure in memory (much faster than recursive DB queries)
    const tree = this.buildTree(documents);

    // Cache the result aggressively
    await this.cacheManager.set(this.NAVIGATION_CACHE_KEY, tree, this.CACHE_TTL);

    return tree;
  }

  /**
   * In-memory tree reconstruction algorithm
   * Complexity: O(n) where n is the number of documents
   */
  private buildTree(documents: any[]): IDocumentTree {
    const nodeMap = new Map<number, INavigationNode>();
    const rootNodes: INavigationNode[] = [];

    // First pass: Create all nodes
    documents.forEach((doc) => {
      nodeMap.set(doc.id, {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        order: doc.order,
        parentDocumentId: doc.parentDocumentId,
        children: [],
      });
    });

    // Second pass: Build relationships
    documents.forEach((doc) => {
      const node = nodeMap.get(doc.id)!;

      if (doc.parentDocumentId === null) {
        // Root node
        rootNodes.push(node);
      } else {
        // Child node - attach to parent
        const parent = nodeMap.get(doc.parentDocumentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    // Sort root nodes and all children by order
    const sortByOrder = (nodes: INavigationNode[]) => {
      nodes.sort((a, b) => a.order - b.order);
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortByOrder(node.children);
        }
      });
    };

    sortByOrder(rootNodes);

    return { nodes: rootNodes };
  }

  /**
   * Get a single document by slug with all relations
   */
  async getDocumentBySlug(slug: string) {
    const document = await this.prisma.document.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        relatedDocuments: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            slug: true,
          },
          take: 5,
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with slug '${slug}' not found`);
    }

    if (!document.isPublished) {
      throw new NotFoundException(`Document with slug '${slug}' is not published`);
    }

    return document;
  }

  /**
   * Create a new document (admin only)
   */
  async createDocument(data: CreateDocumentDto) {
    const { relatedDocumentIds, ...documentData } = data;

    const document = await this.prisma.document.create({
      data: {
        ...documentData,
        ...(relatedDocumentIds && {
          relatedDocuments: {
            connect: relatedDocumentIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        parent: true,
        children: true,
        relatedDocuments: true,
      },
    });

    // Invalidate navigation cache
    await this.invalidateNavigationCache();

    return document;
  }

  /**
   * Update an existing document (admin only)
   */
  async updateDocument(id: number, data: UpdateDocumentDto) {
    const { relatedDocumentIds, ...documentData } = data;

    // Check if document exists
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        ...documentData,
        ...(relatedDocumentIds !== undefined && {
          relatedDocuments: {
            set: relatedDocumentIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        parent: true,
        children: true,
        relatedDocuments: true,
      },
    });

    // Invalidate navigation cache
    await this.invalidateNavigationCache();

    return document;
  }

  /**
   * Delete a document (admin only)
   */
  async deleteDocument(id: number) {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.prisma.document.delete({ where: { id } });

    // Invalidate navigation cache
    await this.invalidateNavigationCache();

    return { success: true, message: 'Document deleted successfully' };
  }

  /**
   * Search documents by title and content
   * Optimized for Command Palette instant search
   */
  async searchDocuments(query: string): Promise<SearchResultDto[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const documents = await this.prisma.document.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
      },
      take: 10,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Generate excerpt from content
    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: this.generateExcerpt(doc.content, query),
    }));
  }

  /**
   * Generate a contextual excerpt around the search query
   */
  private generateExcerpt(content: string, query: string, length = 150): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) {
      return content.substring(0, length) + (content.length > length ? '...' : '');
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 100);
    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }

  /**
   * Invalidate navigation cache after mutations
   */
  private async invalidateNavigationCache() {
    await this.cacheManager.del(this.NAVIGATION_CACHE_KEY);
    console.log('🗑️  Navigation cache invalidated');
  }

  /**
   * Get all documents (admin only)
   */
  async getAllDocuments() {
    return this.prisma.document.findMany({
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            children: true,
            relatedDocuments: true,
          },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }
}
