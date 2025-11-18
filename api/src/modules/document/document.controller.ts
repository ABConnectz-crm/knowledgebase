import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { Public } from '../../common/decorators/public.decorator';
import { CreateDocumentDto, UpdateDocumentDto, ApiResponse } from '@common/dtos';

@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // ==================== PUBLIC ROUTES ====================

  /**
   * Get navigation tree (cached)
   * Used by frontend sidebar
   */
  @Public()
  @Get('docs/nav')
  async getNavigationTree() {
    const tree = await this.documentService.getNavigationTree();
    return {
      success: true,
      data: tree,
    };
  }

  /**
   * Get document by slug
   * Used for displaying document content
   */
  @Public()
  @Get('docs/:slug')
  async getDocumentBySlug(@Param('slug') slug: string) {
    const document = await this.documentService.getDocumentBySlug(slug);
    return {
      success: true,
      data: document,
    };
  }

  /**
   * Search documents
   * Used by Command Palette (Cmd+K)
   */
  @Public()
  @Get('search')
  async searchDocuments(@Query('q') query: string) {
    const results = await this.documentService.searchDocuments(query);
    return {
      success: true,
      data: results,
    };
  }

  // ==================== ADMIN ROUTES (Protected) ====================

  /**
   * Get all documents (includes unpublished)
   */
  @Get('admin/docs')
  async getAllDocuments() {
    const documents = await this.documentService.getAllDocuments();
    return {
      success: true,
      data: documents,
    };
  }

  /**
   * Create a new document
   */
  @Post('admin/docs')
  @HttpCode(HttpStatus.CREATED)
  async createDocument(@Body() data: CreateDocumentDto) {
    const document = await this.documentService.createDocument(data);
    return {
      success: true,
      data: document,
      message: 'Document created successfully',
    };
  }

  /**
   * Update an existing document
   */
  @Put('admin/docs/:id')
  async updateDocument(
    @Param('id') id: string,
    @Body() data: UpdateDocumentDto,
  ) {
    const document = await this.documentService.updateDocument(
      parseInt(id, 10),
      data,
    );
    return {
      success: true,
      data: document,
      message: 'Document updated successfully',
    };
  }

  /**
   * Delete a document
   */
  @Delete('admin/docs/:id')
  async deleteDocument(@Param('id') id: string) {
    const result = await this.documentService.deleteDocument(parseInt(id, 10));
    return result;
  }
}
