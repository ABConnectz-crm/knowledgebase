#!/bin/bash

# Knowledge Base Platform - Quick Start Script
# This script helps you start the development environment quickly

set -e

echo "🚀 Knowledge Base Platform - Development Startup"
echo "=================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if .env files exist
if [ ! -f "api/.env" ]; then
    echo "⚠️  API .env file not found. Copying from example..."
    cp api/.env.example api/.env
    echo "✅ Created api/.env - Please update with your values"
fi

if [ ! -f "web/.env.local" ]; then
    echo "⚠️  Web .env.local file not found. Copying from example..."
    cp web/.env.example web/.env.local
    echo "✅ Created web/.env.local - Please update with your values"
fi

# Start PostgreSQL
echo ""
echo "📦 Starting PostgreSQL database..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if node_modules exist
if [ ! -d "api/node_modules" ]; then
    echo ""
    echo "📥 Installing API dependencies..."
    cd api && npm install && cd ..
fi

if [ ! -d "web/node_modules" ]; then
    echo ""
    echo "📥 Installing Web dependencies..."
    cd web && npm install && cd ..
fi

# Run Prisma migrations
echo ""
echo "🗄️  Running database migrations..."
cd api
npm run prisma:generate
npm run prisma:migrate
echo ""
echo "🌱 Seeding database..."
npm run prisma:seed || echo "⚠️  Seeding failed or already seeded"
cd ..

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "To start development servers, open two terminals:"
echo ""
echo "Terminal 1 (API):"
echo "  cd api && npm run start:dev"
echo ""
echo "Terminal 2 (Web):"
echo "  cd web && npm run dev"
echo ""
echo "Then access:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:4000"
echo "  - Prisma Studio: cd api && npm run prisma:studio"
echo ""
echo "=================================================="
