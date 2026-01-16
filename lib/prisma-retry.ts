import { prisma } from './prismadb';

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Códigos de error de conexión de Prisma
      const isConnectionError =
        ['P1001', 'P1002', 'P1008', 'P1017'].includes(error.code);

      if (!isConnectionError || attempt === maxRetries) throw error;

      console.warn(`⚠️ DB Error (intento ${attempt}/${maxRetries}). Reintentando...`);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; 
      
      // ⚡ CAMBIO CLAVE: Eliminamos el $disconnect y $connect manual.
      // Prisma manejará la reconexión solo al ejecutar la 'operation' de nuevo.
    }
  }
  throw lastError;
}

// Mantén tu objeto 'db' igual, pero simplificado
export const db = {
  user: {
    findUnique: (args: any) => withRetry(() => prisma.user.findUnique(args)),
    findMany: (args?: any) => withRetry(() => prisma.user.findMany(args)),
    create: (args: any) => withRetry(() => prisma.user.create(args)),
    update: (args: any) => withRetry(() => prisma.user.update(args)),
    delete: (args: any) => withRetry(() => prisma.user.delete(args)),
  },
  post: {
    findUnique: (args: any) => withRetry(() => prisma.post.findUnique(args)),
    findMany: (args?: any) => withRetry(() => prisma.post.findMany(args)),
    create: (args: any) => withRetry(() => prisma.post.create(args)),
    update: (args: any) => withRetry(() => prisma.post.update(args)),
    delete: (args: any) => withRetry(() => prisma.post.delete(args)),
  },
};