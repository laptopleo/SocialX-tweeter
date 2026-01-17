# SocialX Tweeter

Replica moderna estilo X/Twitter construida con Next.js 15, Prisma y NextAuth. Foco en rendimiento, seguridad y DX sólida.

## Stack

- Next.js 15 (App Router, Server/Client Components)
- NextAuth v5 (Google + Credentials)
- Prisma + PostgreSQL
- React Query, TailwindCSS, Shadcn UI
- Stripe (Pro), Redis (cache opcional)

## Rutas y Seguridad

- Públicas (SEO + compartible): `/`, `/search`, `/:username`, `/:username/post/:postId`.
- Privadas: el resto (`/notifications`, `/settings`, etc.).
- Middleware centralizado en `middleware.ts` usando `auth` para proteger rutas y redirigir sin sesión a `/` con `callbackUrl`.

## Renderizado

- `/:username` y `/:username/post/:postId` usan ISR con `revalidate = 60`.
- APIs sensibles requieren sesión en servidor (p.ej. `current-user`, `users`, `notifications`, `edit`).

## Setup Rápido

1. Copia variables: `.env.example` → `.env.local` (define `DATABASE_URL`, OAuth, Stripe si aplica).
2. Instala dependencias:

```bash
pnpm install
```

3. Genera Prisma e inicializa DB:

```bash
pnpm postinstall   # ejecuta prisma generate
npx prisma migrate dev
```

## Desarrollo

```bash
pnpm dev        # dev server (turbo)
pnpm dev:normal # dev server normal
```

## Producción

```bash
pnpm build
pnpm start
```

## Scripts útiles

- `apply-indexes.js`: aplica índices a la base de datos (opcional).

## Notas

- Prisma está configurado para Node.js runtime y logs mínimos en prod.
- Si habilitas búsqueda pública, añade rate limiting en `lib/rate-limit.ts` y valida selects.
