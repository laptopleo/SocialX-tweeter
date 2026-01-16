#!/bin/bash

# ============================================
# Database Backup Script
# ============================================
# Crea un backup de la base de datos antes del deploy

set -e

echo "🗄️ Starting database backup..."
echo ""

# Configuración
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

# Extraer información de la URL de la base de datos
# Formato: postgresql://user:password@host:port/database
DB_URL=$DATABASE_URL

echo "📦 Creating backup..."
echo "   File: $BACKUP_FILE"

# Usar pg_dump para crear el backup
if command -v pg_dump &> /dev/null; then
  pg_dump "$DB_URL" > "$BACKUP_FILE"
  echo "✅ Backup created successfully"
else
  echo "⚠️  pg_dump not found, using Prisma..."
  # Alternativa usando Prisma
  npx prisma db pull --force
  echo "✅ Schema pulled successfully"
fi

# Comprimir el backup
if command -v gzip &> /dev/null; then
  gzip "$BACKUP_FILE"
  echo "✅ Backup compressed: ${BACKUP_FILE}.gz"
fi

# Limpiar backups antiguos (mantener solo los últimos 7)
echo "🧹 Cleaning old backups..."
ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm
echo "✅ Old backups cleaned"

echo ""
echo "🎉 Backup completed successfully!"
echo "   Location: $BACKUP_FILE"
