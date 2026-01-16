# ✅ Pre-Commit Checklist - PRIMER COMMIT

> **IMPORTANTE:** Revisa esta lista ANTES de hacer el primer commit

## 🔒 Seguridad (CRÍTICO)

### 1. Archivos Sensibles
- [ ] ✅ `.env` está en `.gitignore`
- [ ] ✅ `.env.local` está en `.gitignore`
- [ ] ✅ `/backups` está en `.gitignore`
- [ ] ✅ `resultado.md` está en `.gitignore`

### 2. Verificar que NO se suban secrets
```bash
# Ejecutar ANTES del commit
git status

# Verificar que NO aparezcan:
# - .env
# - .env.local
# - backups/
# - *.sql
# - resultado.md
```

### 3. Buscar secrets en el código
```bash
# Buscar posibles secrets hardcodeados
grep -r "sk_test_" . --exclude-dir=node_modules
grep -r "pk_test_" . --exclude-dir=node_modules
grep -r "postgresql://" . --exclude-dir=node_modules --exclude=".env*"
grep -r "AIzaSy" . --exclude-dir=node_modules
```

## 📦 Archivos a Incluir

### ✅ Configuración
- [ ] `package.json`
- [ ] `pnpm-lock.yaml`
- [ ] `next.config.ts`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.ts`
- [ ] `postcss.config.mjs`
- [ ] `.npmrc`
- [ ] `.prettierrc`
- [ ] `.prettierignore`
- [ ] `vercel.json`

### ✅ Docker
- [ ] `Dockerfile`
- [ ] `docker-compose.yml`
- [ ] `.dockerignore`

### ✅ CI/CD
- [ ] `.github/workflows/` (todos los archivos)
- [ ] `.github/dependabot.yml`
- [ ] `.github/CODEOWNERS`

### ✅ Scripts
- [ ] `scripts/pre-deploy.sh`
- [ ] `scripts/db-backup.sh`
- [ ] `scripts/docker-build.sh`
- [ ] `scripts/docker-deploy.sh`
- [ ] `scripts/health-check.sh`
- [ ] `scripts/health-check.bat`

### ✅ Documentación
- [ ] `README.md`
- [ ] `CI_CD_README.md`
- [ ] `MIGRATION_GUIDE.md`
- [ ] `DEPLOYMENT_OPTIONS.md`
- [ ] `SCRIPTS_OVERVIEW.md`
- [ ] `DOCS_INDEX.md`

### ✅ Código Fuente
- [ ] `/app` (toda la carpeta)
- [ ] `/components` (toda la carpeta)
- [ ] `/lib` (toda la carpeta)
- [ ] `/types` (toda la carpeta)
- [ ] `/prisma` (schema.prisma y carpeta)
- [ ] `/public` (assets públicos)

### ❌ NO Incluir
- [ ] ❌ `.env`
- [ ] ❌ `.env.local`
- [ ] ❌ `/backups`
- [ ] ❌ `/node_modules`
- [ ] ❌ `/.next`
- [ ] ❌ `resultado.md`
- [ ] ❌ `SOLUCIONES_BUILD.md`
- [ ] ❌ Archivos `.sql` o `.sql.gz`

## 🔍 Validaciones Pre-Commit

### 1. Verificar TypeScript
```bash
pnpm type-check
```

### 2. Verificar Linting
```bash
pnpm lint
```

### 3. Verificar Build
```bash
pnpm build
```

### 4. Verificar que .env.example esté actualizado
```bash
# Comparar .env con .env.example
# Asegurarse de que .env.example tenga todas las variables
# pero SIN valores reales
```

## 📝 Comandos para Primer Commit

```bash
# 1. Inicializar git (si no está inicializado)
git init

# 2. Agregar remote
git remote add origin https://github.com/tu-usuario/socialx.git

# 3. Verificar archivos a commitear
git status

# 4. Revisar que NO haya archivos sensibles
git status | grep -E "\.env|backups|\.sql"

# 5. Agregar archivos
git add .

# 6. Verificar nuevamente
git status

# 7. Commit inicial
git commit -m "chore: initial commit with CI/CD setup"

# 8. Crear rama main (si es necesario)
git branch -M main

# 9. Push
git push -u origin main
```

## 🔐 Después del Primer Commit

### 1. Configurar Secrets en GitHub
**GitHub > Settings > Secrets and variables > Actions > New repository secret**

```bash
# Database
DATABASE_URL
DIRECT_DATABASE_URL

# Auth
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET

# App
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_BASE_URL

# Vercel (para CD)
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Stripe
STRIPE_API_KEY
STRIPE_WEBHOOK_SECRET

# AI & Media
GEMINI_API_KEY
NEXT_PUBLIC_TENOR_API_KEY
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY

# Pusher
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
NEXT_PUBLIC_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER
```

### 2. Configurar Variables en Vercel
**Vercel Dashboard > Project > Settings > Environment Variables**

Agregar las mismas variables que en GitHub Actions.

### 3. Conectar GitHub con Vercel
1. Ir a Vercel Dashboard
2. Import Project
3. Seleccionar tu repositorio
4. Configurar:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
5. Agregar Environment Variables
6. Deploy

## ⚠️ ADVERTENCIAS CRÍTICAS

### 🚨 NUNCA commitear:
- ❌ Archivos `.env` con valores reales
- ❌ Claves de API
- ❌ Passwords de base de datos
- ❌ Tokens de autenticación
- ❌ Backups de base de datos
- ❌ Archivos con información personal

### ✅ SIEMPRE verificar:
- ✅ `.gitignore` está actualizado
- ✅ `git status` antes de commit
- ✅ `.env.example` tiene todas las variables (sin valores)
- ✅ No hay secrets hardcodeados en el código

## 🎯 Checklist Final

Antes de hacer `git push`:

- [ ] ✅ Revisé `git status`
- [ ] ✅ NO hay archivos `.env` en el commit
- [ ] ✅ NO hay archivos de backup en el commit
- [ ] ✅ Ejecuté `pnpm type-check` sin errores
- [ ] ✅ Ejecuté `pnpm lint` sin errores
- [ ] ✅ `.env.example` está actualizado
- [ ] ✅ `.gitignore` está actualizado
- [ ] ✅ Documentación está completa

## 🙏 Buena Suerte!

**Todo va a salir bien!** 🚀

Si algo falla:
1. No entres en pánico
2. Lee el error completo
3. Busca en la documentación
4. Pregunta si necesitas ayuda

---

**Recuerda:** Es mejor tomarse 5 minutos extra para verificar que subir secrets por accidente.
