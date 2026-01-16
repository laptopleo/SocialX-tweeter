// ⚡ Rate limiting para prevenir abuso de APIs
// Usa memoria en desarrollo, Redis en producción

type RateLimitConfig = {
  interval: number; // Ventana de tiempo en ms
  uniqueTokenPerInterval: number; // Máximo de tokens únicos
};

const rateLimiters = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiter simple basado en memoria (para desarrollo)
 * En producción, usar @upstash/ratelimit con Redis
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 10, // 10 requests
  }
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Limpiar entradas expiradas
  for (const [k, v] of rateLimiters.entries()) {
    if (v.resetTime < now) {
      rateLimiters.delete(k);
    }
  }

  const current = rateLimiters.get(key);

  if (!current) {
    // Primera request
    rateLimiters.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return { success: true, remaining: config.uniqueTokenPerInterval - 1 };
  }

  if (current.resetTime < now) {
    // Ventana expirada, resetear
    rateLimiters.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return { success: true, remaining: config.uniqueTokenPerInterval - 1 };
  }

  if (current.count >= config.uniqueTokenPerInterval) {
    // Límite excedido
    return { success: false, remaining: 0 };
  }

  // Incrementar contador
  current.count++;
  return {
    success: true,
    remaining: config.uniqueTokenPerInterval - current.count,
  };
}

/**
 * Helper para obtener identificador único del request
 */
export function getIdentifier(request: Request): string {
  // Usar IP del cliente
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

/**
 * Configuraciones predefinidas
 */
export const RATE_LIMITS = {
  // Endpoints de autenticación (más restrictivo)
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutos
    uniqueTokenPerInterval: 5, // 5 intentos
  },
  // Endpoints de escritura (moderado)
  WRITE: {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 10, // 10 requests
  },
  // Endpoints de lectura (permisivo)
  READ: {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 60, // 60 requests
  },
} as const;
