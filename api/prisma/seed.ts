import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create root documents
  const gettingStarted = await prisma.document.create({
    data: {
      title: 'Getting Started',
      slug: 'getting-started',
      content: `# Getting Started

Welcome to the Knowledge Base Platform! This guide will help you get up and running.

## Quick Start

Follow these simple steps to begin:

1. **Install dependencies**: Run \`npm install\` in both the \`web/\` and \`api/\` directories
2. **Configure environment**: Copy \`.env.example\` to \`.env\` and update values
3. **Start the database**: Run \`docker-compose up -d postgres\`
4. **Run migrations**: Execute \`npm run prisma:migrate\` in the \`api/\` directory
5. **Start development servers**: Run both frontend and backend applications

## What's Next?

Check out the [Architecture](architecture) documentation to understand how the system works.
`,
      order: 0,
      isPublished: true,
    },
  });

  const architecture = await prisma.document.create({
    data: {
      title: 'Architecture',
      slug: 'architecture',
      content: `# System Architecture

The Knowledge Base Platform uses a modern, decoupled architecture:

## Frontend (Next.js)
- Server-Side Rendering for optimal SEO
- App Router for file-based routing
- React Query for server state management
- Zustand for client UI state

## Backend (NestJS)
- RESTful API with TypeScript
- Prisma ORM for database access
- PostgreSQL for data persistence
- JWT authentication for admin routes

## Key Features
- Hierarchical document structure
- Command Palette search (Cmd+K)
- Markdown editing with preview
- Related documents system
`,
      order: 1,
      isPublished: true,
    },
  });

  // Create nested documents under Getting Started
  const installation = await prisma.document.create({
    data: {
      title: 'Installation',
      slug: 'installation',
      content: `# Installation Guide

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Git

## Step-by-Step Installation

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd knowledgebase
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Backend
cd api
npm install

# Frontend
cd ../web
npm install
\`\`\`

### 3. Configure Environment

Copy the example environment files and update with your values:

\`\`\`bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
\`\`\`

### 4. Start Services

\`\`\`bash
# Start all services with Docker
docker-compose up -d
\`\`\`

That's it! Your Knowledge Base Platform is now running.
`,
      order: 0,
      isPublished: true,
      parentDocumentId: gettingStarted.id,
    },
  });

  const configuration = await prisma.document.create({
    data: {
      title: 'Configuration',
      slug: 'configuration',
      content: `# Configuration

## Environment Variables

### API Configuration

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/knowledgebase"
API_KEY="your-secure-api-key"
PORT=4000
\`\`\`

### Frontend Configuration

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Security Considerations

- Always use strong, random API keys in production
- Never commit \`.env\` files to version control
- Use secrets management for production deployments
- Enable HTTPS in production environments
`,
      order: 1,
      isPublished: true,
      parentDocumentId: gettingStarted.id,
    },
  });

  // Create API documentation
  const apiDocs = await prisma.document.create({
    data: {
      title: 'API Reference',
      slug: 'api-reference',
      content: `# API Reference

Complete API documentation for the Knowledge Base Platform.

## Base URL

\`\`\`
http://localhost:4000
\`\`\`

## Authentication

Admin endpoints require an API key in the request header:

\`\`\`
X-API-KEY: your-api-key
\`\`\`

## Endpoints

### Public Endpoints

- \`GET /docs/nav\` - Get navigation tree
- \`GET /docs/:slug\` - Get document by slug
- \`GET /search?q=query\` - Search documents

### Admin Endpoints (Protected)

- \`POST /admin/docs\` - Create document
- \`PUT /admin/docs/:id\` - Update document
- \`DELETE /admin/docs/:id\` - Delete document
`,
      order: 2,
      isPublished: true,
    },
  });

  // Link related documents
  await prisma.document.update({
    where: { id: gettingStarted.id },
    data: {
      relatedDocuments: {
        connect: [{ id: architecture.id }, { id: apiDocs.id }],
      },
    },
  });

  await prisma.document.update({
    where: { id: architecture.id },
    data: {
      relatedDocuments: {
        connect: [{ id: apiDocs.id }],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`
Created documents:
- ${gettingStarted.title} (${gettingStarted.slug})
  - ${installation.title} (${installation.slug})
  - ${configuration.title} (${configuration.slug})
- ${architecture.title} (${architecture.slug})
- ${apiDocs.title} (${apiDocs.slug})
  `);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
