# ============================================
# 🐳 Dockerfile - Plan B para Self-Hosting
# ============================================
# Este Dockerfile te permite migrar de Vercel a cualquier VPS
# en cuestión de horas si es necesario.
#
# Uso:
#   docker build -t socialx .
#   docker run -p 3000:3000 --env-file .env socialx
#
# Deploy en VPS:
#   - DigitalOcean App Platform
#   - Railway
#   - Fly.io
#   - Render
#   - AWS ECS/Fargate
#   - Google Cloud Run
#   - Azure Container Apps
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat openssl

# Configurar directorio de trabajo
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependencias
RUN pnpm install --frozen-lockfile --prod=false

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar Prisma Client
RUN pnpm prisma generate

# Build de Next.js
RUN pnpm build

# ============================================
# Stage 3: Runner (Imagen final)
# ============================================
FROM node:20-alpine AS runner

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl curl

WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios del builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambiar permisos
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]
