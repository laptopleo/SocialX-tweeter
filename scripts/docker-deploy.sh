#!/bin/bash

# ============================================
# Docker Deploy Script - VPS Deployment
# ============================================
# Script para deployar en un VPS usando Docker

set -e

echo "🚀 Deploying to VPS..."
echo ""

# Variables (configurar según tu VPS)
VPS_HOST="${VPS_HOST:-your-vps-ip}"
VPS_USER="${VPS_USER:-root}"
VPS_PATH="${VPS_PATH:-/opt/socialx}"
IMAGE_NAME="socialx"
CONTAINER_NAME="socialx-app"

# Verificar que las variables estén configuradas
if [ "$VPS_HOST" = "your-vps-ip" ]; then
  echo "❌ Error: Configure VPS_HOST, VPS_USER y VPS_PATH"
  echo ""
  echo "Ejemplo:"
  echo "  export VPS_HOST=123.45.67.89"
  echo "  export VPS_USER=root"
  echo "  export VPS_PATH=/opt/socialx"
  exit 1
fi

echo "📋 Deploy Configuration:"
echo "   Host: $VPS_HOST"
echo "   User: $VPS_USER"
echo "   Path: $VPS_PATH"
echo ""

# 1. Build imagen localmente
echo "🏗️ Building Docker image..."
./scripts/docker-build.sh

# 2. Guardar imagen como tar
echo "📦 Saving image to tar..."
docker save $IMAGE_NAME:latest | gzip > /tmp/socialx-image.tar.gz

# 3. Copiar imagen al VPS
echo "📤 Uploading image to VPS..."
scp /tmp/socialx-image.tar.gz $VPS_USER@$VPS_HOST:/tmp/

# 4. Copiar docker-compose.yml y .env
echo "📤 Uploading configuration files..."
scp docker-compose.yml $VPS_USER@$VPS_HOST:$VPS_PATH/
scp .env $VPS_USER@$VPS_HOST:$VPS_PATH/

# 5. Ejecutar comandos en el VPS
echo "🚀 Deploying on VPS..."
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
  cd /opt/socialx
  
  # Cargar imagen
  echo "📥 Loading Docker image..."
  docker load < /tmp/socialx-image.tar.gz
  
  # Detener contenedor anterior
  echo "🛑 Stopping old container..."
  docker-compose down || true
  
  # Iniciar nuevo contenedor
  echo "🚀 Starting new container..."
  docker-compose up -d
  
  # Limpiar
  rm /tmp/socialx-image.tar.gz
  
  # Verificar estado
  echo "✅ Deployment complete!"
  docker-compose ps
ENDSSH

# Limpiar archivo local
rm /tmp/socialx-image.tar.gz

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Check status:"
echo "   ssh $VPS_USER@$VPS_HOST 'cd $VPS_PATH && docker-compose ps'"
echo ""
echo "📋 View logs:"
echo "   ssh $VPS_USER@$VPS_HOST 'cd $VPS_PATH && docker-compose logs -f app'"
