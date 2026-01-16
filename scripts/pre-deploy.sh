#!/bin/bash

# ============================================
# Pre-Deploy Validation Script
# ============================================
# Este script valida que todo esté listo antes del deploy

set -e  # Exit on error

echo "🚀 Starting pre-deploy validation..."
echo ""

# ============================================
# 1. Environment Variables Check
# ============================================
echo "📋 Checking environment variables..."
required_vars=(
  "DATABASE_URL"
  "DIRECT_DATABASE_URL"
  "AUTH_SECRET"
  "NEXT_PUBLIC_APP_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
  echo "❌ Missing required environment variables:"
  printf '   - %s\n' "${missing_vars[@]}"
  exit 1
fi
echo "✅ All required environment variables are set"
echo ""

# ============================================
# 2. Dependencies Check
# ============================================
echo "📦 Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed"
  exit 1
fi
echo "✅ pnpm is installed"
echo ""

# ============================================
# 3. TypeScript Check
# ============================================
echo "🔷 Running TypeScript check..."
if ! npx tsc --noEmit; then
  echo "❌ TypeScript check failed"
  exit 1
fi
echo "✅ TypeScript check passed"
echo ""

# ============================================
# 4. Linting Check
# ============================================
echo "🔍 Running linting..."
if ! pnpm lint; then
  echo "❌ Linting failed"
  exit 1
fi
echo "✅ Linting passed"
echo ""

# ============================================
# 5. Database Check
# ============================================
echo "🗄️ Checking database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
  echo "⚠️  Warning: Cannot connect to database"
  echo "   Deploy may fail if database is required"
else
  echo "✅ Database connection successful"
fi
echo ""

# ============================================
# 6. Prisma Schema Validation
# ============================================
echo "🔍 Validating Prisma schema..."
if ! npx prisma validate; then
  echo "❌ Prisma schema validation failed"
  exit 1
fi
echo "✅ Prisma schema is valid"
echo ""

# ============================================
# 7. Build Test
# ============================================
echo "🏗️ Testing build..."
if ! pnpm build; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build successful"
echo ""

# ============================================
# Success
# ============================================
echo "🎉 All pre-deploy checks passed!"
echo "✅ Ready to deploy"
