# Development Guide

Guide for local development of the Knowledge Base Platform.

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for PostgreSQL)
- Git

## Quick Start (Development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd knowledgebase
```

### 2. Install Dependencies

```bash
# Install API dependencies
cd api
npm install

# Install Web dependencies
cd ../web
npm install

cd ..
```

### 3. Start PostgreSQL Database

```bash
# Start only PostgreSQL using dev compose file
docker-compose -f docker-compose.dev.yml up -d

# Verify it's running
docker-compose -f docker-compose.dev.yml ps
```

### 4. Configure Environment Variables

#### API Environment

```bash
cd api
cp .env.example .env
```

Edit `api/.env`:
```env
DATABASE_URL="postgresql://knowledgebase:knowledgebase@localhost:5432/knowledgebase?schema=public"
API_KEY="dev-api-key-change-in-production"
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

#### Web Environment

```bash
cd ../web
cp .env.example .env.local
```

Edit `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_API_KEY=dev-api-key-change-in-production
```

### 5. Initialize Database

```bash
cd api

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 6. Start Development Servers

Open two terminal windows:

**Terminal 1 - API:**
```bash
cd api
npm run start:dev
```

**Terminal 2 - Web:**
```bash
cd web
npm run dev
```

### 7. Access Application

- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Health: http://localhost:4000/docs/nav
- Prisma Studio: `npm run prisma:studio` (from api directory)

## Development Workflow

### Working with Database

```bash
cd api

# Create a new migration
npm run prisma:migrate

# View/edit data with Prisma Studio
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npm run prisma:generate
```

### Working with API (NestJS)

```bash
cd api

# Start in watch mode
npm run start:dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Working with Frontend (Next.js)

```bash
cd web

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
knowledgebase/
├── api/                    # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Sample data
│   ├── src/
│   │   ├── common/         # Guards, decorators, middleware
│   │   ├── modules/        # Feature modules
│   │   ├── prisma/         # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── web/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities, hooks, state
│   ├── public/
│   └── package.json
│
├── common/                 # Shared TypeScript types
│   ├── types/
│   └── dtos/
│
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
└── DEPLOYMENT.md           # Deployment guide
```

## Key Technologies

### Backend
- **NestJS**: Enterprise-grade Node.js framework
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database
- **Cache Manager**: In-memory caching

### Frontend
- **Next.js 14**: React framework with App Router
- **React Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **cmdk**: Command palette
- **React Hook Form**: Form management
- **React Markdown**: Markdown rendering

## Common Development Tasks

### Add a New API Endpoint

1. Update the controller (`api/src/modules/document/document.controller.ts`)
2. Add business logic to service (`api/src/modules/document/document.service.ts`)
3. Update DTOs if needed (`common/dtos/`)
4. Test the endpoint

### Add a New Frontend Page

1. Create page in `web/src/app/[route]/page.tsx`
2. Add layout if needed: `web/src/app/[route]/layout.tsx`
3. Create components in `web/src/components/`
4. Add API hooks in `web/src/lib/hooks/`

### Modify Database Schema

1. Edit `api/prisma/schema.prisma`
2. Generate migration: `npm run prisma:migrate`
3. Update TypeScript types in `common/types/`
4. Update service layer to use new schema
5. Update frontend hooks if needed

### Add a New UI Component

1. Create component in `web/src/components/ui/`
2. Use Tailwind CSS for styling
3. Add Framer Motion for animations if needed
4. Export from `web/src/components/ui/index.ts`

## Debugging

### API Debugging

```bash
# Start in debug mode
cd api
npm run start:debug

# Attach debugger (VS Code)
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach NestJS",
  "port": 9229
}
```

### Frontend Debugging

- Use React DevTools browser extension
- Check browser console for errors
- Use Next.js built-in error overlay

### Database Debugging

```bash
cd api

# Open Prisma Studio
npm run prisma:studio

# View raw SQL queries
# Add to prisma service:
// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query)
// })
```

## Testing

### API Tests

```bash
cd api

# Run unit tests (when implemented)
npm test

# Run e2e tests (when implemented)
npm run test:e2e

# Test with coverage
npm run test:cov
```

### Frontend Tests

```bash
cd web

# Run tests (when implemented)
npm test
```

## Code Style and Linting

Both projects use ESLint and Prettier:

```bash
# API
cd api
npm run lint
npm run format

# Web
cd web
npm run lint
```

## Environment Variables Reference

### API (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| API_KEY | Secret key for admin authentication | `your-secure-key` |
| PORT | API server port | `4000` |
| NODE_ENV | Environment | `development` or `production` |
| CORS_ORIGIN | Allowed CORS origin | `http://localhost:3000` |

### Web (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | API base URL | `http://localhost:4000` |
| NEXT_PUBLIC_SITE_URL | Frontend base URL | `http://localhost:3000` |
| NEXT_PUBLIC_ADMIN_API_KEY | API key for admin routes | `your-secure-key` |

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Troubleshooting

### Issue: Prisma Client not generated

```bash
cd api
npm run prisma:generate
```

### Issue: Database connection error

- Check PostgreSQL is running: `docker-compose -f docker-compose.dev.yml ps`
- Verify DATABASE_URL in `api/.env`
- Check PostgreSQL logs: `docker-compose -f docker-compose.dev.yml logs postgres`

### Issue: Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

```bash
# Find process using the port
lsof -i :4000  # API
lsof -i :3000  # Web

# Kill the process
kill -9 <PID>
```

### Issue: Next.js build errors

```bash
cd web
rm -rf .next
npm run build
```

## Performance Tips

1. **API Caching**: Navigation tree is cached. Clear with mutations.
2. **React Query**: Configured with 1-minute stale time
3. **Zustand**: Persists UI state to localStorage
4. **Next.js**: Uses ISR and SSR for optimal performance

## Best Practices

1. **Type Safety**: Use TypeScript strictly, define types in `common/`
2. **API Design**: Follow RESTful conventions
3. **Component Structure**: Keep components small and focused
4. **State Management**: Server state in React Query, UI state in Zustand
5. **Error Handling**: Use try-catch and display user-friendly messages
6. **Security**: Never commit secrets, use environment variables
7. **Code Style**: Follow ESLint rules, run `npm run lint` before commits

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## Getting Help

- Check application logs
- Review this documentation
- Check the API at `http://localhost:4000/docs/nav`
- Use Prisma Studio to inspect database

Happy coding! 🚀
