# 🚀 Quick Start - Primer Deploy

## ⚡ Pasos Rápidos (15 minutos)

### 1. Verificar Seguridad (2 min)
```bash
# Verificar que no haya secrets
pnpm check-secrets

# Verificar archivos a commitear
git status

# Debe mostrar:
# ✅ Archivos de código
# ✅ Configuración
# ❌ NO debe mostrar .env
# ❌ NO debe mostrar backups/
```

### 2. Primer Commit (3 min)
```bash
# Inicializar git (si no está)
git init

# Agregar remote
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Agregar archivos
git add .

# Verificar nuevamente
pnpm check-secrets

# Commit
git commit -m "chore: initial commit with CI/CD setup"

# Push
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Secrets (5 min)
**GitHub > Settings > Secrets and variables > Actions**

Copiar de tu `.env` local:
```bash
DATABASE_URL
DIRECT_DATABASE_URL
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_BASE_URL
VERCEL_TOKEN          # Obtener de Vercel
VERCEL_ORG_ID         # Obtener de Vercel
VERCEL_PROJECT_ID     # Obtener de Vercel
STRIPE_API_KEY
STRIPE_WEBHOOK_SECRET
GEMINI_API_KEY
NEXT_PUBLIC_TENOR_API_KEY
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
NEXT_PUBLIC_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER
```

### 4. Deploy en Vercel (5 min)

#### Opción A: Desde Vercel Dashboard
1. Ir a https://vercel.com/dashboard
2. Click "Import Project"
3. Seleccionar tu repositorio de GitHub
4. Configurar:
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
5. Agregar Environment Variables (copiar de .env)
6. Click "Deploy"

#### Opción B: Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir las instrucciones
```

### 5. Obtener Tokens de Vercel
```bash
# 1. VERCEL_TOKEN
# Vercel Dashboard > Settings > Tokens > Create Token

# 2. VERCEL_ORG_ID y VERCEL_PROJECT_ID
# Ejecutar en tu proyecto:
vercel link

# Los IDs se guardan en .vercel/project.json
cat .vercel/project.json
```

### 6. Verificar Deploy (2 min)
```bash
# Ver workflows en GitHub
# GitHub > Actions

# Verificar que pasen:
# ✅ CI Pipeline
# ✅ CD Deploy (si hiciste push a main)

# Verificar en Vercel
# Vercel Dashboard > Tu Proyecto > Deployments
```

---

## 🎯 Checklist Rápido

Antes de empezar:
- [ ] ✅ Tengo cuenta en GitHub
- [ ] ✅ Tengo cuenta en Vercel
- [ ] ✅ Tengo base de datos PostgreSQL (Neon, Supabase, etc.)
- [ ] ✅ Tengo todas las API keys necesarias

Seguridad:
- [ ] ✅ `.env` está en `.gitignore`
- [ ] ✅ Ejecuté `pnpm check-secrets`
- [ ] ✅ `.env.example` no tiene valores reales

Commit:
- [ ] ✅ Hice `git init`
- [ ] ✅ Agregué remote de GitHub
- [ ] ✅ Hice primer commit
- [ ] ✅ Hice push a main

GitHub:
- [ ] ✅ Configuré todos los secrets
- [ ] ✅ Workflows están activos

Vercel:
- [ ] ✅ Importé el proyecto
- [ ] ✅ Configuré variables de entorno
- [ ] ✅ Deploy exitoso
- [ ] ✅ Obtuve VERCEL_TOKEN, ORG_ID, PROJECT_ID
- [ ] ✅ Agregué tokens a GitHub Secrets

---

## 🚨 Si Algo Sale Mal

### Error: "Module not found"
```bash
# Limpiar y reinstalar
pnpm install
pnpm build
```

### Error: "Database connection failed"
```bash
# Verificar DATABASE_URL en Vercel
# Vercel Dashboard > Settings > Environment Variables
```

### Error: "Build failed"
```bash
# Ver logs en Vercel
# Vercel Dashboard > Deployments > Ver logs

# Probar localmente
pnpm build
```

### Workflows no se ejecutan
```bash
# Verificar que los archivos estén en:
# .github/workflows/

# Verificar en GitHub:
# Settings > Actions > General > Allow all actions
```

---

## 📚 Próximos Pasos

Después del primer deploy:
1. ✅ Configurar dominio custom en Vercel
2. ✅ Configurar Dependabot (ya está configurado)
3. ✅ Revisar Lighthouse reports
4. ✅ Configurar monitoring (Vercel Analytics)
5. ✅ Hacer backup de DB: `pnpm db:backup`

---

## 🔗 Links Útiles

- **GitHub Repo:** https://github.com/TU-USUARIO/TU-REPO
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Actions:** https://github.com/TU-USUARIO/TU-REPO/actions
- **Documentación:** Ver `DOCS_INDEX.md`

---

## 🙏 Todo va a salir bien!

Si necesitas ayuda:
1. Lee el error completo
2. Busca en `CI_CD_README.md` > Troubleshooting
3. Revisa los logs en GitHub Actions o Vercel
4. Pregunta si necesitas ayuda

**¡Éxito en tu deploy!** 🚀
