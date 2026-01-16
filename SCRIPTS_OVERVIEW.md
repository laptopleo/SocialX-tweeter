# 📋 Scripts Overview - Guía Completa

## 🗂️ Estructura de Scripts

```
scripts/
├── health-check.sh          ✅ (Ya existía) - Health check Linux/Mac
├── health-check.bat         ✅ (Ya existía) - Health check Windows
├── pre-deploy.sh            ✅ (Nuevo) - Validaciones pre-deploy
├── db-backup.sh             ✅ (Nuevo) - Backup de base de datos
├── docker-build.sh          ✅ (Nuevo) - Build de imagen Docker
└── docker-deploy.sh         ✅ (Nuevo) - Deploy a VPS
```

---

## 🚀 Scripts Disponibles en package.json

### Development
```bash
pnpm dev                    # Desarrollo con Turbopack
pnpm dev:normal             # Desarrollo sin Turbopack
pnpm dev:webpack            # Desarrollo con Webpack
```

### Build & Deploy
```bash
pnpm build                  # Build de producción
pnpm build:clean            # Limpia .next y hace build
pnpm start                  # Inicia servidor de producción
pnpm deep-clean             # Limpieza profunda (node_modules + .next)
```

### Quality Checks
```bash
pnpm lint                   # ESLint
pnpm lint:fix               # ESLint con auto-fix
pnpm type-check             # TypeScript check (tsc --noEmit)
pnpm validate               # Lint + Type check
pnpm format                 # Prettier format
pnpm format:check           # Prettier check
```

### Pre-Deploy Validation
```bash
pnpm pre-deploy             # ✅ Ejecuta scripts/pre-deploy.sh
                            # Valida:
                            # - Variables de entorno
                            # - Dependencias
                            # - TypeScript
                            # - Linting
                            # - Conexión a DB
                            # - Prisma schema
                            # - Build test
```

### Database
```bash
pnpm db:backup              # ✅ Ejecuta scripts/db-backup.sh
                            # Crea backup de la DB
                            # Comprime con gzip
                            # Limpia backups antiguos

pnpm db:push                # Push schema a DB (sin migración)
pnpm db:migrate             # Crear migración
pnpm db:migrate:deploy      # Deploy migraciones en producción
pnpm db:studio              # Abrir Prisma Studio
pnpm db:seed                # Seed de datos
```

### Docker
```bash
pnpm docker:build           # ✅ Ejecuta scripts/docker-build.sh
                            # Build de imagen Docker optimizada

pnpm docker:run             # Ejecuta contenedor localmente
pnpm docker:compose:up      # Levanta stack completo (app + DB + Redis)
pnpm docker:compose:down    # Detiene stack
pnpm docker:compose:logs    # Ver logs del contenedor
pnpm docker:deploy          # ✅ Ejecuta scripts/docker-deploy.sh
                            # Deploy automático a VPS
```

### Health Checks
```bash
pnpm health-check           # Health check (Linux/Mac)
pnpm health-check-win       # Health check (Windows)
pnpm advanced-scan          # Escaneo avanzado
pnpm full-analysis          # Análisis completo
```

---

## 📝 Detalles de Scripts Nuevos

### 1. `scripts/pre-deploy.sh`

**Propósito:** Validar que todo esté listo antes del deploy

**Validaciones:**
1. ✅ Variables de entorno requeridas
2. ✅ Dependencias instaladas (pnpm)
3. ✅ TypeScript check (sin errores)
4. ✅ Linting (sin errores)
5. ✅ Conexión a base de datos
6. ✅ Prisma schema válido
7. ✅ Build exitoso

**Uso:**
```bash
# Antes de hacer deploy
pnpm pre-deploy

# Si todo pasa, estás listo para deploy
```

**Ejemplo de salida:**
```
🚀 Starting pre-deploy validation...

📋 Checking environment variables...
✅ All required environment variables are set

📦 Checking dependencies...
✅ pnpm is installed

🔷 Running TypeScript check...
✅ TypeScript check passed

🔍 Running linting...
✅ Linting passed

🗄️ Checking database connection...
✅ Database connection successful

🔍 Validating Prisma schema...
✅ Prisma schema is valid

🏗️ Testing build...
✅ Build successful

🎉 All pre-deploy checks passed!
✅ Ready to deploy
```

---

### 2. `scripts/db-backup.sh`

**Propósito:** Crear backup de la base de datos antes del deploy

**Funcionalidades:**
1. ✅ Crea backup con timestamp
2. ✅ Comprime con gzip
3. ✅ Limpia backups antiguos (mantiene últimos 7)
4. ✅ Usa pg_dump o Prisma como fallback

**Uso:**
```bash
# Crear backup manual
pnpm db:backup

# Los backups se guardan en ./backups/
```

**Estructura de backups:**
```
backups/
├── backup_20250115_143022.sql.gz
├── backup_20250114_120000.sql.gz
├── backup_20250113_120000.sql.gz
└── ...
```

**Ejemplo de salida:**
```
🗄️ Starting database backup...

📦 Creating backup...
   File: ./backups/backup_20250115_143022.sql
✅ Backup created successfully
✅ Backup compressed: ./backups/backup_20250115_143022.sql.gz
🧹 Cleaning old backups...
✅ Old backups cleaned

🎉 Backup completed successfully!
   Location: ./backups/backup_20250115_143022.sql
```

---

### 3. `scripts/docker-build.sh`

**Propósito:** Build de imagen Docker optimizada

**Funcionalidades:**
1. ✅ Build multi-stage optimizado
2. ✅ Muestra tamaño de imagen
3. ✅ Instrucciones de uso

**Uso:**
```bash
pnpm docker:build
```

**Ejemplo de salida:**
```
🐳 Building Docker image...

📦 Building image: socialx:latest
[+] Building 45.2s (18/18) FINISHED
...

✅ Docker image built successfully!

📊 Image details:
socialx   latest   abc123def456   2 minutes ago   450MB

🚀 To run the container:
   docker run -p 3000:3000 --env-file .env socialx:latest

🐳 Or use docker-compose:
   docker-compose up -d
```

---

### 4. `scripts/docker-deploy.sh`

**Propósito:** Deploy automático a VPS

**Funcionalidades:**
1. ✅ Build de imagen
2. ✅ Upload a VPS
3. ✅ Deploy automático
4. ✅ Verificación de estado

**Configuración:**
```bash
# Configurar variables de entorno
export VPS_HOST=123.45.67.89
export VPS_USER=root
export VPS_PATH=/opt/socialx
```

**Uso:**
```bash
# Deploy a VPS
pnpm docker:deploy
```

**Ejemplo de salida:**
```
🚀 Deploying to VPS...

📋 Deploy Configuration:
   Host: 123.45.67.89
   User: root
   Path: /opt/socialx

🏗️ Building Docker image...
📦 Saving image to tar...
📤 Uploading image to VPS...
📤 Uploading configuration files...
🚀 Deploying on VPS...
📥 Loading Docker image...
🛑 Stopping old container...
🚀 Starting new container...
✅ Deployment complete!

🎉 Deployment completed successfully!

📊 Check status:
   ssh root@123.45.67.89 'cd /opt/socialx && docker-compose ps'

📋 View logs:
   ssh root@123.45.67.89 'cd /opt/socialx && docker-compose logs -f app'
```

---

## 🔄 Workflows Recomendados

### Workflow 1: Deploy a Vercel (Automático)
```bash
# 1. Validar localmente
pnpm validate

# 2. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 3. GitHub Actions hace el resto automáticamente
```

### Workflow 2: Deploy Manual con Validación
```bash
# 1. Validaciones completas
pnpm pre-deploy

# 2. Crear backup de DB
pnpm db:backup

# 3. Deploy (Vercel hace esto automáticamente)
git push origin main
```

### Workflow 3: Deploy a VPS
```bash
# 1. Validaciones
pnpm pre-deploy

# 2. Backup
pnpm db:backup

# 3. Build Docker
pnpm docker:build

# 4. Deploy a VPS
pnpm docker:deploy
```

### Workflow 4: Desarrollo Local con Docker
```bash
# 1. Levantar stack completo
pnpm docker:compose:up

# 2. Ver logs
pnpm docker:compose:logs

# 3. Cuando termines
pnpm docker:compose:down
```

---

## 🎯 Casos de Uso

### Antes de cada deploy
```bash
pnpm pre-deploy
```

### Backup semanal de DB
```bash
pnpm db:backup
```

### Probar Docker localmente
```bash
pnpm docker:build
pnpm docker:run
```

### Migrar a VPS
```bash
# Configurar VPS
export VPS_HOST=your-ip
export VPS_USER=root
export VPS_PATH=/opt/socialx

# Deploy
pnpm docker:deploy
```

---

## ✅ Checklist de Scripts

- ✅ `pre-deploy.sh` - Creado y funcional
- ✅ `db-backup.sh` - Creado y funcional
- ✅ `docker-build.sh` - Creado y funcional
- ✅ `docker-deploy.sh` - Creado y funcional
- ✅ Scripts en `package.json` - Configurados
- ✅ Permisos de ejecución - Necesarios en Linux/Mac

---

## 🔧 Configuración Inicial (Linux/Mac)

```bash
# Dar permisos de ejecución a los scripts
chmod +x scripts/*.sh

# Verificar
ls -la scripts/
```

---

## 📚 Documentación Relacionada

- **CI_CD_README.md** - Documentación de CI/CD
- **MIGRATION_GUIDE.md** - Guía de migración a VPS
- **DEPLOYMENT_OPTIONS.md** - Comparación de plataformas
- **README.md** - Documentación general

---

**Última actualización:** 2025-01-15
