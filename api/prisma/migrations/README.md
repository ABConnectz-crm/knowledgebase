# Initial Prisma Migration

This directory will contain database migrations when you run:

```bash
cd api
npm run prisma:migrate
```

The first migration will be created automatically based on the schema.prisma file.

## Development Setup

1. Start PostgreSQL (via Docker):
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Create and apply migrations:
   ```bash
   cd api
   npm run prisma:migrate
   ```

3. Seed the database:
   ```bash
   npm run prisma:seed
   ```

Migrations are automatically run in Docker via the API Dockerfile CMD.
