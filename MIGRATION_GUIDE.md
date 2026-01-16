# 🚀 Guía de Migración: Vercel → VPS (Plan B)

## 📋 Tabla de Contenidos
1. [¿Cuándo migrar?](#cuándo-migrar)
2. [Opciones de VPS](#opciones-de-vps)
3. [Migración Rápida (1-2 horas)](#migración-rápida)
4. [Configuración Avanzada](#configuración-avanzada)
5. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)

---

## 🤔 ¿Cuándo migrar?

### Señales para considerar la migración:
- 💰 Costos de Vercel superan $100/mes
- 🚫 Límites de ejecución (10s en Hobby, 60s en Pro)
- 📊 Necesitas más control sobre la infraestructura
- 🔒 Requisitos de compliance/seguridad específicos
- 🌍 Necesitas servidores en regiones específicas

### Ventajas de VPS:
- ✅ Costos predecibles ($5-20/mes)
- ✅ Sin límites de ejecución
- ✅ Control total del servidor
- ✅ Escalabilidad manual
- ✅ Múltiples aplicaciones en un servidor

### Desventajas de VPS:
- ❌ Requiere mantenimiento manual
- ❌ Necesitas configurar SSL/CDN
- ❌ Sin auto-scaling automático
- ❌ Responsable de seguridad y updates

---

## 🏢 Opciones de VPS

### 1. **DigitalOcean** (Recomendado para principiantes)
**Precio:** $6/mes (1GB RAM, 1 vCPU)
**Pros:**
- Interface amigable
- Documentación excelente
- App Platform (PaaS similar a Vercel)
- Backups automáticos

**Setup:**
```bash
# Opción 1: App Platform (más fácil)
# - Conecta tu repo de GitHub
# - Configura variables de entorno
# - Deploy automático

# Opción 2: Droplet + Docker
doctl compute droplet create socialx \
  --image docker-20-04 \
  --size s-1vcpu-1gb \
  --region nyc1
```

### 2. **Hetzner** (Mejor precio/rendimiento)
**Precio:** €4.15/mes (2GB RAM, 1 vCPU)
**Pros:**
- Mejor relación precio/rendimiento
- Servidores en Europa
- Excelente red

**Setup:**
```bash
# Crear servidor
hcloud server create \
  --name socialx \
  --type cx11 \
  --image docker-ce \
  --location nbg1
```

### 3. **Railway** (Más fácil, similar a Vercel)
**Precio:** $5/mes + uso
**Pros:**
- Deploy desde GitHub automático
- Similar a Vercel
- PostgreSQL incluido

**Setup:**
```bash
# Instalar CLI
npm i -g @railway/cli

# Login y deploy
railway login
railway init
railway up
```

### 4. **Fly.io** (Global edge deployment)
**Precio:** $0 (free tier) + uso
**Pros:**
- Deploy global automático
- Excelente para latencia baja
- CLI potente

**Setup:**
```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### 5. **Render** (Alternativa a Vercel)
**Precio:** $7/mes
**Pros:**
- Similar a Vercel
- PostgreSQL incluido
- SSL automático

---

## ⚡ Migración Rápida (1-2 horas)

### Opción A: Railway (Más Fácil)

#### Paso 1: Preparar el proyecto
```bash
# Ya tienes todo listo con el Dockerfile
git add .
git commit -m "chore: prepare for Railway deployment"
git push
```

#### Paso 2: Deploy en Railway
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Configurar variables de entorno
railway variables set DATABASE_URL="postgresql://..."
railway variables set AUTH_SECRET="..."
# ... (todas las variables de .env)

# Deploy
railway up
```

#### Paso 3: Configurar dominio
```bash
# En Railway dashboard:
# Settings > Domains > Add Custom Domain
# Agregar tu dominio y configurar DNS
```

**Tiempo total: ~30 minutos**

---

### Opción B: DigitalOcean Droplet (Más Control)

#### Paso 1: Crear Droplet
```bash
# Crear droplet con Docker pre-instalado
# Desde DigitalOcean dashboard o CLI:
doctl compute droplet create socialx \
  --image docker-20-04 \
  --size s-2vcpu-2gb \
  --region nyc1 \
  --ssh-keys YOUR_SSH_KEY_ID
```

#### Paso 2: Configurar servidor
```bash
# SSH al servidor
ssh root@YOUR_DROPLET_IP

# Instalar Docker Compose
apt update
apt install -y docker-compose

# Crear directorio
mkdir -p /opt/socialx
cd /opt/socialx
```

#### Paso 3: Subir archivos
```bash
# Desde tu máquina local
scp docker-compose.yml root@YOUR_DROPLET_IP:/opt/socialx/
scp .env root@YOUR_DROPLET_IP:/opt/socialx/
scp Dockerfile root@YOUR_DROPLET_IP:/opt/socialx/

# O clonar desde GitHub
ssh root@YOUR_DROPLET_IP
cd /opt/socialx
git clone https://github.com/tu-usuario/socialx.git .
```

#### Paso 4: Deploy
```bash
# En el servidor
cd /opt/socialx

# Build y start
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

#### Paso 5: Configurar Nginx + SSL
```bash
# Instalar Nginx
apt install -y nginx certbot python3-certbot-nginx

# Configurar Nginx
cat > /etc/nginx/sites-available/socialx << 'EOF'
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Activar sitio
ln -s /etc/nginx/sites-available/socialx /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Configurar SSL
certbot --nginx -d tu-dominio.com
```

**Tiempo total: ~1-2 horas**

---

### Opción C: Fly.io (Global Edge)

#### Paso 1: Instalar CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### Paso 2: Login y crear app
```bash
fly auth login
fly launch --name socialx
```

#### Paso 3: Configurar secrets
```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set AUTH_SECRET="..."
# ... todas las variables
```

#### Paso 4: Deploy
```bash
fly deploy
```

**Tiempo total: ~20 minutos**

---

## 🔧 Configuración Avanzada

### 1. Auto-Deploy con GitHub Actions

Crear `.github/workflows/deploy-vps.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/socialx
            git pull
            docker-compose down
            docker-compose up -d --build
```

### 2. Configurar CDN (Cloudflare)

```bash
# 1. Agregar dominio a Cloudflare
# 2. Configurar DNS:
#    A record: @ -> YOUR_VPS_IP
#    A record: www -> YOUR_VPS_IP
# 3. Activar proxy (nube naranja)
# 4. Configurar SSL: Full (strict)
```

### 3. Backups Automáticos

```bash
# Crear script de backup
cat > /opt/socialx/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec socialx-postgres pg_dump -U postgres socialx > /backups/db_$DATE.sql
gzip /backups/db_$DATE.sql
# Mantener solo últimos 7 días
find /backups -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/socialx/backup.sh

# Agregar a crontab (diario a las 2 AM)
crontab -e
# Agregar: 0 2 * * * /opt/socialx/backup.sh
```

### 4. Monitoreo con Uptime Robot

1. Ir a https://uptimerobot.com
2. Crear monitor HTTP(s)
3. URL: https://tu-dominio.com/api/health
4. Intervalo: 5 minutos
5. Alertas: Email/SMS

---

## 📊 Monitoreo y Mantenimiento

### Comandos útiles

```bash
# Ver logs
docker-compose logs -f app

# Ver recursos
docker stats

# Reiniciar app
docker-compose restart app

# Ver estado
docker-compose ps

# Actualizar app
cd /opt/socialx
git pull
docker-compose up -d --build

# Backup manual
docker exec socialx-postgres pg_dump -U postgres socialx > backup.sql
```

### Métricas a monitorear

- ✅ Uptime (Uptime Robot)
- ✅ Response time
- ✅ CPU/RAM usage
- ✅ Disk space
- ✅ Database connections
- ✅ Error rate

---

## 💰 Comparación de Costos

### Vercel
- Hobby: $0 (limitado)
- Pro: $20/mes + $40/miembro
- Enterprise: $500+/mes

### VPS (DigitalOcean)
- Basic: $6/mes (1GB RAM)
- Standard: $12/mes (2GB RAM)
- Pro: $24/mes (4GB RAM)

### Railway
- Starter: $5/mes + uso
- Pro: $20/mes + uso

### Fly.io
- Free tier: $0 (limitado)
- Pay as you go: ~$5-15/mes

---

## 🎯 Recomendación Final

### Para empezar:
1. **Vercel** - Perfecto para MVP y desarrollo
2. Cuando llegues a ~1000 usuarios → **Railway** o **Fly.io**
3. Cuando llegues a ~10,000 usuarios → **DigitalOcean Droplet**
4. Cuando llegues a ~100,000 usuarios → **Kubernetes** o **AWS ECS**

### El "seguro de vida":
- ✅ Mantén el Dockerfile actualizado
- ✅ Prueba el build de Docker localmente cada mes
- ✅ Ten un VPS de backup configurado (puede estar apagado)
- ✅ Documenta el proceso de migración

**Con estos archivos, puedes migrar de Vercel a VPS en menos de 2 horas si es necesario.**

---

**Última actualización:** 2025-01-15
