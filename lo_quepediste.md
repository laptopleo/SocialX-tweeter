{
  "name": "replicax",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev:webpack": "next dev",
    "dev": "next dev --turbo",
    "dev:normal": "next dev",
    "build:clean": "if exist .next (rd /s /q .next) && pnpm build",
    "build": "next build",
    "deep-clean": "rd /s /q .next node_modules pnpm-lock.yaml && pnpm install",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "validate": "pnpm lint && pnpm type-check",
    "health-check": "bash health-check.sh",
    "health-check-win": "health-check.bat",
    "advanced-scan": "node advanced-scan.js",
    "full-analysis": "npm run health-check && npm run advanced-scan",
    "pre-deploy": "bash scripts/pre-deploy.sh",
    "check-secrets": "bash scripts/check-secrets.sh",
    "db:backup": "bash scripts/db-backup.sh",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "docker:build": "bash scripts/docker-build.sh",
    "docker:run": "docker run -p 3000:3000 --env-file .env socialx",
    "docker:compose:up": "docker-compose up -d",
    "docker:compose:down": "docker-compose down",
    "docker:compose:logs": "docker-compose logs -f app",
    "docker:deploy": "bash scripts/docker-deploy.sh",
    "test": "echo 'No tests specified yet'",
    "test:ci": "echo 'No tests specified yet'",
    "postinstall": "prisma generate",
    "prepare": "node -e \"try { require('husky').install() } catch (e) {}\""
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.7.4",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@hookform/resolvers": "4.1.0",
    "@mui/icons-material": "^6.4.3",
    "@mui/material": "^6.4.3",
    "@prisma/client": "^6.4.0",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@stripe/react-stripe-js": "^3.1.1",
    "@stripe/stripe-js": "^5.5.0",
    "@tanstack/react-query": "^5.90.8",
    "@tiptap/core": "^2.7.0",
    "@tiptap/pm": "^2.7.0",
    "@tiptap/react": "^2.11.5",
    "@vercel/speed-insights": "^1.2.0",
    "axios": "^1.7.9",
    "bcryptjs": "3.0.2",
    "class-variance-authority": "^0.7.1",
    "classnames": "^2.5.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dotenv": "^17.2.3",
    "lucide-react": "0.475.0",
    "next": "^15.1.6",
    "next-auth": "^5.0.0-beta.25",
    "next-themes": "^0.4.4",
    "pusher": "^5.3.2",
    "pusher-js": "^8.4.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-dropzone": "^14.3.5",
    "react-hook-form": "^7.54.2",
    "react-intersection-observer": "^10.0.0",
    "stripe": "^17.5.0",
    "tailwind-merge": "^2.6.0",
    "tailwind-scrollbar-hide": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "webpack": "^5.97.1",
    "zod": "^3.24.1",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@svgr/webpack": "^8.1.0",
    "@tailwindcss/line-clamp": "^0.4.4",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "22.13.4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/webpack": "^5.28.5",
    "autoprefixer": "^10.4.20",
    "eslint": "8.57.0",
    "eslint-config-next": "16.1.1",
    "postcss": "^8.5.3",
    "prisma": "^6.4.0",
    "tailwind-scrollbar": "^3.1.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}





{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "target": "ES2017"
  },
  "include": [
    "svgr.d.ts",
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
, "apply-indexes.js"  ],
  "exclude": [
    "node_modules"
  ]
}




$ ls -la
total 262
drwxr-xr-x 1 leo 197609     0 Jan 16 14:39 ./
drwxr-xr-x 1 leo 197609     0 Jan 15 17:14 ../
-rw-r--r-- 1 leo 197609   925 Jan 15 18:58 .dockerignore
-rw-r--r-- 1 leo 197609  2757 Jan 15 21:14 .env
-rw-r--r-- 1 leo 197609  1981 Jan 15 19:38 .env.example
drwxr-xr-x 1 leo 197609     0 Jan 16 13:57 .git/
drwxr-xr-x 1 leo 197609     0 Jan 15 18:42 .github/
-rw-r--r-- 1 leo 197609  2798 Jan 15 19:37 .gitignore
-rw-r--r-- 1 leo 197609   920 Jan 15 18:41 .npmrc
-rw-r--r-- 1 leo 197609   788 Jan 15 18:42 .prettierignore
-rw-r--r-- 1 leo 197609   427 Jan 15 18:41 .prettierrc
drwxr-xr-x 1 leo 197609     0 Jan 14 02:26 .vscode/
-rwxr-xr-x 1 leo 197609 12974 Jan 13 17:23 advanced-scan.js*
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 app/
-rw-r--r-- 1 leo 197609  2349 Nov 13 17:29 apply-indexes.js
-rw-r--r-- 1 leo 197609  4218 Nov 13 17:00 check-security.js
-rw-r--r-- 1 leo 197609 10617 Jan 15 19:28 CI_CD_README.md
drwxr-xr-x 1 leo 197609     0 Jan 13 23:48 components/
-rw-r--r-- 1 leo 197609   462 Nov 12 08:13 components.json
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 constants/
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 context/
-rw-r--r-- 1 leo 197609  1702 Nov 12 19:19 create-user.js
-rw-r--r-- 1 leo 197609   756 Nov 12 19:05 create-user.sql
-rw-r--r-- 1 leo 197609  6817 Jan 15 19:00 DEPLOYMENT_OPTIONS.md
-rw-r--r-- 1 leo 197609  4649 Jan 15 18:58 docker-compose.yml
-rw-r--r-- 1 leo 197609  2894 Jan 15 18:57 Dockerfile
-rw-r--r-- 1 leo 197609  6776 Jan 15 19:28 DOCS_INDEX.md
drwxr-xr-x 1 leo 197609     0 Jan 14 01:01 hooks/
-rw-r--r-- 1 leo 197609   204 Jan 15 16:05 instrumentation.ts
drwxr-xr-x 1 leo 197609     0 Jan 15 13:39 lib/
-rw-r--r-- 1 leo 197609  4632 Jan 16 14:39 lo_quepediste.md
-rw-r--r-- 1 leo 197609   995 Jan 15 13:43 middleware.ts
-rw-r--r-- 1 leo 197609  9142 Jan 15 18:59 MIGRATION_GUIDE.md
-rw-r--r-- 1 leo 197609  2611 Jan 15 18:58 next.config.ts
-rw-r--r-- 1 leo 197609   610 Nov 13 09:09 next-auth.d.ts
-rw-r--r-- 1 leo 197609   268 Nov 12 09:05 next-env.d.ts
-rw-r--r-- 1 leo 197609  3761 Jan 16 14:18 package.json
-rw-r--r-- 1 leo 197609   157 Nov 12 08:13 postcss.config.mjs
-rw-r--r-- 1 leo 197609  5558 Jan 15 19:38 PRE_COMMIT_CHECKLIST.md
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 prisma/
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 public/
-rw-r--r-- 1 leo 197609  2843 Jan 15 20:55 PUSHER_FIX.md
-rw-r--r-- 1 leo 197609  4641 Jan 15 19:39 QUICK_START.md
-rw-r--r-- 1 leo 197609  1590 Jan 15 19:57 README.md
-rw-r--r-- 1 leo 197609  3664 Jan 15 18:37 resultado.md
drwxr-xr-x 1 leo 197609     0 Jan 15 19:38 scripts/
-rw-r--r-- 1 leo 197609  9107 Jan 15 19:18 SCRIPTS_OVERVIEW.md
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 shared/
drwxr-xr-x 1 leo 197609     0 Dec  2 17:04 store/
-rw-r--r-- 1 leo 197609   299 Nov 12 08:13 svgr.d.ts
-rw-r--r-- 1 leo 197609  2262 Nov 19 08:36 tailwind.config.ts
-rw-r--r-- 1 leo 197609   744 Nov 18 10:00 tsconfig.json
drwxr-xr-x 1 leo 197609     0 Jan 14 00:47 types/
-rw-r--r-- 1 leo 197609  1861 Jan 15 21:57 vercel.json





.npmrc
# Usar lockfile estricto
lockfile=true

# Auto-install peers
auto-install-peers=true

# Configuración de caché
store-dir=~/.pnpm-store

# Configuración de instalación
prefer-frozen-lockfile=true

# Configuración de resolución
resolution-mode=highest

# Configuración de logging
loglevel=warn

# Configuración de red
network-timeout=60000
fetch-retries=3
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000

# Configuración de seguridad
strict-ssl=true

# Configuración de performance
side-effects-cache=true
side-effects-cache-readonly=false

# Configuración de hoisting
shamefully-hoist=false
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
