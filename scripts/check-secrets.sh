#!/bin/bash

# ============================================
# Check Secrets Script
# ============================================
# Verifica que no haya secrets antes del commit

echo "🔍 Checking for secrets in staged files..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de problemas
ISSUES=0

# 1. Verificar archivos .env
echo "📋 Checking for .env files..."
if git status --porcelain | grep -E "\.env$|\.env\.local"; then
  echo -e "${RED}❌ ERROR: .env files found in staged files!${NC}"
  echo "   Remove them with: git reset HEAD .env .env.local"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No .env files in staged files${NC}"
fi
echo ""

# 2. Verificar backups
echo "📋 Checking for backup files..."
if git status --porcelain | grep -E "backups/|\.sql|\.sql\.gz"; then
  echo -e "${RED}❌ ERROR: Backup files found in staged files!${NC}"
  echo "   Remove them with: git reset HEAD backups/"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No backup files in staged files${NC}"
fi
echo ""

# 3. Buscar posibles secrets en código
echo "📋 Checking for hardcoded secrets..."

# Stripe keys
if git diff --cached | grep -E "sk_live_|sk_test_|pk_live_|pk_test_"; then
  echo -e "${YELLOW}⚠️  WARNING: Possible Stripe keys found!${NC}"
  ISSUES=$((ISSUES + 1))
fi

# Database URLs con credenciales
if git diff --cached | grep -E "postgresql://[^:]+:[^@]+@"; then
  echo -e "${YELLOW}⚠️  WARNING: Database URL with credentials found!${NC}"
  ISSUES=$((ISSUES + 1))
fi

# API Keys
if git diff --cached | grep -E "AIzaSy[A-Za-z0-9_-]{33}"; then
  echo -e "${YELLOW}⚠️  WARNING: Possible Google API key found!${NC}"
  ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
  echo -e "${GREEN}✅ No hardcoded secrets found${NC}"
fi
echo ""

# 4. Verificar resultado.md
echo "📋 Checking for resultado.md..."
if git status --porcelain | grep "resultado.md"; then
  echo -e "${YELLOW}⚠️  WARNING: resultado.md found in staged files${NC}"
  echo "   This file might contain sensitive information"
  echo "   Remove it with: git reset HEAD resultado.md"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ resultado.md not in staged files${NC}"
fi
echo ""

# Resultado final
if [ $ISSUES -eq 0 ]; then
  echo -e "${GREEN}🎉 All checks passed! Safe to commit.${NC}"
  exit 0
else
  echo -e "${RED}❌ Found $ISSUES potential issue(s). Please review before committing.${NC}"
  exit 1
fi
