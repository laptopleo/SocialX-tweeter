// prisma.config.ts (en la raíz del proyecto)
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // Ruta a tu esquema
  migrations: {
    path: "prisma/migrations", // Ruta a tus migraciones
  },
  datasource: {
    url: env("DATABASE_URL"), // La URL de conexión se define AQUÍ
    // Opcional: Si usas conexión directa para migraciones (ej. en Supabase)
    // url: env('DIRECT_DATABASE_URL'),
  },
});
