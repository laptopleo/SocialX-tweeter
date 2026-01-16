#!/bin/bash

# ============================================
# Docker Build Script
# ============================================
# Construye la imagen Docker optimizada

set -e

echo "🐳 Building Docker image..."
echo ""

# Variables
IMAGE_NAME="socialx"
IMAGE_TAG="latest"
PLATFORM="linux/amd64"

# Build con cache
echo "📦 Building image: $IMAGE_NAME:$IMAGE_TAG"
docker build \
  --platform $PLATFORM \
  --tag $IMAGE_NAME:$IMAGE_TAG \
  --build-arg NODE_ENV=production \
  --progress=plain \
  .

echo ""
echo "✅ Docker image built successfully!"
echo ""
echo "📊 Image details:"
docker images $IMAGE_NAME:$IMAGE_TAG

echo ""
echo "🚀 To run the container:"
echo "   docker run -p 3000:3000 --env-file .env $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "🐳 Or use docker-compose:"
echo "   docker-compose up -d"
