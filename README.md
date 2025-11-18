# Knowledge Base Platform

Production-grade documentation and knowledge base platform built with Next.js, NestJS, PostgreSQL, and Docker.

## Architecture

- **Frontend**: Next.js 14 (App Router) with React Query, Zustand, Tailwind CSS, Framer Motion
- **Backend**: NestJS with Prisma ORM, PostgreSQL
- **Deployment**: Docker Compose with Nginx reverse proxy

## Project Structure

```
├── web/              # Next.js frontend application
├── api/              # NestJS backend API
├── common/           # Shared TypeScript types and DTOs
├── docker-compose.yml
└── nginx/            # Nginx configuration
```

## Quick Start (Development)

```bash
# Install dependencies
cd web && npm install && cd ..
cd api && npm install && cd ..

# Start with Docker
docker-compose up -d

# Access
Frontend: http://localhost:3000
API: http://localhost:4000
```

## Quick Start (Production - Hostinger VPS)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Features

- ✅ Hierarchical document structure with recursive navigation
- ✅ Command Palette (Cmd+K) with instant search
- ✅ Markdown editor with GitHub Flavored Markdown
- ✅ Related documents (M:N relationships)
- ✅ Optimized tree retrieval with caching
- ✅ API key authentication for admin routes
- ✅ Glassmorphism UI with smooth animations
- ✅ Server-Side Rendering for SEO
- ✅ Docker-ready for easy deployment

## Environment Variables

### API (.env)
```
DATABASE_URL="postgresql://user:password@postgres:5432/knowledgebase"
API_KEY="your-secure-api-key"
PORT=4000
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Backend Framework | NestJS |
| Database | PostgreSQL + Prisma ORM |
| State Management | React Query + Zustand |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Search | cmdk |
| Forms | React Hook Form |
| Container | Docker |
| Reverse Proxy | Nginx |

## License

MIT
